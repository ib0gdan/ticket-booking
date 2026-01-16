<script setup lang="ts">
import { computed } from 'vue';

const { size, color } = defineProps<{
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'gray' | 'white';
}>();

const sizeClass = computed(() => {
  switch (size) {
    case 'sm':
      return 'w-4 h-4 border-2';
    case 'lg':
      return 'w-12 h-12 border-6';
    default:
      return 'w-8 h-8 border-4';
  }
});

const colorClass = computed(() => {
  switch (color) {
    case 'blue':
      return 'border-blue-100';
    case 'gray':
      return 'border-gray-900';
    case 'white':
      return 'border-white';
    default:
      return 'border-gray-900';
  }
});
</script>
<template>
  <div
    :class="sizeClass + ' ' + colorClass + ' border-t-transparent rounded-full animate-spin'"
  ></div>
</template>
