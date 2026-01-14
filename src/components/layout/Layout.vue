<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/store/modules/auth';
import BaseIcon from '../common/BaseIcon.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
const { logout } = authStore;

// Dynamically get menu items from the router configuration
// We look for the root route '/' and its children
const menuItems = computed(() => {
  const rootRoute = router.options.routes.find(r => r.path === '/');
  const items = rootRoute?.children?.filter(child => child.name && !child.meta?.hidden) || [];

  if (isAuthenticated.value) {
    return items.filter(item => item.path !== '/login');
  }

  return items;
});

const isActive = (itemPath: string) => {
  if (itemPath === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(itemPath);
};
</script>

<template>
  <div class="flex w-full h-screen bg-gray-50">
    <aside class="w-64 bg-white shadow-sm flex flex-col z-10 transition-all duration-300">
      <div class="p-6 border-b border-gray-100">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-lg">T</span>
          </div>
          <h1 class="text-xl font-bold text-gray-800 tracking-tight">TicketBooking</h1>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto py-6 px-4">

        <ul class="space-y-1">
          <li v-for="item in menuItems" :key="item.name?.toString()">
            <router-link :to="{ name: item.name }"
              class="relative flex items-center px-4 py-3 text-sm font-medium transition-all duration-200" :class="[
                isActive(item.path)
                  ? '  border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]">

              {{ item.name }}
              <span v-if="isActive(item.path)" class="absolute right-0 h-9.5 w-1 bg-[#026EB7] rounded-l-full"></span>
            </router-link>
          </li>
        </ul>
      </nav>

      <div v-if="isAuthenticated" class="p-4 border-t border-gray-100">
        <button @click="logout"
          class="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200">
          <BaseIcon name='logout' />
          Выйти
        </button>
      </div>
      <div v-else class="p-4 border-t border-gray-100">
        <router-link to="/login"
          class="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200">
          <BaseIcon name="login" />
          Войти
        </router-link>
      </div>
    </aside>

    <main class="flex-1 relative overflow-auto bg-white min-h-full flex flex-col ">
      <router-view></router-view>
    </main>
  </div>
</template>
