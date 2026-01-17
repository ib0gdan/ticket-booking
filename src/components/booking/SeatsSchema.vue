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

const getSeatClasses = (row: number, seat: number) => {
  const key = `${row}-${seat}`;
  const isBooked = bookedSet.value.has(key);
  const isSelected = selectedSet.value.has(key);

  if (isBooked) {
    return 'bg-red-200 border-red-200 cursor-not-allowed! opacity-50';
  }
  if (isSelected) {
    return 'bg-blue-600 border-blue-600 shadow-sm';
  }
  return 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-sm';
};
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <div class="w-full flex overflow-auto py-8 px-2">
      <div class="min-w-max mx-auto flex flex-col gap-1.5">
        <div v-for="row in rowsList" :key="row" class="flex items-center gap-3">
          <div class="w-6 text-[10px] text-gray-400 text-right font-medium select-none">
            {{ row }}
          </div>

          <div class="flex gap-1">
            <Tooltip
              v-for="seat in seatsList"
              :key="`${row}-${seat}`"
              :text="`Ряд ${row}, место ${seat}`"
            >
              <button
                type="button"
                class="w-5 h-5 rounded-[2px] border transition-all duration-200 ease-out flex items-center justify-center text-[8px] text-white"
                :class="getSeatClasses(row, seat)"
                @click="toggleSeat(row, seat)"
                :aria-label="`Ряд ${row}, место ${seat}`"
              >
                {{ selectedSet.has(`${row}-${seat}`) ? seat : '' }}
              </button>
            </Tooltip>
          </div>

          <div class="w-6 text-[10px] text-gray-400 text-left font-medium select-none">
            {{ row }}
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap justify-center gap-6 mt-2 text-xs text-gray-600">
      <div class="flex items-center gap-2">
        <span class="h-3 w-3 rounded-[2px] border border-gray-200 bg-white"></span>
        <span>Свободно</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="h-3 w-3 rounded-[2px] border border-blue-600 bg-blue-600"></span>
        <span>Выбрано</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="h-3 w-3 rounded-[2px] bg-gray-100 opacity-50"></span>
        <span>Занято</span>
      </div>
    </div>
  </div>
</template>
