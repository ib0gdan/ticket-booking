<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { z } from 'zod';
import { loginSchema, registerSchema, type LoginCredentials, type RegisterInput } from '@/utils/schemas/auth';
import Loader from '../common/Loader.vue';

interface Props {
  type: 'login' | 'register';
  isLoading: boolean;
  error?: string | null;
}

const props = defineProps<Props>();



const emit = defineEmits<{
  (e: 'submit', data: LoginCredentials | RegisterInput): void;
}>();

const username = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const fieldErrors = ref<Record<string, string>>({});

const title = computed(() => props.type === 'login' ? 'Вход' : 'Регистрация');

const buttonText = computed(() => {
  if (props.isLoading) return props.type === 'login' ? 'Вход...' : 'Регистрация...';
  return props.type === 'login' ? 'Войти' : 'Зарегистрироваться';
});

const handleSubmit = () => {
  fieldErrors.value = {};

  const data = {
    username: username.value,
    password: password.value,
    ...(props.type === 'register' ? { passwordConfirmation: passwordConfirmation.value } : {})
  };

  try {
    const schema = props.type === 'login' ? loginSchema : registerSchema;
    schema.parse(data);
    emit('submit', data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      err.issues.forEach((e) => {
        if (e.path.length > 0) {
          fieldErrors.value[String(e.path[0])] = e.message;
        }
      });
    }
  }
};

const validateField = (field: string) => {
  const data = {
    username: username.value,
    password: password.value,
    ...(props.type === 'register' ? { passwordConfirmation: passwordConfirmation.value } : {})
  };

  const schema = props.type === 'login' ? loginSchema : registerSchema;
  const result = schema.safeParse(data);

  if (!result.success) {
    const issue = result.error.issues.find(i => i.path[0] === field);
    if (issue) {
      fieldErrors.value[field] = issue.message;
    } else {
      delete fieldErrors.value[field];
    }
  } else {
    fieldErrors.value = {};
  }
};
</script>

<template>

  <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
    <div class="text-center">
      <h2 class="mt-2 text-3xl font-bold tracking-tight text-gray-900">
        {{ title }}
      </h2>
    </div>

    <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <div>
          <label for="username" class="sr-only">Имя пользователя</label>
          <input id="username" v-model="username" autocomplete="username" name="username" type="text"
            class="relative block w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors duration-200"
            placeholder="Имя пользователя" @blur="validateField('username')" />
          <p v-if="fieldErrors.username" class="mt-1 text-sm text-red-500">{{ fieldErrors.username }}</p>
        </div>
        <!-- Password Input -->
        <div>
          <label for="password" class="sr-only">Пароль</label>
          <input id="password" v-model="password" autocomplete="current-password" name="password" type="password"
            class="relative block w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors duration-200"
            placeholder="Пароль" @blur="validateField('password')" />
          <p v-if="fieldErrors.password" class="mt-1 text-sm text-red-500">{{ fieldErrors.password }}</p>
        </div>
        <!-- Password Confirmation Input (Register only) -->
        <div v-if="type === 'register'">
          <label for="passwordConfirmation" class="sr-only">Подтвердите пароль</label>
          <input id="passwordConfirmation" v-model="passwordConfirmation" autocomplete="confirm-password"
            name="passwordConfirmation" type="password"
            class="relative block w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors duration-200"
            placeholder="Подтвердите пароль" @blur="validateField('passwordConfirmation')" />
          <p v-if="fieldErrors.passwordConfirmation" class="mt-1 text-sm text-red-500">{{
            fieldErrors.passwordConfirmation }}</p>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
        {{ error }}
      </div>

      <!-- Submit Button -->
      <div>
        <button type="submit" :disabled="isLoading"
          class="group relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg">
          <span v-if="isLoading" class="absolute inset-y-0 left-0 flex items-center pl-3">
            <Loader />
          </span>
          {{ buttonText }}
        </button>
      </div>

      <!-- Toggle Link -->
      <div class="flex gap-1 justify-center text-center text-sm">
        <span class="text-gray-500">
          {{ type === 'login' ? "Нет аккаунта?" : "Уже есть аккаунт?" }}
        </span>
        <RouterLink :to="type === 'login' ? '/signup' : '/login'" class="font-medium text-blue-600 hover:text-blue-500">
          {{ type === 'login' ? "Зарегистрироваться" : "Войти" }}
        </RouterLink>
      </div>
    </form>
  </div>
</template>
