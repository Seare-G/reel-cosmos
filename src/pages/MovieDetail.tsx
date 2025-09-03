import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfiles } from '@/hooks/useProfiles';
import { useMovieDetails } from '@/hooks/useTMDBMovies';
import { tmdbService } from '@/services/tmdb';
import Header from '@/components/Header';
import TrailerModal from '@/components/TrailerModal';
import Profiles from '@/pages/Profiles';
import { UserProfile } from '@/hooks/useProfiles';
import { Button } from '@/components/ui/button';
import { Play, Plus, ArrowLeft, Star } from 'lucide-react';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profiles = [] } = useUserProfiles();
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  
  const movieId = id ? parseInt(id, 10) : undefined;
  const { data: movie, isLoading, error } = useMovieDetails(movieId);

  // Auto-select profile if user has only one
  if (profiles.length === 1 && !selectedProfile) {
    setSelectedProfile(profiles[0]);
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Please sign in to view movie details.</p>
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
        <div className="pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header profile={selectedProfile} onProfileChange={() => setSelectedProfile(null)} />
        <div className="pt-20 px-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const embedUrl = movie.videos?.results?.length 
    ? tmdbService.getYouTubeEmbedUrl(movie.videos.results)
    : null;

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatYear = (dateString: string) => {
    return dateString ? new Date(dateString).getFullYear() : 'N/A';
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header profile={selectedProfile} onProfileChange={() => setSelectedProfile(null)} />
      
      <main className="pt-16">
        {/* Hero Section */}
        <div className="relative min-h-[70vh] flex items-end">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${tmdbService.getBackdropUrl(movie.backdrop_path)})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
            <div className="max-w-2xl">
              <Button 
                variant="ghost" 
                onClick={() => navigate(-1)}
                className="mb-6 hover:bg-background/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
              
              <div className="flex items-center gap-4 mb-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
                <span>{formatYear(movie.release_date)}</span>
                <span>{formatRuntime(movie.runtime)}</span>
              </div>
              
              <div className="flex gap-2 mb-6">
                {movie.genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-secondary/20 rounded-full text-sm text-secondary-foreground"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {movie.overview}
              </p>
              
              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={() => setIsTrailerOpen(true)}
                  disabled={!embedUrl}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Play Trailer
                </Button>
                
                <Button size="lg" variant="outline">
                  <Plus className="w-5 h-5 mr-2" />
                  Add to List
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        embedUrl={embedUrl}
        title={movie.title}
      />
    </div>
  );
};

export default MovieDetail;