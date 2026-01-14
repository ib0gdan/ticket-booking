import instance from '@/api/clients/axios.client';
import type { MovieSession } from '../types';

export const movieSessionApi = {
  getMovieSessions: (movieSessionId: number): Promise<MovieSession[]> =>
    instance.get(`/movieSessions/${movieSessionId}`).then((res) => res.data),
};
