import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';
import { ref, computed } from 'vue';

import { AuthService } from '@/api/services';
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

    const redirect = router.currentRoute.value.query.redirect;
    if (redirect) {
      router.push(redirect as string);
    } else {
      router.push({ name: 'Фильмы' });
    }
  };

  const {
    mutate: loginMutate,
    error: loginMutationError,
    isPending: isLoginPending,
  } = useMutation({
    mutationFn: ({ username, password }: AuthCredentials) =>
      AuthService.login({ username, password }),
    onSuccess,
  });

  const {
    mutate: registerMutate,
    error: registerMutationError,
    isPending: isRegisterPending,
  } = useMutation({
    mutationFn: ({ username, password }: AuthCredentials) =>
      AuthService.register({ username, password }),
    onSuccess: onSuccess,
  });

  const logout = () => {
    token.value = null;
    localStorage.removeItem('token');
    if (router.currentRoute.value.meta.requiresAuth) {
      router.push({ name: 'Фильмы' });
    }
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
