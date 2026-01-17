import { computed, onMounted } from 'vue';
import { useMutation, useQueries, useQuery } from '@tanstack/vue-query';
import queryClient from '@/api/clients/query.client';
import { BookingService, AuthService, MovieSessionService, SettingsService } from '@/api/services';
import type {
  Cinema,
  Movie,
  MovieSession,
  BookingDetails,
  ExtraInfoBookingDetails,
} from '@/api/types';

export const useMyTickets = () => {
  const {
    isPending: isBookingsPending,
    data: bookingsData,
    refetch: refetchBookings,
    error: bookingsError,
  } = useQuery({
    queryKey: ['bookings'],
    queryFn: AuthService.getBookings,
    staleTime: Infinity,
  });

  const sessionsQueries = useQueries({
    queries: computed(() => {
      const ids = [...new Set(bookingsData.value?.map((b) => b.movieSessionId) || [])];
      return ids.map((id) => ({
        queryKey: ['sessionDetails', id],
        queryFn: () => MovieSessionService.getMovieSessions(id),
        staleTime: 1000 * 60 * 30,
      }));
    }),
  });

  const movieSessionsMap = computed(() => {
    const map: Record<number, MovieSession> = {};
    sessionsQueries.value.forEach((query) => {
      if (query.data) map[query.data.id] = query.data;
    });
    return map;
  });

  const isSessionsLoading = computed(() => sessionsQueries.value.some((q) => q.isLoading));

  const bookings = computed<ExtraInfoBookingDetails[]>(
    () =>
      bookingsData.value?.map((i) => ({
        ...i,
        startTime: movieSessionsMap.value[i.movieSessionId]?.startTime || '',
      })) || []
  );

  const getMovieTitleByBooking = (booking: BookingDetails): string => {
    const session = movieSessionsMap.value[booking.movieSessionId];
    if (!session) return 'Неизвестный фильм';
    return (
      (queryClient.getQueryData(['movie', session.movieId]) as Movie).title || 'Неизвестный фильм'
    );
  };

  const getCinemaNameByBooking = (booking: BookingDetails): string => {
    const session = movieSessionsMap.value[booking.movieSessionId];
    if (!session) return 'Неизвестный кинотеатр';
    return (
      (queryClient.getQueryData(['cinema', session.cinemaId]) as Cinema).name ||
      'Неизвестный кинотеатр'
    );
  };

  const {
    isPending: isSettingsPending,
    data: settings,
    error: settingsError,
  } = useQuery({
    queryKey: ['settings'],
    queryFn: SettingsService.getSettings,
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
    mutationFn: (bookingId: string) => BookingService.pay(bookingId),
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

  return {
    isBookingsPending,
    isSettingsPending,
    isSessionsLoading,
    isPayPending,

    bookingsError,
    settingsError,
    paymentError,

    settings,
    unpaidBookings,
    futureBookings,
    pastBookings,

    payBooking,
    handleExpired,
    getMovieTitleByBooking,
    getCinemaNameByBooking,
    refetchBookings,
  };
};
