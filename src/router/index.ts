import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth';
import Layout from '@/components/layout/Layout.vue';

const LoginView = () => import('@/views/LoginView.vue');
const SignUpView = () => import('@/views/SignUpView.vue');

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/login',
        name: 'Войти',
        component: LoginView,
        meta: { publicOnly: true, hidden: true },
      },
      {
        path: '/signup',
        name: 'Зарегистрироваться',
        component: SignUpView,
        meta: { publicOnly: true, hidden: true },
      },
      {
        path: '/cinemas',
        name: 'Кинотеатры',
        component: () => import('@/views/CinemasView.vue'),
        meta: { showInMenu: true },
      },
      {
        path: '',
        redirect: { name: 'Кинотеатры' },
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: { template: '<div></div>' },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const publicOnly = to.matched.some((record) => record.meta.publicOnly);

  if (to.name === 'NotFound') {
    return next({ name: 'Войти' });
  }

  if (requiresAuth && !isAuthenticated) {
    return next({ name: 'Войти' });
  }

  if (publicOnly && isAuthenticated) {
    return next({ name: 'Кинотеатры' });
  }

  next();
});

export default router;
