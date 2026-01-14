import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';
import { ref, computed } from 'vue';

import { authApi } from '@/api/services';
import { type AuthResponse, type AuthCredentials } from '@/api/types';

export type AuthContext = {
  logout: () => void;
  register: () => void;
  login: (credentials: AuthCredentials) => Promise<void>;
  error: string | null;
};

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  const userName = ref<string | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));

  const isAuthenticated = computed(() => !!token.value);
  const isLoading = computed(() => isLoginPending.value || isRegisterPending.value);
  const error = computed(() => registerMutationError.value || loginMutationError.value);

  const onSuccess = (data: AuthResponse, params: AuthCredentials) => {
    token.value = data.token;
    userName.value = params.username;
    localStorage.setItem('token', data.token);

    router.push({ name: 'Фильмы' });
  };

  const {
    mutate: loginMutate,
    error: loginMutationError,
    isPending: isLoginPending,
  } = useMutation({
    mutationFn: ({ username, password }: AuthCredentials) => authApi.login({ username, password }),
    onSuccess,
  });

  const {
    mutate: registerMutate,
    error: registerMutationError,
    isPending: isRegisterPending,
  } = useMutation({
    mutationFn: ({ username, password }: AuthCredentials) =>
      authApi.register({ username, password }),
    onSuccess: onSuccess,
  });

  const logout = () => {
    token.value = null;
    localStorage.removeItem('token');
  };

  return {
    userName,
    token,
    isAuthenticated,
    login: loginMutate,
    register: registerMutate,
    logout,
    isLoading,
    error,
  };
});
