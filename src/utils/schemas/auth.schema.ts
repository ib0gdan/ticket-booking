import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, { message: 'Введите имя пользователя' }),
  password: z.string().min(1, { message: 'Введите пароль' }),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(8, { message: 'Минимум 8 символов' })
      .max(50, { message: 'Максимум 50 символов' })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: 'Только буквы, цифры и подчеркивания',
      }),

    password: z
      .string()
      .min(8, { message: 'Минимум 8 символов' })
      .regex(/[A-Z]/, { message: 'Хотя бы одна заглавная буква' })
      .regex(/\d/, { message: 'Хотя бы одна цифра' }),

    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    error: 'Пароли не совпадают',
    path: ['passwordConfirmation'],
  });

export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
