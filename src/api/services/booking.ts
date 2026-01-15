import instance from '@/api/clients/axios.client';
import type { Seat } from '../types';
import type { BookingDetails } from '../types/booking';

export const bookingApi = {
  bookSeats: ({
    movieSessionId,
    seats,
  }: {
    movieSessionId: number;
    seats: Seat[];
  }): Promise<{ bookingId: number }> =>
    instance.post(`/movieSessions/${movieSessionId}/bookings`, { seats }).then((res) => res.data),
  pay: (bookingId: string): Promise<{ message: string }> =>
    instance.post(`/bookings/${bookingId}/payments`).then((res) => res.data),
  getMyBookings: (): Promise<BookingDetails[]> =>
    instance.get('/me/bookings').then((res) => res.data),
};
