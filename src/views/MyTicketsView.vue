<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { bookingApi } from '@/api/services/booking';
import { settingsApi } from '@/api/services/settings';
import type { BookingDetails, ExtraInfoBookingDetails } from '@/api/types/booking';
import Loader from '@/components/common/Loader.vue';
import PaymentTimer from '@/components/booking/PaymentTimer.vue';
import { formatSessionTime } from '@/utils/dateTime';
import { movieSessionApi } from '@/api/services';
import type { Cinema, Movie, MovieSession } from '@/api/types';
import queryClient from '@/api/clients/query.client';

const movies = (queryClient.getQueryData(['movies']) as Movie[]) || [];
const cinemas = (queryClient.getQueryData(['cinemas']) as Cinema[]) || [];

const movieSessionsMap = ref<Record<number, MovieSession>>({});

const isSessionsLoading = ref(true);

const getSessionsData = async (listIds: number[]) => {
  if (listIds.length === 0) {
    isSessionsLoading.value = false;
    return;
  }
  isSessionsLoading.value = true;
  try {
    const ids = Array.from(new Set(listIds));

    const sessionPromises = ids.map(async (id) => {
      const session = await movieSessionApi.getMovieSessions(id);
      return { id, session };
    });

    const results = await Promise.all(sessionPromises);
    const map: Record<number, MovieSession> = {};
    results.forEach(({ id, session }) => {
      map[id] = session;
    });
    movieSessionsMap.value = map;
  } finally {
    isSessionsLoading.value = false;
  }
};

const {
  isPending: isBookingsPending,
  data: bookingsData,
  refetch: refetchBookings,
  error: bookingsError,
} = useQuery({
  queryKey: ['bookings'],
  queryFn: bookingApi.getMyBookings,
  staleTime: Infinity,
});

const bookings = computed<ExtraInfoBookingDetails[]>(
  () =>
    bookingsData.value?.map((i) => ({
      ...i,
      startTime: movieSessionsMap.value[i.movieSessionId]?.startTime || '',
    })) || []
);

watchEffect(() => {
  if (bookingsData.value) {
    getSessionsData(bookingsData.value.map((b) => b.movieSessionId));
  }
});

const moviesMap = computed<Record<number, Movie>>(() => {
  const map: Record<number, Movie> = {};
  movies.forEach((movie) => {
    map[movie.id] = movie;
  });
  return map;
});

const cinemasMap = computed<Record<number, Cinema>>(() => {
  const map: Record<number, Cinema> = {};
  cinemas.forEach((cinema) => {
    map[cinema.id] = cinema;
  });
  return map;
});

const getMovieTitleByBooking = (booking: BookingDetails): string => {
  const session = movieSessionsMap.value[booking.movieSessionId];
  if (!session) return 'Неизвестный фильм';
  return moviesMap.value[session.movieId]?.title || 'Неизвестный фильм';
};

const getCinemaNameByBooking = (booking: BookingDetails): string => {
  const session = movieSessionsMap.value[booking.movieSessionId];
  if (!session) return 'Неизвестный кинотеатр';
  return cinemasMap.value[session.cinemaId]?.name || 'Неизвестный кинотеатр';
};

const {
  isPending: isSettingsPending,
  data: settings,
  error: settingsError,
} = useQuery({
  queryKey: ['settings'],
  queryFn: settingsApi.getSettings,
});

const unpaidBookings = computed<ExtraInfoBookingDetails[]>(() =>
  (bookings.value || []).filter((booking) => !booking.isPaid)
);

const paidBookings = computed<ExtraInfoBookingDetails[]>(() =>
  (bookings.value || [])
    .filter((booking) => booking.isPaid)
    .sort((a, b) => {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    })
);

const futureBookings = computed<ExtraInfoBookingDetails[]>(() => {
  const now = new Date();
  return paidBookings.value.filter((booking) => new Date(booking.startTime) >= now);
});

const pastBookings = computed<ExtraInfoBookingDetails[]>(() => {
  const now = new Date();
  return paidBookings.value.filter((booking) => new Date(booking.startTime) < now);
});

const {
  mutate: payBooking,
  isPending: isPayPending,
  error: paymentError,
} = useMutation({
  mutationFn: (bookingId: string) => bookingApi.pay(bookingId),
  onSuccess: () => {
    refetchBookings();
  },
});

const handleExpired = () => {
  refetchBookings();
};

onMounted(() => {
  refetchBookings();
});
</script>

<template>
  <div class="flex flex-col w-full p-8 max-w-5xl mx-auto gap-8">
    <h1 class="text-2xl font-bold text-gray-900 text-center">Мои билеты</h1>

    <div
      v-if="isBookingsPending || isSettingsPending || isSessionsLoading"
      class="flex justify-center items-center py-8"
    >
      <Loader />
    </div>

    <div v-else>
      <div
        v-if="bookingsError || settingsError || paymentError"
        class="text-red-500 mb-4 text-center"
      >
        Ошибка: {{ bookingsError?.message || settingsError?.message || paymentError?.message }}
      </div>

      <section class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-900">Неоплаченные</h2>

        <div v-if="unpaidBookings.length === 0" class="text-gray-500 text-sm">
          Нет неоплаченных билетов.
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="booking in unpaidBookings"
            :key="booking.id"
            class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-gray-200 rounded-lg px-4 py-3"
          >
            <div class="space-y-1 text-sm">
              <div class="font-medium text-gray-900">Бронь №{{ booking.id }}</div>
              <div class="text-gray-700">
                Дата бронирования: {{ formatSessionTime(booking.bookedAt) }}
              </div>
              <div class="text-gray-700">Кино: {{ getMovieTitleByBooking(booking) }}</div>
              <div class="text-gray-700">Кинотеатр: {{ getCinemaNameByBooking(booking) }}</div>
              <div class="text-gray-700">
                Время показа:
                {{
                  formatSessionTime(
                    movieSessionsMap[booking.movieSessionId]?.startTime || new Date()
                  )
                }}
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

            <div class="flex items-center gap-4">
              <PaymentTimer
                v-if="settings?.bookingPaymentTimeSeconds"
                :booked-at="booking.bookedAt"
                :expire-seconds="settings.bookingPaymentTimeSeconds"
                @expired="handleExpired"
              />
              <button
                class="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isPayPending"
                @click="payBooking(booking.id)"
              >
                Оплатить
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-900">Будущие</h2>

        <div v-if="futureBookings.length === 0" class="text-gray-500 text-sm">
          Нет будущих билетов.
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="booking in futureBookings"
            :key="booking.id"
            class="flex flex-col gap-1 border border-gray-200 rounded-lg px-4 py-3 text-sm"
          >
            <div class="font-medium text-gray-900">Бронь №{{ booking.id }}</div>
            <div class="text-gray-700">
              Дата бронирования: {{ formatSessionTime(booking.bookedAt) }}
            </div>
            <div class="text-gray-700">Кино: {{ getMovieTitleByBooking(booking) }}</div>
            <div class="text-gray-700">Кинотеатр: {{ getCinemaNameByBooking(booking) }}</div>
            <div class="text-gray-700" v-if="movieSessionsMap">
              Время показа:
              {{
                formatSessionTime(movieSessionsMap[booking.movieSessionId]?.startTime || new Date())
              }}
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
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-900">Прошедшие</h2>

        <div v-if="pastBookings.length === 0" class="text-gray-500 text-sm">
          Нет прошедших билетов.
        </div>

        <div v-else-if="movieSessionsMap" class="space-y-3">
          <div
            v-for="booking in pastBookings"
            :key="booking.id"
            class="flex flex-col gap-1 border border-gray-200 rounded-lg px-4 py-3 text-sm"
          >
            <div class="font-medium text-gray-900">Бронь №{{ booking.id }}</div>
            <div class="text-gray-700">
              Дата бронирования: {{ formatSessionTime(booking.bookedAt) }}
            </div>
            <div class="text-gray-700">Кино: {{ getMovieTitleByBooking(booking) }}</div>
            <div class="text-gray-700">Кинотеатр: {{ getCinemaNameByBooking(booking) }}</div>
            <div class="text-gray-700" v-if="movieSessionsMap">
              Время показа:
              {{
                formatSessionTime(movieSessionsMap[booking.movieSessionId]?.startTime || new Date())
              }}
            </div>
            <div v-if="booking.seats.length" class="text-gray-700">
              Места:
              <span>
                {{
                  booking.seats
                    .map((seat) => `Ряд ${seat.rowNumber}, место ${seat.seatNumber}`)
                    .join(';')
                }}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
