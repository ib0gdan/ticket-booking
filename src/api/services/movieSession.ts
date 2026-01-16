import instance from '@/api/clients/axios.client';
import type { MovieSession } from '../types';

export class MovieSessionService {
  static async getMovieSessions(movieSessionId: number): Promise<MovieSession> {
    const response = await instance.get(`/movieSessions/${movieSessionId}`);
    return response.data;
  }
}
