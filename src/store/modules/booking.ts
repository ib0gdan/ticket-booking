import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';

import { bookingApi } from '@/api/services/booking';
import type { Seat } from '@/api/types';

export const useBookingStore = defineStore('booking', () => {
  const router = useRouter();

  const {
    mutate: bookSeatsMutate,
    error: bookSeatsMutationError,
    isPending: isBookSeatsPending,
  } = useMutation({
    mutationFn: ({ movieSessionId, seats }: { movieSessionId: number; seats: Seat[] }) =>
      bookingApi.bookSeats({ movieSessionId, seats }),
    onSuccess: () => router.push({ name: 'Мои билеты' }),
  });

  return {
    bookSeats: bookSeatsMutate,
    bookSeatsMutationError,
    isBookSeatsPending,
  };
});
