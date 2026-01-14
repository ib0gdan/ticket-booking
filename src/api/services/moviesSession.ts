import instance from '@/api/clients/axios.client';
import type { MovieSession } from '../types';

export const moviesApi = {
  getMovieSessions: (movieSessionId: number): Promise<MovieSession[]> =>
    instance.get(`/movieSessions/${movieSessionId}`).then((res) => res.data),
  bookSession: (movieSessionId: number): Promise<{ bookingId: number }> =>
    instance.post(`/movieSessions/${movieSessionId}/bookings`).then((res) => res.data),
};
