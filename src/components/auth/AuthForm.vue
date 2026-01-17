<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import {
  loginSchema,
  registerSchema,
  type LoginCredentials,
  type RegisterInput,
} from '@/utils/schemas/auth.schema';
import Loader from '../common/Loader.vue';
import BaseIcon from '../common/BaseIcon.vue';

interface AuthFormProps {
  type: 'login' | 'register';
  isLoading: boolean;
  error?: string | null;
}

const props = defineProps<AuthFormProps>();

const emit = defineEmits<{
  (e: 'submit', data: LoginCredentials | RegisterInput): void;
}>();

const showPassword = ref(false);
const showPasswordConfirmation = ref(false);

const validationSchema = computed(() => {
  return toTypedSchema(props.type === 'login' ? loginSchema : registerSchema);
});

const { handleSubmit, errors, defineField, meta } = useForm<LoginCredentials | RegisterInput>({
  validationSchema,
  initialValues: {
    username: '',
    password: '',
    passwordConfirmation: '',
  },
});

const [username, usernameAttrs] = defineField('username');
const [password, passwordAttrs] = defineField('password');
const [passwordConfirmation, passwordConfirmationAttrs] = defineField('passwordConfirmation');

const onSubmit = handleSubmit((values) => {
  emit('submit', values);
});
</script>

<template>
  <div class="max-w-md w-full p-8 rounded-xl shadow-lg">
    <div class="text-center">
      <h2 class="text-3xl font-bold tracking-tight text-gray-900 mt-2">
        {{ props.type === 'login' ? 'Вход' : 'Регистрация' }}
      </h2>
    </div>

    <form class="mt-8 space-y-4" @submit.prevent="onSubmit">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
          Имя пользователя
        </label>
        <input
          id="username"
          v-model="username"
          v-bind="usernameAttrs"
          autocomplete="username"
          type="text"
          class="relative block w-full rounded-lg border px-3 py-3 text-gray-900 placeholder-gray-500 text-sm"
          :class="[
            errors.username
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
          ]"
          placeholder="Введите имя пользователя"
        />
        <p v-if="errors.username" class="mt-1 text-sm text-red-500">
          {{ errors.username }}
        </p>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1"> Пароль </label>
        <div class="relative">
          <input
            id="password"
            v-model="password"
            v-bind="passwordAttrs"
            autocomplete="current-password"
            :type="showPassword ? 'text' : 'password'"
            class="w-full rounded-lg border px-3 py-3 pr-10 text-gray-900 placeholder-gray-500 text-sm"
            :class="[
              errors.password
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
            ]"
            placeholder="Введите пароль"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-3 text-gray-400 hover:text-gray-600"
            @click="showPassword = !showPassword"
            tabindex="-1"
          >
            <BaseIcon :name="showPassword ? 'eyeSlash' : 'eye'" class="w-5 h-5" />
          </button>
        </div>
        <p v-if="errors.password" class="mt-1 text-sm text-red-500">
          {{ errors.password }}
        </p>
      </div>

      <div v-if="props.type === 'register'">
        <label for="passwordConfirmation" class="block text-sm font-medium text-gray-700 mb-1">
          Подтвердите пароль
        </label>
        <div class="relative">
          <input
            id="passwordConfirmation"
            v-model="passwordConfirmation"
            v-bind="passwordConfirmationAttrs"
            autocomplete="new-password"
            :type="showPasswordConfirmation ? 'text' : 'password'"
            class="block w-full rounded-lg border px-3 py-3 pr-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-1 sm:text-sm transition-colors duration-200"
            :class="[
              errors.passwordConfirmation
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
            ]"
            placeholder="Повторите пароль"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-3 text-gray-400 hover:text-gray-600"
            @click="showPasswordConfirmation = !showPasswordConfirmation"
            tabindex="-1"
          >
            <BaseIcon :name="showPasswordConfirmation ? 'eyeSlash' : 'eye'" class="w-5 h-5" />
          </button>
        </div>
        <p v-if="errors.passwordConfirmation" class="mt-1 text-sm text-red-500">
          {{ errors.passwordConfirmation }}
        </p>
      </div>

      <div
        v-if="props.error"
        class="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-100"
      >
        {{ props.error }}
      </div>

      <button
        type="submit"
        :disabled="isLoading || !meta.valid"
        class="flex w-full justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500"
      >
        <span v-if="isLoading">
          <Loader size="sm" color="white" />
        </span>
        {{ props.type === 'login' ? 'Войти' : 'Зарегистрироваться' }}
      </button>

      <div class="flex gap-1 justify-center text-center text-sm">
        <span class="text-gray-500">
          {{ props.type === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?' }}
        </span>
        <RouterLink
          :to="props.type === 'login' ? '/signup' : '/login'"
          class="font-medium text-blue-600 hover:text-blue-500 transition-colors"
        >
          {{ props.type === 'login' ? 'Зарегистрироваться' : 'Войти' }}
        </RouterLink>
      </div>
    </form>
  </div>
</template>
