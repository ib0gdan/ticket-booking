<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/store/modules/auth';
import { storeToRefs } from 'pinia';
import { AxiosError } from 'axios';
import AuthForm from '@/components/auth/AuthForm.vue';
import type { AuthCredentials } from '@/api/types';

const authStore = useAuthStore();
const { register } = authStore;
const { isLoading, error } = storeToRefs(authStore);

const errorMessage = computed(() => {
  if (!error.value) return '';
  if (error.value instanceof AxiosError) return error.value.response?.data?.message || 'Registration failed';
  return String(error.value);
});

const handleRegister = (data: AuthCredentials) => {
  register({
    username: data.username,
    password: data.password
  });
};
</script>

<template>
  <div class="w-full h-screen flex items-center justify-center">
    <AuthForm type="register" :isLoading="isLoading" :error="errorMessage" @submit="handleRegister" />
  </div>
</template>
