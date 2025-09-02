import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useWatchlist = (profileId?: string) => {
  return useQuery({
    queryKey: ['watchlist', profileId],
    queryFn: async () => {
      if (!profileId) throw new Error('No profile ID');
      
      const { data, error } = await supabase
        .from('watchlist')
        .select(`
          id,
          movie_id,
          created_at,
          movies (
            id,
            title,
            poster_url,
            backdrop_url,
            year,
            genre,
            rating,
            runtime
          )
        `)
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!profileId,
  });
};

export const useAddToWatchlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ profileId, movieId }: { profileId: string; movieId: string }) => {
      const { data, error } = await supabase
        .from('watchlist')
        .insert({
          profile_id: profileId,
          movie_id: movieId
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { profileId }) => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', profileId] });
    },
  });
};

export const useRemoveFromWatchlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ profileId, movieId }: { profileId: string; movieId: string }) => {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('profile_id', profileId)
        .eq('movie_id', movieId);
      
      if (error) throw error;
    },
    onSuccess: (_, { profileId }) => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', profileId] });
    },
  });
};

export const useIsInWatchlist = (profileId?: string, movieId?: string) => {
  return useQuery({
    queryKey: ['watchlist-check', profileId, movieId],
    queryFn: async () => {
      if (!profileId || !movieId) return false;
      
      const { data, error } = await supabase
        .from('watchlist')
        .select('id')
        .eq('profile_id', profileId)
        .eq('movie_id', movieId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    },
    enabled: !!profileId && !!movieId,
  });
};