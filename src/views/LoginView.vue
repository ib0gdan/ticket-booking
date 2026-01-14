<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { AxiosError } from 'axios';
import { useAuthStore } from '@/store/modules/auth';
import AuthForm from '@/components/auth/AuthForm.vue';
import type { AuthCredentials } from '@/api/types';

const authStore = useAuthStore();
const { login } = authStore;
const { isLoading, error } = storeToRefs(authStore);

const errorMessage = computed(() => {
  if (!error.value) return '';
  if (error.value instanceof AxiosError) return error.value.response?.data?.message || 'Login failed';
  return String(error.value);
});

const handleLogin = (data: AuthCredentials) => {
  login({
    username: data.username,
    password: data.password
  });
};
</script>

<template>
  <AuthForm type="login" :isLoading="isLoading" :error="errorMessage" @submit="handleLogin" />
</template>
