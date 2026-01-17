<script setup lang="ts">
import CinemaSessionItem from './CinemaSessionItem.vue';
import type { CinemaGroup } from '@/composables/useMovieDetails';

interface Props {
  date: string;
  cinemaGroups: CinemaGroup[];
}

defineProps<Props>();
</script>

<template>
  <div>
    <div class="border-b border-gray-200 pb-2 mb-8">
      <span class="text-lg font-medium">{{ date }}</span>
    </div>

    <div class="space-y-12">
      <CinemaSessionItem v-for="group in cinemaGroups" :key="group.cinema.id" :group="group" />
    </div>
  </div>
</template>
