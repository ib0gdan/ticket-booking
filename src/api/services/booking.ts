import instance from '@/api/clients/axios.client';

export const bookingApi = {
  bookSeats: (movieSessionId: number): Promise<{ bookingId: number }> =>
    instance.post(`/movieSessions/${movieSessionId}/bookings`).then((res) => res.data),
  pay: (bookingId: string): Promise<{ message: string }> =>
    instance.post(`/bookings/${bookingId}/payments`).then((res) => res.data),
  getMyBookings: (): Promise<{ bookingId: number }[]> =>
    instance.get('/me/bookings').then((res) => res.data),
};
