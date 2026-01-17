import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { CinemaService } from '@/api/services';
import { formatDateShort } from '@/utils/dateTime';
import type { Session, Movie, Cinema } from '@/api/types';
import queryClient from '@/api/clients/query.client';

export interface MovieGroup {
  movie: Movie;
  sessions: Session[];
}

export const useCinemaDetails = (cinemaId: number) => {
  const cinema = queryClient.getQueryData<Cinema>(['cinema', cinemaId]) || ({} as Cinema);
  const movies = queryClient.getQueryData<Movie[]>(['movies']) || [];

  const {
    isPending,
    isError,
    data: sessions,
    error,
  } = useQuery({
    queryKey: ['cinema-sessions', cinemaId],
    queryFn: async () => {
      const sessions = await CinemaService.getSessionsByCinemaId(cinemaId);
      const data = sessions.filter((session) => new Date(session.startTime) >= new Date());
      return data;
    },
    enabled: !!cinemaId,
  });

  const groupedSessions = computed(() => {
    if (!sessions.value || !movies.length) return {};

    const groups: Record<string, MovieGroup[]> = {};

    const sortedSessions = [...sessions.value].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    sortedSessions.forEach((session) => {
      const dateKey = formatDateShort(session.startTime);
      const movie = movies.find((m) => m.id === session.movieId);

      if (!movie) return;

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      let movieGroup = groups[dateKey].find((g) => g.movie.id === movie.id);

      if (!movieGroup) {
        movieGroup = { movie, sessions: [] };
        groups[dateKey].push(movieGroup);
      }

      movieGroup.sessions.push(session);
    });

    return groups;
  });

  const hasSessions = computed(() => Object.keys(groupedSessions.value).length > 0);

  return {
    cinema,
    isPending,
    isError,
    error,
    groupedSessions,
    hasSessions,
  };
};
