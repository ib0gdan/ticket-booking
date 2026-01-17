<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useMovieDetails } from '@/composables/useMovieDetails';
import Loader from '@/components/common/Loader.vue';
import MovieHeader from '@/components/movie/MovieHeader.vue';
import DailyMovieSessions from '@/components/movie/DailyMovieSessions.vue';

const route = useRoute();
const movieId = Number(route.params.id);

const { movie, isPending, isError, error, groupedSessions, hasSessions } = useMovieDetails(movieId);
</script>

<template>
  <div class="w-full p-8 max-w-5xl mx-auto">
    <div v-if="isPending" class="flex justify-center mt-20">
      <Loader />
    </div>

    <div v-else-if="isError" class="text-red-500 mt-4 text-center">
      Ошибка: {{ error?.message }}
    </div>

    <div v-else>
      <MovieHeader :movie="movie" />

      <div class="space-y-16">
        <DailyMovieSessions
          v-for="(cinemaGroups, date) in groupedSessions"
          :key="date"
          :date="String(date)"
          :cinema-groups="cinemaGroups"
        />
      </div>

      <div v-if="!hasSessions" class="text-center text-gray-400 py-12 font-light">
        Нет доступных сеансов
      </div>
    </div>
  </div>
</template>
