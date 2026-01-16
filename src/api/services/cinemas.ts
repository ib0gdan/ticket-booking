import instance from '@/api/clients/axios.client';
import type { Cinema, Session } from '../types';

export class CinemaService {
  static async getAll(): Promise<Cinema[]> {
    const response = await instance.get('/cinemas');
    return response.data;
  }
  static async getSessionsByCinemaId(cinemaId: number): Promise<Session[]> {
    const response = await instance.get(`/cinemas/${cinemaId}/sessions`);
    return response.data;
  }
}
