<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useCinemaDetails } from '@/composables/useCinemaDetails';
import Loader from '@/components/common/Loader.vue';
import CinemaHeader from '@/components/cinema/CinemaHeader.vue';
import DailySessions from '@/components/cinema/DailySessions.vue';

const route = useRoute();
const cinemaId = Number(route.params.id);

const { cinema, isPending, isError, error, groupedSessions, hasSessions } =
  useCinemaDetails(cinemaId);
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
      <CinemaHeader :cinema="cinema" />

      <div class="space-y-16">
        <DailySessions
          v-for="(moviesGroup, date) in groupedSessions"
          :key="date"
          :date="String(date)"
          :movie-groups="moviesGroup"
        />
      </div>

      <div v-if="!hasSessions" class="text-center text-gray-400 py-12 font-light">
        Нет доступных сеансов
      </div>
    </div>
  </div>
</template>
