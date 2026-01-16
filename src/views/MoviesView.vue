<script setup lang="ts">
import queryClient from '@/api/clients/query.client';
import TableView, { type Column } from '@/components/common/TableView.vue';
import type { Movie } from '@/api/types';

const movies = (queryClient.getQueryData(['movies']) as Movie[]) || [];

const columns: Column<Movie>[] = [
  { key: 'posterImage', header: '#', span: 1, type: 'image', align: 'center' },
  { key: 'title', header: 'Название', span: 4, align: 'left' },
  { key: 'formattedLength', header: 'Время', span: 3, align: 'center' },
  { key: 'rating', header: 'Рейтинг', span: 1, align: 'center' },
  { key: 'id', span: 3, align: 'center' },
];
</script>

<template>
  <div class="w-full p-8 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 mb-8">Фильмы</h1>

    <TableView :data="movies" :columns="columns">
      <template #cell-id="{ item }">
        <router-link
          :to="{ name: 'Фильм', params: { id: item.id } }"
          class="inline-block px-4 py-2 text-sm font-medium text-gray-700 bg-transparent border border-gray-300 rounded-lg hover:border-gray-900 hover:text-gray-900 transition-colors duration-200"
        >
          Посмотреть сеансы
        </router-link>
      </template>
    </TableView>
  </div>
</template>
