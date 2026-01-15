<script setup lang="ts">
import { watch } from 'vue';
import { useTimer } from '@/composables/useTimer';

const props = defineProps<{
  bookedAt: string | Date | undefined;
  expireSeconds: number;
}>();

const emit = defineEmits<{
  (e: 'expired'): void;
}>();

const { formattedTimeLeft, isExpired } = useTimer(props.bookedAt, props.expireSeconds);

watch(
  () => isExpired.value,
  (value) => {
    if (value) {
      emit('expired');
    }
  }
);
</script>

<template>
  <span class="text-xs font-mono text-gray-700">
    {{ formattedTimeLeft }}
  </span>
</template>
