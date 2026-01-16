<script setup lang="ts">
import Loader from '@/components/common/Loader.vue';
import BookingCard from '@/components/booking/BookingCard.vue';
import { useMyTickets } from '@/composables/useMyTickets';

const {
  isBookingsPending,
  isSettingsPending,
  isSessionsLoading,
  bookingsError,
  settingsError,
  paymentError,
  unpaidBookings,
  futureBookings,
  pastBookings,
  movieSessionsMap,
  settings,
  isPayPending,
  payBooking,
  handleExpired,
  getMovieTitleByBooking,
  getCinemaNameByBooking,
} = useMyTickets();
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
          <BookingCard
            v-for="booking in unpaidBookings"
            :key="booking.id"
            :booking="booking"
            :movie-title="getMovieTitleByBooking(booking)"
            :cinema-name="getCinemaNameByBooking(booking)"
            :start-time="movieSessionsMap[booking.movieSessionId]?.startTime"
            :show-payment="true"
            :payment-time-seconds="settings?.bookingPaymentTimeSeconds"
            :is-pay-pending="isPayPending"
            @pay="payBooking"
            @expired="handleExpired"
          />
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-900">Будущие</h2>

        <div v-if="futureBookings.length === 0" class="text-gray-500 text-sm">
          Нет будущих билетов.
        </div>

        <div v-else class="space-y-3">
          <BookingCard
            v-for="booking in futureBookings"
            :key="booking.id"
            :booking="booking"
            :movie-title="getMovieTitleByBooking(booking)"
            :cinema-name="getCinemaNameByBooking(booking)"
            :start-time="movieSessionsMap[booking.movieSessionId]?.startTime"
          />
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-900">Прошедшие</h2>

        <div v-if="pastBookings.length === 0" class="text-gray-500 text-sm">
          Нет прошедших билетов.
        </div>

        <div v-else-if="movieSessionsMap" class="space-y-3">
          <BookingCard
            v-for="booking in pastBookings"
            :key="booking.id"
            :booking="booking"
            :movie-title="getMovieTitleByBooking(booking)"
            :cinema-name="getCinemaNameByBooking(booking)"
            :start-time="movieSessionsMap[booking.movieSessionId]?.startTime"
          />
        </div>
      </section>
    </div>
  </div>
</template>
