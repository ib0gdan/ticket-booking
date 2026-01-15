<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { cinemaApi, moviesApi } from '@/api/services';
import type { Session, Movie } from '@/api/types';
import { formatDateShort, formatTime } from '@/utils/dateTime';
import Loader from '@/components/common/Loader.vue';

const route = useRoute();
const cinemaId = Number(route.params.id);

// 1. Fetch Cinema Details (We assume we can find it from the list or need a specific endpoint if exists.
// For now, let's fetch all and find, or assume we have a getById. The current API only has getAll.
// Let's use getAll and find for now to match existing services)
const { data: cinemas } = useQuery({
  queryKey: ['cinemas'],
  queryFn: cinemaApi.getAll,
});

const cinema = computed(() => cinemas.value?.find((c) => c.id === cinemaId));

// 2. Fetch Movies (needed for titles and posters)
const { data: movies } = useQuery({
  queryKey: ['movies'],
  queryFn: moviesApi.getAll,
});

// 3. Fetch Sessions
const {
  isPending,
  isError,
  data: sessions,
  error,
} = useQuery({
  queryKey: ['cinema-sessions', cinemaId],
  queryFn: () => cinemaApi.getSessionsByCinemaId(cinemaId),
  enabled: !!cinemaId,
});

// Helper to group sessions by date
const groupedSessions = computed(() => {
  if (!sessions.value || !movies.value) return {};

  const groups: Record<string, { movie: Movie; sessions: Session[] }[]> = {};

  // Sort sessions by time
  const sortedSessions = [...sessions.value].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  sortedSessions.forEach((session) => {
    const dateKey = formatDateShort(session.startTime);
    const movie = movies.value?.find((m) => m.id === session.movieId);

    if (!movie) return;

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }

    // Check if we already have this movie in this date group
    let movieGroup = groups[dateKey].find((g) => g.movie.id === movie.id);

    if (!movieGroup) {
      movieGroup = { movie, sessions: [] };
      groups[dateKey].push(movieGroup);
    }

    movieGroup.sessions.push(session);
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
      <div class="text-center mb-16">
        <h1 class="text-3xl font-light tracking-wide mb-2">{{ cinema?.name }}</h1>
        <p class="text-gray-500 text-sm font-light">{{ cinema?.address }}</p>
      </div>

      <div class="space-y-16">
        <div v-for="(moviesGroup, date) in groupedSessions" :key="date">
          <div class="border-b border-gray-200 pb-2 mb-8">
            <span class="text-lg font-medium">{{ date }}</span>
          </div>

          <div class="space-y-12">
            <div
              v-for="group in moviesGroup"
              :key="group.movie.id"
              class="flex flex-col md:flex-row gap-8 items-start"
            >
              <div class="flex items-center gap-6 md:w-1/3">
                <div
                  class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
                <span class="text-lg font-light">{{ group.movie.title }}</span>
              </div>

              <div class="flex flex-wrap gap-3 md:w-2/3">
                <router-link
                  :to="{ name: 'Букинг', params: { id: group.movie.id, sessionId: session.id } }"
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
