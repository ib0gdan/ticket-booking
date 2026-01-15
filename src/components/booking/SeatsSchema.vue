<script setup lang="ts">
import { computed } from 'vue';
import type { Seat } from '@/api/types';
import Tooltip from '@/components/common/Tooltip.vue';

const props = defineProps<{
  rows: number;
  seatsPerRow: number;
  bookedSeats: Seat[];
  modelValue?: Seat[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: Seat[]): void;
}>();

const bookedSet = computed(() => {
  const set = new Set<string>();
  props.bookedSeats.forEach((seat) => {
    set.add(`${seat.rowNumber}-${seat.seatNumber}`);
  });
  return set;
});

const selectedSet = computed(() => {
  const set = new Set<string>();
  (props.modelValue || []).forEach((seat) => {
    set.add(`${seat.rowNumber}-${seat.seatNumber}`);
  });
  return set;
});

const rowsList = computed(() => Array.from({ length: props.rows }, (_, index) => index + 1));
const seatsList = computed(() =>
  Array.from({ length: props.seatsPerRow }, (_, index) => index + 1)
);

const toggleSeat = (rowNumber: number, seatNumber: number) => {
  const key = `${rowNumber}-${seatNumber}`;

  if (bookedSet.value.has(key)) {
    return;
  }

  const next = [...(props.modelValue || [])];
  const index = next.findIndex(
    (seat) => seat.rowNumber === rowNumber && seat.seatNumber === seatNumber
  );

  if (index >= 0) {
    next.splice(index, 1);
  } else {
    next.push({ rowNumber, seatNumber });
  }

  emit('update:modelValue', next);
};
</script>

<template>
  <div class="flex flex-col items-center gap-6">
    <div
      class="w-full max-w-xl border border-gray-200 rounded-lg px-4 py-2 text-center text-xs text-gray-500"
    >
      Экран
    </div>

    <div class="flex flex-col gap-2">
      <div v-for="row in rowsList" :key="row" class="flex items-center gap-2 justify-center">
        <div class="w-10 text-xs text-gray-500 text-left">ряд {{ row }}</div>
        <div class="flex gap-1">
          <Tooltip v-for="seat in seatsList" :key="seat" :text="`Ряд ${row}, место ${seat}`">
            <button
              type="button"
              class="h-8 w-8 rounded-md text-xs font-medium flex items-center justify-center border transition-colors duration-150"
              :class="{
                'bg-red-200 text-red-400 border-red-300 cursor-not-allowed!': bookedSet.has(
                  `${row}-${seat}`
                ),
                'bg-blue-600 text-white border-blue-600':
                  selectedSet.has(`${row}-${seat}`) && !bookedSet.has(`${row}-${seat}`),
                'bg-white text-gray-700 border-gray-300 hover:bg-gray-50':
                  !selectedSet.has(`${row}-${seat}`) && !bookedSet.has(`${row}-${seat}`),
              }"
              @click="toggleSeat(row, seat)"
            >
              <span class="sr-only"> Ряд {{ row }}, место {{ seat }} </span>
            </button>
          </Tooltip>
        </div>
      </div>
    </div>

    <div class="flex gap-4 text-xs text-gray-500">
      <div class="flex items-center gap-2">
        <span class="h-4 w-4 rounded border border-gray-300 bg-white"></span>
        <span>Свободно</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="h-4 w-4 rounded border border-blue-600 bg-blue-600"></span>
        <span>Выбрано</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="h-4 w-4 rounded border border-gray-300 bg-gray-200"></span>
        <span>Занято</span>
      </div>
    </div>
  </div>
</template>
