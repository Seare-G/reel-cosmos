import { Play, Plus, ChevronDown, Heart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Movie } from "@/hooks/useMovies";
import { useAddToWatchlist, useRemoveFromWatchlist, useIsInWatchlist } from "@/hooks/useWatchlist";
import { useToast } from "@/hooks/use-toast";

interface MovieCardProps {
  movie: Movie;
  profileId?: string;
}

const MovieCard = ({ movie, profileId }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  
  const { data: isInWatchlist = false } = useIsInWatchlist(profileId, movie.id);
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  const handleWatchlistToggle = async () => {
    if (!profileId) return;
    
    try {
      if (isInWatchlist) {
        await removeFromWatchlist.mutateAsync({ profileId, movieId: movie.id });
        toast({
          title: "Removed from watchlist",
          description: `${movie.title} has been removed from your list.`
        });
      } else {
        await addToWatchlist.mutateAsync({ profileId, movieId: movie.id });
        toast({
          title: "Added to watchlist",
          description: `${movie.title} has been added to your list.`
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again."
      });
    }
  };

  return (
    <div 
      className="relative group cursor-pointer transition-all duration-300 transform hover:scale-105 hover:z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Movie Poster */}
      <div className="aspect-[16/9] rounded-lg overflow-hidden bg-card shadow-lg">
        <img 
          src={movie.poster_url || movie.backdrop_url || "https://via.placeholder.com/400x225"} 
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button size="sm" className="h-8 w-8 rounded-full p-0">
                  <Play className="h-4 w-4 fill-current" />
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="h-8 w-8 rounded-full p-0"
                  onClick={handleWatchlistToggle}
                  disabled={addToWatchlist.isPending || removeFromWatchlist.isPending}
                >
                  {isInWatchlist ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0 ml-auto">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Movie Info */}
              <div className="space-y-1">
                <h3 className="font-semibold text-sm text-foreground line-clamp-1">{movie.title}</h3>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  {movie.rating && <span className="text-green-400">{Math.round(movie.rating * 10)}% Match</span>}
                  {movie.year && <span>{movie.year}</span>}
                  {movie.runtime && <span>{movie.runtime}m</span>}
                </div>
                <p className="text-xs text-muted-foreground">
                  {movie.genre?.slice(0, 2).join(", ") || "Drama"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;