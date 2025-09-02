import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import MovieRow from "@/components/MovieRow";
import Profiles from "@/pages/Profiles";
import { useAuth } from "@/contexts/AuthContext";
import { useMoviesByCategory } from "@/hooks/useMovies";
import { useUserProfiles, UserProfile } from "@/hooks/useProfiles";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  
  const { data: profiles = [] } = useUserProfiles();
  const { data: trendingMovies = [] } = useMoviesByCategory('trending');
  const { data: popularMovies = [] } = useMoviesByCategory('popular');  
  const { data: newReleases = [] } = useMoviesByCategory('new');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Auto-select profile if user has only one
    if (profiles.length === 1 && !selectedProfile) {
      setSelectedProfile(profiles[0]);
    }
  }, [profiles, selectedProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Show profiles selection if no profile is selected
  if (!selectedProfile) {
    return <Profiles onSelectProfile={setSelectedProfile} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header profile={selectedProfile} onProfileChange={() => setSelectedProfile(null)} />
      <main>
        <HeroBanner />
        
        <div className="space-y-12 pb-20">
          <MovieRow title="Trending Now" movies={trendingMovies} profileId={selectedProfile.id} />
          <MovieRow title="Popular on CINEMIX" movies={popularMovies} profileId={selectedProfile.id} />
          <MovieRow title="New Releases" movies={newReleases} profileId={selectedProfile.id} />
        </div>
      </main>
    </div>
  );
};

export default Index;
