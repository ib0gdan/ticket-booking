<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import type { QueryClient } from '@tanstack/vue-query';
import { moviesApi, cinemaApi } from './api/services';
import queryClient from './api/clients/query.client';

const prefetchAppData = async (queryClient: QueryClient) => {
  await Promise.all([
    queryClient.prefetchQuery({ queryKey: ['movies'], queryFn: moviesApi.getAll }),
    queryClient.prefetchQuery({ queryKey: ['cinemas'], queryFn: cinemaApi.getAll }),
  ]);
};

prefetchAppData(queryClient);
</script>

<template>
  <router-view></router-view>
  <VueQueryDevtools />
</template>
