<script setup lang="ts">
import type { Cinema } from '@/api/types';

interface Props {
  cinema: Cinema;
}

defineProps<Props>();
</script>

<template>
  <div class="text-center mb-16">
    <h1 class="text-3xl font-light tracking-wide mb-2">{{ cinema.name }}</h1>
    <p class="text-gray-500 text-sm font-light">{{ cinema.address }}</p>
  </div>
</template>
