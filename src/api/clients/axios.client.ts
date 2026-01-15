import axios from 'axios';
import { setupAuthInterceptor } from '@/api/interceptors/axios.interceptor';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

setupAuthInterceptor(instance);

export default instance;
