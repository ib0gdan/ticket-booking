import instance from '@/api/clients/axios.client';
import type { Cinema, Session } from '../types';

export const cinemaApi = {
  getAll: (): Promise<Cinema[]> => instance.get('/cinemas').then((res) => res.data),
  getSessionsByCinemaId: (cinemaId: number): Promise<Session[]> =>
    instance.get(`/cinemas/${cinemaId}/sessions`).then((res) => res.data),
};
