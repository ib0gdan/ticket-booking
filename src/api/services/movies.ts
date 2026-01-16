import instance from '@/api/clients/axios.client';
import type { Movie, Session } from '../types';

export class MovieService {
  static async getAll(): Promise<Movie[]> {
    const response = await instance.get('/movies');
    return response.data;
  }
  static async getSessionsByMovieId(id: number): Promise<Session[]> {
    const response = await instance.get(`/movies/${id}/sessions`);
    return response.data;
  }
}
