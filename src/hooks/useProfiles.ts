import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  avatar_url?: string;
  is_adult?: boolean;
  created_at?: string;
}

export const useUserProfiles = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-profiles', user?.id],
    queryFn: async (): Promise<UserProfile[]> => {
      if (!user) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (profileData: { name: string; is_adult?: boolean; avatar_url?: string }) => {
      if (!user) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          ...profileData
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profiles', user?.id] });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ profileId, updates }: { 
      profileId: string; 
      updates: Partial<UserProfile> 
    }) => {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', profileId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profiles', user?.id] });
    },
  });
};

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (profileId: string) => {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', profileId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profiles', user?.id] });
    },
  });
};