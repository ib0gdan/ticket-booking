<script setup lang="ts">
const { text } = defineProps<{
  text: string;
}>();
</script>

<template>
  <div class="relative inline-flex group">
    <slot />
    <div
      class="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 shadow-md group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-10"
    >
      {{ text }}
    </div>
  </div>
</template>
