<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { formatTime } from '@/utils/dateTime';
import type { MovieGroup } from '@/composables/useCinemaDetails';

interface Props {
  group: MovieGroup;
}

defineProps<Props>();
</script>

<template>
  <div class="flex flex-col md:flex-row gap-8 items-start">
    <div class="flex items-center gap-6 md:w-1/2">
      <div class="h-16 w-12 overflow-hidden rounded-md bg-gray-100 shrink-0 justify-center">
        <img
          v-if="group.movie.posterImage"
          :src="group.movie.posterImage"
          :alt="group.movie.title"
          class="h-full w-full object-cover object-center"
        />
      </div>
      <span class="text-lg font-light">{{ group.movie.title }}</span>
    </div>

    <div class="flex flex-wrap gap-3 md:w-1/2">
      <RouterLink
        v-for="session in group.sessions"
        :key="session.id"
        :to="{ name: 'Букинг', params: { id: group.movie.id, sessionId: session.id } }"
        class="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200"
      >
        {{ formatTime(session.startTime) }}
      </RouterLink>
    </div>
  </div>
</template>
