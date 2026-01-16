<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import queryClient from '@/api/clients/query.client';
import { MovieService } from '@/api/services';
import { formatDateShort, formatTime } from '@/utils/dateTime';
import type { Session, Movie, Cinema } from '@/api/types';
import Loader from '@/components/common/Loader.vue';

const route = useRoute();
const movieId = Number(route.params.id);

const cinemas = (queryClient.getQueryData(['cinemas']) as Cinema[]) || [];
const movie = (queryClient.getQueryData(['movie', movieId]) as Movie) || {};

const {
  isPending,
  isError,
  data: sessions,
  error,
} = useQuery({
  queryKey: ['movie-sessions', movieId],
  queryFn: async () => {
    const sessions = await MovieService.getSessionsByMovieId(movieId);
    const data = sessions.filter((session) => new Date(session.startTime) >= new Date());

    return data;
  },
  enabled: !!movieId,
});

const groupedSessions = computed(() => {
  if (!sessions.value || !cinemas.length) return {};

  const groups: Record<string, { cinema: Cinema; sessions: Session[] }[]> = {};

  const sortedSessions = [...sessions.value].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  sortedSessions.forEach((session) => {
    const dateKey = formatDateShort(session.startTime);
    const cinema = cinemas?.find((m) => m.id === session.cinemaId);

    if (!cinema) return;

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }

    let cinemaGroup = groups[dateKey].find((g) => g.cinema.id === cinema.id);

    if (!cinemaGroup) {
      cinemaGroup = { cinema, sessions: [] };
      groups[dateKey].push(cinemaGroup);
    }

    cinemaGroup.sessions.push(session);
  });

  return groups;
});
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

      <div class="space-y-16">
        <div v-for="(moviesGroup, date) in groupedSessions" :key="date">
          <div class="border-b border-gray-200 pb-2 mb-8">
            <span class="text-lg font-medium">{{ date }}</span>
          </div>

          <div class="space-y-12">
            <div
              v-for="group in moviesGroup"
              :key="group.cinema.id"
              class="flex flex-col md:flex-row gap-8 items-start"
            >
              <div class="flex items-center gap-6 md:w-1/2">
                <span class="text-lg font-light">{{ group.cinema.name }}</span>
              </div>

              <div class="flex flex-wrap gap-3 md:w-1/2">
                <router-link
                  :to="{ name: 'Букинг', params: { id: group.cinema.id, sessionId: session.id } }"
                  v-for="session in group.sessions"
                  :key="session.id"
                  class="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200"
                >
                  {{ formatTime(session.startTime) }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="Object.keys(groupedSessions).length === 0"
        class="text-center text-gray-400 py-12 font-light"
      >
        Нет доступных сеансов
      </div>
    </div>
  </div>
</template>
