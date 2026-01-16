<script setup lang="ts">
import { ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { useRoute } from 'vue-router';
import queryClient from '@/api/clients/query.client';
import { MovieSessionService } from '@/api/services';
import type { Cinema, Movie, Seat } from '@/api/types';
import Loader from '@/components/common/Loader.vue';
import SeatsSchema from '@/components/booking/SeatsSchema.vue';
import { formatSessionTime } from '@/utils/dateTime';
import { useBookingStore } from '@/store/modules/booking';
import { storeToRefs } from 'pinia';

const route = useRoute();
const sessionId = Number(route.params.sessionId);

const selectedSeats = ref<Seat[]>([]);

const bookingStore = useBookingStore();
const { isBookSeatsPending } = storeToRefs(bookingStore);

const { isPending, data, error } = useQuery({
  queryKey: ['sessionDetails', sessionId],
  queryFn: () => MovieSessionService.getMovieSessions(sessionId),
  staleTime: 1000 * 60 * 30,
  select: (session) => ({
    ...session,
    movieTitle: (queryClient.getQueryData(['movie', session.movieId]) as Movie).title,
    cinemaName: (queryClient.getQueryData(['cinema', session.cinemaId]) as Cinema).name,
  }),
});
</script>

<template>
  <div class="flex flex-col w-full p-8 max-w-5xl mx-auto gap-6">
    <div>
      <h1 class="text-2xl text-center font-bold text-gray-900 mb-4">Выбрать места</h1>
      <p v-if="data?.movieTitle" class="text-sm text-gray-700 mb-1">
        Фильм: <strong>{{ data.movieTitle }}</strong>
      </p>
      <p v-if="data?.cinemaName" class="text-sm text-gray-700 mb-1">
        Кинотеатр: <strong>{{ data.cinemaName }}</strong>
      </p>
      <p v-if="data?.startTime" class="text-sm text-gray-700 mb-1">
        Время показа: <strong>{{ formatSessionTime(data.startTime) }}</strong>
      </p>
    </div>

    <div v-if="isPending" class="flex justify-center items-center py-12">
      <Loader />
    </div>

    <div v-else-if="error" class="text-red-500 mt-4 text-center">Ошибка: {{ error?.message }}</div>

    <div v-else-if="data" class="flex flex-col items-center gap-6">
      <SeatsSchema
        v-model="selectedSeats"
        :rows="data.seats.rows"
        :seats-per-row="data.seats.seatsPerRow"
        :booked-seats="data.bookedSeats"
      />
    </div>

    <div class="flex justify-center">
      <button
        class="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:border-gray-900 hover:text-gray-900"
        :disabled="selectedSeats.length === 0 || isBookSeatsPending"
        @click="bookingStore.bookSeats({ movieSessionId: sessionId, seats: selectedSeats })"
      >
        <Loader v-if="isBookSeatsPending" size="sm" color="white" />
        Забронировать
      </button>
    </div>
  </div>
</template>
