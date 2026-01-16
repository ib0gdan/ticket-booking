import instance from '@/api/clients/axios.client';
import type { AuthCredentials, AuthResponse, BookingDetails } from '../types';

export class AuthService {
  static async login({ username, password }: AuthCredentials): Promise<AuthResponse> {
    const response = await instance.post('/login', { username, password });
    return response.data;
  }

  static async register({ username, password }: AuthCredentials): Promise<AuthResponse> {
    const response = await instance.post('/register', { username, password });
    return response.data;
  }

  static async getBookings(): Promise<BookingDetails[]> {
    const response = await instance.get('/me/bookings');
    return response.data;
  }
}
