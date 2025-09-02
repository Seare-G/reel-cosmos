import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Movie {
  id: string;
  title: string;
  description?: string;
  poster_url?: string;
  backdrop_url?: string;
  trailer_url?: string;
  year?: number;
  genre?: string[];
  rating?: number;
  runtime?: number;
  type?: string;
  release_date?: string;
}

export const useMovies = () => {
  return useQuery({
    queryKey: ['movies'],
    queryFn: async (): Promise<Movie[]> => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useFeaturedMovie = () => {
  return useQuery({
    queryKey: ['featured-movie'],
    queryFn: async (): Promise<Movie | null> => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('title', 'Stranger Things')
        .single();
      
      if (error) {
        // Fallback to first movie if Stranger Things not found
        const { data: fallback } = await supabase
          .from('movies')
          .select('*')
          .limit(1)
          .single();
        return fallback;
      }
      return data;
    },
  });
};

export const useMoviesByCategory = (category: string) => {
  return useQuery({
    queryKey: ['movies', category],
    queryFn: async (): Promise<Movie[]> => {
      let query = supabase.from('movies').select('*');
      
      // Add category-specific filters here if needed
      switch (category) {
        case 'trending':
          query = query.order('rating', { ascending: false });
          break;
        case 'popular':
          query = query.order('year', { ascending: false });
          break;
        case 'new':
          query = query.order('release_date', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }
      
      const { data, error } = await query.limit(20);
      
      if (error) throw error;
      return data || [];
    },
  });
};