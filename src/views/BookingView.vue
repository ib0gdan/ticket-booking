<script setup lang="ts">
import { ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { useRoute } from 'vue-router';
import queryClient from '@/api/clients/query.client';
import { movieSessionApi } from '@/api/services';
import type { Cinema, Movie, Seat } from '@/api/types';
import Loader from '@/components/common/Loader.vue';
import SeatsSchema from '@/components/booking/SeatsSchema.vue';
import { formatSessionTime } from '@/utils/dateTime';
import { useBookingStore } from '@/store/modules/booking';

const route = useRoute();
const sessionId = Number(route.params.sessionId);

const movies = (queryClient.getQueryData(['movies']) as Movie[]) || [];
const cinemas = (queryClient.getQueryData(['cinemas']) as Cinema[]) || [];

const selectedSeats = ref<Seat[]>([]);

const bookingStore = useBookingStore();
const { bookSeats, bookSeatsMutationError, isBookSeatsPending } = bookingStore;

const { isPending, data, error } = useQuery({
  queryKey: ['sessionDetails', sessionId],
  queryFn: () => movieSessionApi.getMovieSessions(sessionId),
  select: (session) => ({
    ...session,
    movieTitle: (movies.find((movie) => movie.id === session.movieId) as Movie).title,
    cinemaName: (cinemas.find((cinema) => cinema.id === session.cinemaId) as Cinema).name,
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

    <div v-else-if="error || bookSeatsMutationError" class="text-red-500 mt-4 text-center">
      Ошибка: {{ error?.message || bookSeatsMutationError?.message }}
    </div>

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
        class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:border-gray-900 hover:text-gray-900"
        :disabled="selectedSeats.length === 0"
        @click="bookSeats({ movieSessionId: sessionId, seats: selectedSeats })"
      >
        Забронировать
      </button>
    </div>
  </div>
</template>
