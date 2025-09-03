import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfiles } from '@/hooks/useProfiles';
import { useSearchMovies } from '@/hooks/useTMDBMovies';
import Header from '@/components/Header';
import TMDBMovieCard from '@/components/TMDBMovieCard';
import Profiles from '@/pages/Profiles';
import { UserProfile } from '@/hooks/useProfiles';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const { user } = useAuth();
  const { data: profiles = [] } = useUserProfiles();
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  
  const { data: searchResults = [], isLoading } = useSearchMovies(query);

  // Auto-select profile if user has only one
  if (profiles.length === 1 && !selectedProfile) {
    setSelectedProfile(profiles[0]);
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query) {
        setSearchParams({ q: query });
      } else {
        setSearchParams({});
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query, setSearchParams]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Please sign in to search movies.</p>
      </div>
    );
  }

  if (!selectedProfile) {
    return <Profiles onSelectProfile={setSelectedProfile} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header profile={selectedProfile} onProfileChange={() => setSelectedProfile(null)} />
      
      <main className="pt-20 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 py-3 text-lg bg-card border-border"
              />
            </div>
          </div>

          {isLoading && query && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {!query && (
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold mb-4">Search for Movies</h2>
              <p className="text-muted-foreground">
                Type in the search box above to find your favorite movies and shows.
              </p>
            </div>
          )}

          {query && !isLoading && searchResults.length === 0 && (
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold mb-4">No results found</h2>
              <p className="text-muted-foreground">
                Try searching with different keywords.
              </p>
            </div>
          )}

          {searchResults.length > 0 && (
            <>
              <h2 className="text-2xl font-bold mb-6">
                Search Results for "{query}"
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {searchResults.map((movie) => (
                  <TMDBMovieCard
                    key={movie.id}
                    movie={movie}
                    profileId={selectedProfile.id}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Search;