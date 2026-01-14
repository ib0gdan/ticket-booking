import instance from '@/api/clients/axios.client';
import type { Movie, Session } from '../types';

export const moviesApi = {
  getAll: (): Promise<Movie[]> => instance.get('/movies').then((res) => res.data),
  getSessionsByMovieId: (id: number): Promise<Session[]> =>
    instance.get(`/movies/${id}/sessions`).then((res) => res.data),
};
