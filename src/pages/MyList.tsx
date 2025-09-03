import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfiles } from '@/hooks/useProfiles';
import { useWatchlist } from '@/hooks/useWatchlist';
import Header from '@/components/Header';
import MovieCard from '@/components/MovieCard';
import Profiles from '@/pages/Profiles';
import { UserProfile } from '@/hooks/useProfiles';

const MyList = () => {
  const { user } = useAuth();
  const { data: profiles = [] } = useUserProfiles();
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  
  const { data: watchlistItems = [], isLoading } = useWatchlist(selectedProfile?.id);

  // Auto-select profile if user has only one
  if (profiles.length === 1 && !selectedProfile) {
    setSelectedProfile(profiles[0]);
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Please sign in to view your list.</p>
      </div>
    );
  }

  if (!selectedProfile) {
    return <Profiles onSelectProfile={setSelectedProfile} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header profile={selectedProfile} onProfileChange={() => setSelectedProfile(null)} />
        <div className="pt-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">My List</h1>
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header profile={selectedProfile} onProfileChange={() => setSelectedProfile(null)} />
      
      <main className="pt-20 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My List</h1>
          
          {watchlistItems.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold mb-4">Your list is empty</h2>
              <p className="text-muted-foreground mb-8">
                Add movies and shows to your list to watch them later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {watchlistItems.map((item) => (
                item.movies && (
                  <MovieCard
                    key={item.id}
                    movie={{
                      id: item.movies.id,
                      title: item.movies.title,
                      poster_url: item.movies.poster_url,
                      backdrop_url: item.movies.backdrop_url,
                      year: item.movies.year,
                      genre: item.movies.genre,
                      rating: item.movies.rating,
                      runtime: item.movies.runtime,
                      description: '',
                      trailer_url: '',
                      release_date: '',
                      type: 'movie'
                    }}
                    profileId={selectedProfile.id}
                  />
                )
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyList;