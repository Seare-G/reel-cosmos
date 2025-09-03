import { useState } from 'react';
import { Play, Plus, Check, Heart, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { TMDBMovie, tmdbService } from '@/services/tmdb';
import { useMovieDetails } from '@/hooks/useTMDBMovies';
import TrailerModal from '@/components/TrailerModal';

interface TMDBMovieCardProps {
  movie: TMDBMovie;
  profileId?: string;
}

const TMDBMovieCard = ({ movie, profileId }: TMDBMovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const { toast } = useToast();
  
  const { data: movieDetails } = useMovieDetails(isHovered ? movie.id : undefined);

  const handlePlayTrailer = () => {
    if (movieDetails?.videos?.results?.length) {
      setIsTrailerOpen(true);
    } else {
      toast({
        variant: "destructive",
        title: "No trailer available",
        description: "Sorry, no trailer is available for this movie."
      });
    }
  };

  const formatYear = (dateString: string) => {
    return dateString ? new Date(dateString).getFullYear() : 'N/A';
  };

  const formatRating = (rating: number) => {
    return rating ? rating.toFixed(1) : 'N/A';
  };

  const formatGenres = (genreIds: number[] = []) => {
    const genreMap: { [key: number]: string } = {
      28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
      99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
      27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
      10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
    };
    
    return genreIds.slice(0, 2).map(id => genreMap[id] || 'Unknown').join(', ');
  };

  const embedUrl = movieDetails?.videos?.results?.length 
    ? tmdbService.getYouTubeEmbedUrl(movieDetails.videos.results)
    : null;

  return (
    <>
      <div
        className="group relative cursor-pointer transition-all duration-300 hover:scale-105"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Movie Poster */}
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-card">
          <img
            src={tmdbService.getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Hover Overlay */}
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {/* Action Buttons */}
                <div className="flex items-center gap-2 mb-3">
                  <Button
                    size="sm"
                    onClick={handlePlayTrailer}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Play
                  </Button>
                  
                  <Button size="sm" variant="outline" className="p-2">
                    <Plus className="w-4 h-4" />
                  </Button>
                  
                  <Button size="sm" variant="outline" className="p-2">
                    <Heart className="w-4 h-4" />
                  </Button>
                  
                  <Button size="sm" variant="outline" className="p-2 ml-auto">
                    <Info className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Movie Info */}
                <div className="text-sm space-y-1">
                  <h3 className="font-semibold text-foreground line-clamp-2">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <span className="text-green-500 font-medium">
                      {formatRating(movie.vote_average)} ★
                    </span>
                    <span>{formatYear(movie.release_date)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatGenres(movie.genre_ids)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        embedUrl={embedUrl}
        title={movie.title}
      />
    </>
  );
};

export default TMDBMovieCard;