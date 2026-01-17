<script setup lang="ts">
import type { Movie } from '@/api/types';

interface Props {
  movie: Movie;
}

defineProps<Props>();
</script>

<template>
  <div>
    <h1 class="text-3xl text-center font-light tracking-wide mb-10">{{ movie.title }}</h1>
    <div class="flex gap-6 mb-16">
      <div class="h-40 w-30 overflow-hidden rounded-md bg-gray-100 shrink-0 justify-center">
        <img
          v-if="movie.posterImage"
          :src="movie.posterImage"
          :alt="movie.title"
          class="h-full w-full object-cover object-center"
        />
      </div>
      <div>
        <p class="text-gray-500 text-sm font-light mb-5">{{ movie.description }}</p>
        <p class="text-gray-500 text-sm font-light">Год: {{ movie.year }}</p>
        <p class="text-gray-500 text-sm font-light">
          Продолжительность: {{ movie.formattedLength }}
        </p>
        <p class="text-gray-500 text-sm font-light flex gap-1 items-center">
          Рейтинг: {{ movie.rating }}
        </p>
      </div>
    </div>
  </div>
</template>
