import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';
import queryClient from '@/api/clients/query.client';
import { BookingService } from '@/api/services/booking';
import type { BookSeatsRequest } from '@/api/types';

export const useBookingStore = defineStore('booking', () => {
  const router = useRouter();

  const { mutate: bookSeatsMutate, isPending: isBookSeatsPending } = useMutation({
    mutationFn: ({ movieSessionId, seats }: BookSeatsRequest) =>
      BookingService.bookSeats({ movieSessionId, seats }),
    onSuccess: (_, { movieSessionId }) => {
      queryClient.invalidateQueries({ queryKey: ['sessionDetails', movieSessionId] });
      router.push({ name: 'Мои билеты' });
    },
    onError: () => {
      router.push({ name: 'Войти', query: { redirect: router.currentRoute.value.path } });
    },
  });

  return {
    bookSeats: bookSeatsMutate,
    isBookSeatsPending,
  };
});
