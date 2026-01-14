<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { cinemaApi } from '@/api/services';
import TableView, { type Column } from '@/components/common/TableView.vue';
import type { Cinema } from '@/api/types';

const { isPending, data, error } = useQuery({
  queryKey: ['cinemas'],
  queryFn: () => cinemaApi.getAll(),
});

const columns: Column<Cinema>[] = [
  { header: 'Кинотеатр', key: 'name', span: 4 },
  { header: 'Адрес', key: 'address', span: 5 },
  { header: '', key: 'id', span: 3, align: 'center' },
];
</script>

<template>
  <div class="w-full h-full p-8 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 mb-8">Кинотеатры</h1>

    <TableView :data="data || []" :columns="columns" :loading="isPending" :error="error?.message">
      <template #cell-id="{ item }">
        <router-link :to="{ name: 'Кинотеатр', params: { id: item.id } }"
          class="inline-block px-4 py-2 text-sm font-medium text-gray-700 bg-transparent border border-gray-300 rounded-lg hover:border-gray-900 hover:text-gray-900 transition-colors duration-200">
          Посмотреть сеансы
        </router-link>
      </template>
    </TableView>
  </div>
</template>
