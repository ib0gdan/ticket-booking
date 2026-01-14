<script setup lang="ts">
import { computed } from 'vue';
import {
  ArrowRightEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/vue/24/outline';

const iconMap = {
  login: ArrowRightEndOnRectangleIcon,
  logout: ArrowRightStartOnRectangleIcon,
} as const;

export type IconName = keyof typeof iconMap;

const { name } = defineProps<{
  name: keyof typeof iconMap;
}>();

const currentIcon = computed(() => iconMap[name]);
</script>

<template>
  <component :is="currentIcon" class="w-6 h-6 shadow-2xl" aria-hidden="true" />
</template>
