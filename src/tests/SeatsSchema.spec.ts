import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SeatsSchema from '@/components/booking/SeatsSchema.vue';

vi.mock('@/components/common/Tooltip.vue', () => ({
  default: {
    template: '<div><slot /></div>',
    props: ['text'],
  },
}));

describe('SeatsSchema', () => {
  const defaultProps = {
    rows: 3,
    seatsPerRow: 4,
    bookedSeats: [
      { rowNumber: 1, seatNumber: 1 },
      { rowNumber: 2, seatNumber: 2 },
    ],
    modelValue: [],
  };

  it('отображает правильное количество рядов и мест', () => {
    const wrapper = mount(SeatsSchema, {
      props: defaultProps,
    });

    const buttons = wrapper.findAll('button[type="button"]');
    expect(buttons.length).toBe(12);
  });

  it('отображает правильно забронированные места', () => {
    const wrapper = mount(SeatsSchema, {
      props: defaultProps,
    });

    const buttons = wrapper.findAll('button[type="button"]');
    const bookedSeat1 = buttons[0];
    const bookedSeat2 = buttons[5];
    const freeSeat = buttons[1];

    expect(bookedSeat1?.classes()).toContain('bg-red-200');
    expect(bookedSeat1?.classes()).toContain('cursor-not-allowed!');

    expect(bookedSeat2?.classes()).toContain('bg-red-200');

    expect(freeSeat?.classes()).not.toContain('bg-red-200');
    expect(freeSeat?.classes()).not.toContain('cursor-not-allowed!');
  });

  it('делает update:modelValue при клике на свободное место', async () => {
    const wrapper = mount(SeatsSchema, {
      props: defaultProps,
    });

    const buttons = wrapper.findAll('button[type="button"]');
    const freeSeat = buttons[1];
    await freeSeat?.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]?.[0]).toEqual([
      { rowNumber: 1, seatNumber: 2 },
    ]);
  });

  it('не делает update:modelValue при клике на забронированное место', async () => {
    const wrapper = mount(SeatsSchema, {
      props: defaultProps,
    });

    const buttons = wrapper.findAll('button[type="button"]');
    const bookedSeat = buttons[0];

    await bookedSeat?.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeFalsy();
  });

  it('снимает выделение с выбранного места при повторном клике', async () => {
    const wrapper = mount(SeatsSchema, {
      props: {
        ...defaultProps,
        modelValue: [{ rowNumber: 1, seatNumber: 2 }],
      },
    });

    const buttons = wrapper.findAll('button[type="button"]');
    const selectedSeat = buttons[1];

    expect(selectedSeat?.classes()).toContain('bg-blue-600');

    await selectedSeat?.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]?.[0]).toEqual([]);
  });

  it('позволяет выбирать несколько мест', async () => {
    const wrapper = mount(SeatsSchema, {
      props: {
        ...defaultProps,
        modelValue: [{ rowNumber: 1, seatNumber: 2 }],
      },
    });

    const buttons = wrapper.findAll('button[type="button"]');
    const anotherSeat = buttons[2];

    await anotherSeat?.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([
      { rowNumber: 1, seatNumber: 2 },
      { rowNumber: 1, seatNumber: 3 },
    ]);
  });

  it('обрабатывает undefined modelValue корректно', async () => {
    const propsWithoutModelValue = {
      rows: 3,
      seatsPerRow: 4,
      bookedSeats: [],
    };

    const wrapper = mount(SeatsSchema, {
      props: propsWithoutModelValue,
    });

    const buttons = wrapper.findAll('button[type="button"]');
    const freeSeat = buttons[0];

    await freeSeat?.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]?.[0]).toEqual([
      { rowNumber: 1, seatNumber: 1 },
    ]);
  });
});
