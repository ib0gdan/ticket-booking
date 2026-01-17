<script setup lang="ts">
import { formatSessionTime } from '@/utils/dateTime';
import type { BookingDetails } from '@/api/types/booking';
import PaymentTimer from '@/components/booking/PaymentTimer.vue';

defineProps<{
  booking: BookingDetails;
  movieTitle: string;
  cinemaName: string;
  startTime?: string | Date;
  showPayment?: boolean;
  paymentTimeSeconds?: number;
  isPayPending?: boolean;
}>();

const emit = defineEmits<{
  (e: 'pay', id: string): void;
  (e: 'expired'): void;
}>();
</script>

<template>
  <div
    class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-gray-200 rounded-lg px-4 py-3"
  >
    <div class="space-y-1 text-sm">
      <div class="text-gray-700">Кино: {{ movieTitle }}</div>
      <div class="text-gray-700">Кинотеатр: {{ cinemaName }}</div>
      <div v-if="startTime" class="text-gray-700">
        Время показа: {{ formatSessionTime(startTime) }}
      </div>
      <div v-if="booking.seats.length" class="text-gray-700">
        Места:
        <span>
          {{
            booking.seats
              .map((seat) => `Ряд ${seat.rowNumber}, место ${seat.seatNumber}`)
              .join('; ')
          }}
        </span>
      </div>
    </div>

    <div v-if="showPayment" class="flex items-center gap-4">
      <PaymentTimer
        v-if="paymentTimeSeconds"
        :booked-at="booking.bookedAt"
        :expire-seconds="paymentTimeSeconds"
        @expired="emit('expired')"
      />
      <button
        class="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isPayPending"
        @click="emit('pay', booking.id)"
      >
        Оплатить
      </button>
    </div>
  </div>
</template>
