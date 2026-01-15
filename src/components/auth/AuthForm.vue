<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { z } from 'zod';
import {
  loginSchema,
  registerSchema,
  type LoginCredentials,
  type RegisterInput,
} from '@/utils/schemas/authSchema';
import Loader from '../common/Loader.vue';
import BaseIcon from '../common/BaseIcon.vue';
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
const showPassword = ref(false);
const showPasswordConfirmation = ref(false);

const title = computed(() => (props.type === 'login' ? 'Вход' : 'Регистрация'));

const buttonText = computed(() => {
  if (props.isLoading) return props.type === 'login' ? 'Вход...' : 'Регистрация...';
  return props.type === 'login' ? 'Войти' : 'Зарегистрироваться';
});

const handleSubmit = () => {
  fieldErrors.value = {};

  const data = {
    username: username.value,
    password: password.value,
    ...(props.type === 'register' ? { passwordConfirmation: passwordConfirmation.value } : {}),
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
    ...(props.type === 'register' ? { passwordConfirmation: passwordConfirmation.value } : {}),
  };

  const schema = props.type === 'login' ? loginSchema : registerSchema;
  const result = schema.safeParse(data);

  if (!result.success) {
    const issue = result.error.issues.find((i) => i.path[0] === field);
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
  <div class="max-w-md w-full space-y-8 p-8">
    <div class="text-center">
      <h2 class="mt-2 text-3xl font-bold tracking-tight text-gray-900">
        {{ title }}
      </h2>
    </div>

    <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1"
            >Имя пользователя</label
          >
          <input
            id="username"
            v-model="username"
            autocomplete="username"
            name="username"
            type="text"
            class="relative block w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors duration-200"
            placeholder="Введите имя пользователя"
            @blur="validateField('username')"
          />
          <p v-if="fieldErrors.username" class="mt-1 text-sm text-red-500">
            {{ fieldErrors.username }}
          </p>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              autocomplete="current-password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              class="block w-full rounded-lg border border-gray-300 px-3 py-3 pr-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors duration-200"
              placeholder="Введите пароль"
              @blur="validateField('password')"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              @click="showPassword = !showPassword"
            >
              <BaseIcon :name="showPassword ? 'eyeSlash' : 'eye'" />
            </button>
          </div>
          <p v-if="fieldErrors.password" class="mt-1 text-sm text-red-500">
            {{ fieldErrors.password }}
          </p>
        </div>

        <div v-if="type === 'register'">
          <label for="passwordConfirmation" class="block text-sm font-medium text-gray-700 mb-1"
            >Подтвердите пароль</label
          >
          <div class="relative">
            <input
              id="passwordConfirmation"
              v-model="passwordConfirmation"
              autocomplete="confirm-password"
              name="passwordConfirmation"
              :type="showPasswordConfirmation ? 'text' : 'password'"
              class="block w-full rounded-lg border border-gray-300 px-3 py-3 pr-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors duration-200"
              placeholder="Повторите пароль"
              @blur="validateField('passwordConfirmation')"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              @click="showPasswordConfirmation = !showPasswordConfirmation"
            >
              <BaseIcon :name="showPasswordConfirmation ? 'eyeSlash' : 'eye'" />
            </button>
          </div>
          <p v-if="fieldErrors.passwordConfirmation" class="mt-1 text-sm text-red-500">
            {{ fieldErrors.passwordConfirmation }}
          </p>
        </div>
      </div>

      <div v-if="error" class="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
        {{ error }}
      </div>

      <div>
        <button
          type="submit"
          :disabled="isLoading || Object.keys(fieldErrors).length > 0"
          class="relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          :class="isLoading ? 'gap-2' : ''"
        >
          <span v-if="isLoading" class="flex gap-2 items-center">
            <Loader size="sm" color="blue" />
          </span>
          {{ buttonText }}
        </button>
      </div>

      <div class="flex gap-1 justify-center text-center text-sm">
        <span class="text-gray-500">
          {{ type === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?' }}
        </span>
        <RouterLink
          :to="type === 'login' ? '/signup' : '/login'"
          class="font-medium text-blue-600 hover:text-blue-500"
        >
          {{ type === 'login' ? 'Зарегистрироваться' : 'Войти' }}
        </RouterLink>
      </div>
    </form>
  </div>
</template>
