<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { cinemaApi } from '@/api/services';

const { isPending, isError, data, error } = useQuery({
  queryKey: ['cinemas'],
  queryFn: () => cinemaApi.getAll(),
});

</script>

<template>
  <div class="w-full h-full flex items-center justify-center">
    <h1 class="text-3xl font-bold text-gray-800">Кинотеатры</h1>
    <div v-if="isPending">
      <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
    <div v-else-if="isError">
      <p class="text-red-500">Ошибка: {{ error?.message }}</p>
    </div>
    <div v-else>
      <ul>
        <li v-for="cinema in data" :key="cinema.id">
          {{ cinema.name }} - {{ cinema.address }}
        </li>
      </ul>
    </div>
  </div>
</template>
