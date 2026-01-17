import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { MovieService } from '@/api/services';
import { formatDateShort } from '@/utils/dateTime';
import type { Session, Movie, Cinema } from '@/api/types';
import queryClient from '@/api/clients/query.client';

export interface CinemaGroup {
  cinema: Cinema;
  sessions: Session[];
}

export const useMovieDetails = (movieId: number) => {
  const movie = queryClient.getQueryData<Movie>(['movie', movieId]) || ({} as Movie);
  const cinemas = queryClient.getQueryData<Cinema[]>(['cinemas']) || [];

  const {
    isPending,
    isError,
    data: sessions,
    error,
  } = useQuery({
    queryKey: ['movie-sessions', movieId],
    queryFn: async () => {
      const sessions = await MovieService.getSessionsByMovieId(movieId);
      const data = sessions.filter((session) => new Date(session.startTime) >= new Date());
      return data;
    },
    enabled: !!movieId,
  });

  const groupedSessions = computed(() => {
    if (!sessions.value || !cinemas.length) return {};

    const groups: Record<string, CinemaGroup[]> = {};

    const sortedSessions = [...sessions.value].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    sortedSessions.forEach((session) => {
      const dateKey = formatDateShort(session.startTime);
      const cinema = cinemas.find((m) => m.id === session.cinemaId);

      if (!cinema) return;

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      let cinemaGroup = groups[dateKey].find((g) => g.cinema.id === cinema.id);

      if (!cinemaGroup) {
        cinemaGroup = { cinema, sessions: [] };
        groups[dateKey].push(cinemaGroup);
      }

      cinemaGroup.sessions.push(session);
    });

    return groups;
  });

  const hasSessions = computed(() => Object.keys(groupedSessions.value).length > 0);

  return {
    movie,
    isPending,
    isError,
    error,
    groupedSessions,
    hasSessions,
  };
};
