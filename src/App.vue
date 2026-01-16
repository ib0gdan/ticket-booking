<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import type { QueryClient } from '@tanstack/vue-query';
import { MovieService, CinemaService } from './api/services';
import queryClient from './api/clients/query.client';
import { minsToHours } from './utils/dateTime';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const prefetchAppData = async (queryClient: QueryClient) => {
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['movies'],
      queryFn: async () => {
        const data = await MovieService.getAll();

        const formattedMovies = data.map((movie) => ({
          ...movie,
          formattedLength: minsToHours(movie.lengthMinutes),
          posterImage: BASE_URL + movie.posterImage,
        }));

        formattedMovies.forEach((movie) => {
          queryClient.setQueryData(['movie', movie.id], movie);
        });

        return formattedMovies;
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ['cinemas'],
      queryFn: async () => {
        const data = await CinemaService.getAll();

        data.forEach((cinema) => {
          queryClient.setQueryData(['cinema', cinema.id], cinema);
        });

        return data;
      },
    }),
  ]);
};

prefetchAppData(queryClient);
</script>

<template>
  <router-view></router-view>
  <VueQueryDevtools />
</template>
