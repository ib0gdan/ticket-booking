import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';

export const setupAuthInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('token');

      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        const isAuthRequest =
          error.config?.url?.includes('/login') || error.config?.url?.includes('/register');

        if (!isAuthRequest) {
          const { useAuthStore } = await import('@/store/modules/auth');

          const authStore = useAuthStore();
          authStore.logout();
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};
