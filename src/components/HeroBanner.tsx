import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFeaturedMovie } from '@/hooks/useMovies';

const HeroBanner = () => {
  const [isMuted, setIsMuted] = useState(true);
  const navigate = useNavigate();
  const { data: featuredMovie } = useFeaturedMovie();

  if (!featuredMovie) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${featuredMovie?.backdrop_url || 'https://images.unsplash.com/photo-1489599732871-42852138d8ac?w=1920&h=1080&fit=crop'})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <h1 className="text-6xl font-bold mb-4 leading-tight">
            {featuredMovie?.title}
          </h1>
          <p className="text-xl mb-6 max-w-2xl leading-relaxed">
            {featuredMovie?.description || 'Discover amazing movies and shows'}
          </p>

          <div className="flex gap-4 mb-8">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Play className="w-5 h-5 mr-2" />
              Play
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-background/20 hover:bg-background/30 border-border"
            >
              <Info className="w-5 h-5 mr-2" />
              More Info
            </Button>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <span className="px-2 py-1 bg-destructive/20 text-destructive rounded">
              16+
            </span>
            <span>{featuredMovie?.year || new Date().getFullYear()}</span>
            <span>HD</span>
          </div>
        </div>
      </div>

      {/* Volume Control */}
      <div className="absolute bottom-8 right-8 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="bg-background/20 hover:bg-background/30 border border-border"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
};

export default HeroBanner;