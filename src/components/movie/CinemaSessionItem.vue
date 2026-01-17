<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { formatTime } from '@/utils/dateTime';
import type { CinemaGroup } from '@/composables/useMovieDetails';

interface Props {
  group: CinemaGroup;
}

defineProps<Props>();
</script>

<template>
  <div class="flex flex-col md:flex-row gap-8 items-start">
    <div class="flex items-center gap-6 md:w-1/2">
      <span class="text-lg font-light">{{ group.cinema.name }}</span>
    </div>

    <div class="flex flex-wrap gap-3 md:w-1/2">
      <RouterLink
        v-for="session in group.sessions"
        :key="session.id"
        :to="{ name: 'Букинг', params: { id: group.cinema.id, sessionId: session.id } }"
        class="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200"
      >
        {{ formatTime(session.startTime) }}
      </RouterLink>
    </div>
  </div>
</template>
