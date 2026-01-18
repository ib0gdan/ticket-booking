import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import BookingCard from '@/components/booking/BookingCard.vue';

vi.mock('@/components/booking/PaymentTimer.vue', () => ({
  default: {
    name: 'PaymentTimer',
    template: '<div>Timer</div>',
    props: ['bookedAt', 'expireSeconds'],
    emits: ['expired'],
  },
}));

describe('BookingCard', () => {
  const globalStubs = {
    stubs: {
      PaymentTimer: true,
    },
  };

  const mockBooking = {
    id: '1',
    isPaid: false,
    bookedAt: new Date('2024-01-15T10:00:00Z'),
    seats: [
      { rowNumber: 1, seatNumber: 1 },
      { rowNumber: 1, seatNumber: 2 },
    ],
    startTime: '2024-01-15T18:00:00Z',
    userId: 123,
    movieSessionId: 456,
    sessionId: 789,
  };

  const mockProps = {
    booking: mockBooking,
    movieTitle: 'Интерстеллар',
    cinemaName: 'Moon',
  };

  it('отображает информацию о бронировании', () => {
    const wrapper = mount(BookingCard, {
      props: mockProps,
      global: globalStubs,
    });

    expect(wrapper.text()).toContain('Интерстеллар');
    expect(wrapper.text()).toContain('Moon');
    expect(wrapper.text()).toContain('Ряд 1, место 1');
    expect(wrapper.text()).toContain('Ряд 1, место 2');
  });

  it('показывает кнопку оплаты для неоплаченных билетов', () => {
    const wrapper = mount(BookingCard, {
      props: {
        ...mockProps,
        showPayment: true,
      },
      global: globalStubs,
    });
    expect(wrapper.find('button').text()).toContain('Оплатить');
  });

  it('скрывает кнопку оплаты для оплаченных билетов', () => {
    const wrapper = mount(BookingCard, {
      props: {
        ...mockProps,
        booking: { ...mockBooking, isPaid: true },
        showPayment: false,
      },
      global: globalStubs,
    });

    const payButton = wrapper.findAll('button').find((b) => b.text().includes('Оплатить'));
    expect(payButton).toBeUndefined();
  });

  it('вызывает оплату при клике', async () => {
    const wrapper = mount(BookingCard, {
      props: {
        ...mockProps,
        showPayment: true,
      },
      global: globalStubs,
    });

    await wrapper.find('button').trigger('click');

    expect(wrapper.emitted('pay')).toBeTruthy();
    expect(wrapper.emitted('pay')?.[0]).toStrictEqual(['1']);
  });

  it('вызывает событие истечения времени оплаты', async () => {
    const wrapper = mount(BookingCard, {
      props: {
        ...mockProps,
        showPayment: true,
        paymentTimeSeconds: 60,
      },
      global: globalStubs,
    });

    const paymentTimer = wrapper.findComponent({ name: 'PaymentTimer' });
    expect(paymentTimer.exists()).toBe(true);

    await paymentTimer.vm.$emit('expired');

    expect(wrapper.emitted('expired')).toBeTruthy();
  });
});
