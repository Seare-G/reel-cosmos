import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TMDBMovieCard from '@/components/TMDBMovieCard';
import { TMDBMovie } from '@/services/tmdb';

interface TMDBMovieRowProps {
  title: string;
  movies: TMDBMovie[];
  profileId?: string;
}

const TMDBMovieRow = ({ title, movies, profileId }: TMDBMovieRowProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(`movie-row-${title.replace(/\s+/g, '-').toLowerCase()}`);
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-foreground">{title}</h2>
        
        <div className="relative group">
          {/* Left Arrow */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-full rounded-none"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>

          {/* Movies Container */}
          <div
            id={`movie-row-${title.replace(/\s+/g, '-').toLowerCase()}`}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {movies.map((movie) => (
              <div key={movie.id} className="flex-shrink-0 w-[200px] sm:w-[240px]">
                <TMDBMovieCard movie={movie} profileId={profileId} />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-full rounded-none"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-8 h-8" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TMDBMovieRow;