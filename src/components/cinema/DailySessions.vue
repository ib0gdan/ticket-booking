<script setup lang="ts">
import MovieSessionItem from './MovieSessionItem.vue';
import type { MovieGroup } from '@/composables/useCinemaDetails';

interface Props {
  date: string;
  movieGroups: MovieGroup[];
}

defineProps<Props>();
</script>

<template>
  <div>
    <div class="border-b border-gray-200 pb-2 mb-8">
      <span class="text-lg font-medium">{{ date }}</span>
    </div>

    <div class="space-y-12">
      <MovieSessionItem v-for="group in movieGroups" :key="group.movie.id" :group="group" />
    </div>
  </div>
</template>
