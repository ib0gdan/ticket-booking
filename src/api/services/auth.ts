import instance from '@/api/clients/axios.client';
import type { AuthCredentials, AuthResponse } from '../types';

export const authApi = {
  login: ({ username, password }: AuthCredentials): Promise<AuthResponse> =>
    instance.post('/login', { username, password }).then((res) => res.data),

  register: ({ username, password }: AuthCredentials): Promise<AuthResponse> =>
    instance.post('/register', { username, password }).then((res) => res.data),
};
