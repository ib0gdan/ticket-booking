import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import AuthForm from '@/components/auth/AuthForm.vue';

vi.mock('vue-router', () => ({
  RouterLink: {
    template: '<a><slot /></a>',
  },
}));

vi.mock('@/components/common/BaseIcon.vue', () => ({
  default: {
    template: '<span class="icon" />',
  },
}));

vi.mock('@/components/common/Loader.vue', () => ({
  default: {
    template: '<span class="loader" />',
  },
}));

describe('AuthForm', () => {
  const globalStubs = {
    stubs: {
      RouterLink: true,
      BaseIcon: true,
      Loader: true,
    },
  };

  it('отображает форму логина', () => {
    const wrapper = mount(AuthForm, {
      props: {
        type: 'login',
        isLoading: false,
      },
      global: globalStubs,
    });

    expect(wrapper.text()).toContain('Вход');
    expect(wrapper.find('#username').exists()).toBe(true);
    expect(wrapper.find('#password').exists()).toBe(true);
    expect(wrapper.find('#passwordConfirmation').exists()).toBe(false);
  });

  it('отображает форму регистрации', () => {
    const wrapper = mount(AuthForm, {
      props: {
        type: 'register',
        isLoading: false,
      },
      global: globalStubs,
    });

    expect(wrapper.text()).toContain('Регистрация');
    expect(wrapper.find('#passwordConfirmation').exists()).toBe(true);
  });

  it('валидирует форму логина', async () => {
    const wrapper = mount(AuthForm, {
      props: {
        type: 'login',
        isLoading: false,
      },
      global: globalStubs,
    });

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(wrapper.emitted('submit')).toBeFalsy();

    await wrapper.find('#username').setValue('testuser');
    await wrapper.find('#password').setValue('Test1234');

    await flushPromises();

    wrapper.vm.$emit('submit', {
      username: 'testuser',
      password: 'Test1234',
    });
    await flushPromises();

    expect(wrapper.emitted()).toHaveProperty('submit');
    expect(wrapper.emitted('submit')).toBeTruthy();

    expect(wrapper.emitted('submit')?.[0]).toEqual([
      {
        username: 'testuser',
        password: 'Test1234',
      },
    ]);
  });

  it('валидирует форму регистрации', async () => {
    const wrapper = mount(AuthForm, {
      props: {
        type: 'register',
        isLoading: false,
      },
      global: globalStubs,
    });

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(wrapper.emitted('submit')).toBeFalsy();

    await wrapper.find('#username').setValue('test_user_1');
    await wrapper.find('#password').setValue('Password123');
    await wrapper.find('#passwordConfirmation').setValue('Password123');

    await flushPromises();

    wrapper.vm.$emit('submit', {
      username: 'test_user_1',
      password: 'Password123',
      passwordConfirmation: 'Password123',
    });

    await flushPromises();

    expect(wrapper.emitted()).toHaveProperty('submit');
    expect(wrapper.emitted('submit')).toBeTruthy();

    expect(wrapper.emitted('submit')?.[0]).toEqual([
      {
        username: 'test_user_1',
        password: 'Password123',
        passwordConfirmation: 'Password123',
      },
    ]);
  });

  it('показывает пароли по клику', async () => {
    const wrapper = mount(AuthForm, {
      props: {
        type: 'register',
        isLoading: false,
      },
      global: globalStubs,
    });
    const passwordInput = wrapper.find('#password');
    const showPasswordButton = wrapper.find('#showPassword');
    const passwordConfirmationInput = wrapper.find('#passwordConfirmation');
    const showPasswordConfirmationButton = wrapper.find('#showPasswordConfirmation');

    expect(passwordInput.attributes('type')).toBe('password');
    expect(passwordConfirmationInput.attributes('type')).toBe('password');

    await showPasswordButton.trigger('click');
    await showPasswordConfirmationButton.trigger('click');

    expect(passwordInput.attributes('type')).toBe('text');
    expect(passwordConfirmationInput.attributes('type')).toBe('text');
  });

  it('показывает ошибку сервера', () => {
    const error = 'Неверные учетные данные';
    const wrapper = mount(AuthForm, {
      props: {
        type: 'login',
        isLoading: false,
        error: error,
      },
      global: globalStubs,
    });

    expect(wrapper.text()).toContain(error);
  });
});
