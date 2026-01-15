<script setup lang="ts">
import TableView, { type Column } from '@/components/common/TableView.vue';
import type { Cinema } from '@/api/types';
import queryClient from '@/api/clients/query.client';

const data = (queryClient.getQueryData(['cinemas']) as Cinema[]) || [];

const columns: Column<Cinema>[] = [
  { header: 'Кинотеатр', key: 'name', span: 4 },
  { header: 'Адрес', key: 'address', span: 5 },
  { header: '', key: 'id', span: 3, align: 'center' },
];
</script>

<template>
  <div class="w-full p-8 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 mb-8">Кинотеатры</h1>

    <TableView :data="data || []" :columns="columns">
      <template #cell-id="{ item }">
        <router-link
          :to="{ name: 'Кинотеатр', params: { id: item.id } }"
          class="inline-block px-4 py-2 text-sm font-medium text-gray-700 bg-transparent border border-gray-300 rounded-lg hover:border-gray-900 hover:text-gray-900 transition-colors duration-200"
        >
          Посмотреть сеансы
        </router-link>
      </template>
    </TableView>
  </div>
</template>
