import instance from '@/api/clients/axios.client';
import type { BookSeatsRequest } from '../types';

export class BookingService {
  static async bookSeats({
    movieSessionId,
    seats,
  }: BookSeatsRequest): Promise<{ bookingId: number }> {
    const response = await instance.post(`/movieSessions/${movieSessionId}/bookings`, { seats });
    return response.data;
  }
  static async pay(bookingId: string): Promise<{ message: string }> {
    const response = await instance.post(`/bookings/${bookingId}/payments`);
    return response.data;
  }
}
