import { useQuery } from '@tanstack/react-query';
import { tmdbService, TMDBMovie, TMDBMovieDetails } from '@/services/tmdb';

export const useTrendingMovies = () => {
  return useQuery({
    queryKey: ['tmdb-trending'],
    queryFn: () => tmdbService.getTrendingMovies(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePopularMovies = () => {
  return useQuery({
    queryKey: ['tmdb-popular'],
    queryFn: () => tmdbService.getPopularMovies(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTopRatedMovies = () => {
  return useQuery({
    queryKey: ['tmdb-top-rated'],
    queryFn: () => tmdbService.getTopRatedMovies(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useNowPlayingMovies = () => {
  return useQuery({
    queryKey: ['tmdb-now-playing'],
    queryFn: () => tmdbService.getNowPlayingMovies(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useMovieDetails = (movieId: number | undefined) => {
  return useQuery({
    queryKey: ['tmdb-movie-details', movieId],
    queryFn: () => tmdbService.getMovieDetails(movieId!),
    enabled: !!movieId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSearchMovies = (query: string) => {
  return useQuery({
    queryKey: ['tmdb-search', query],
    queryFn: () => tmdbService.searchMovies(query),
    enabled: query.length > 2,
    staleTime: 5 * 60 * 1000,
  });
};