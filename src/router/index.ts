import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth';
import Layout from '@/components/layout/Layout.vue';

const LoginView = () => import('@/views/LoginView.vue');
const SignUpView = () => import('@/views/SignUpView.vue');
const CinemasView = () => import('@/views/CinemasView.vue');
const CinemaDetailsView = () => import('@/views/CinemaDetailsView.vue');
const MoviesView = () => import('@/views/MoviesView.vue');
const MovieDetailsView = () => import('@/views/MovieDetailsView.vue');
const BookingView = () => import('@/views/BookingView.vue');
const MyTicketsView = () => import('@/views/MyTicketsView.vue');

const routes: RouteRecordRaw[] = [
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
    path: '/',
    component: Layout,
    children: [
      {
        path: '/movies',
        name: 'Фильмы',
        component: MoviesView,
        meta: { showInMenu: true },
      },
      {
        path: '/movies/:id',
        name: 'Фильм',
        component: MovieDetailsView,
        meta: { hidden: true },
        props: true,
      },
      {
        path: '/cinemas',
        name: 'Кинотеатры',
        component: CinemasView,
        meta: { showInMenu: true },
      },
      {
        path: '/cinemas/:id',
        name: 'Кинотеатр',
        component: CinemaDetailsView,
        meta: { hidden: true },
        props: true,
      },
      {
        path: '/movies/:id/sessions/:sessionId',
        name: 'Букинг',
        component: BookingView,
        meta: { hidden: true },
        props: true,
      },
      {
        path: '/my-tickets',
        name: 'Мои билеты',
        component: MyTicketsView,
        meta: { showInMenu: true, requiresAuth: true },
      },
      {
        path: '',
        redirect: { name: 'Фильмы' },
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

  const publicOnly = to.matched.some((record) => record.meta.publicOnly);
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (to.name === 'NotFound') {
    return next({ name: 'Кинотеатры' });
  }

  if (publicOnly && isAuthenticated) {
    return next({ name: 'Кинотеатры' });
  }

  if (requiresAuth && !isAuthenticated) {
    return next({ name: 'Войти', query: { redirect: to.path } });
  }

  next();
});

export default router;
