import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MovieCard from "./MovieCard";
import { useState } from "react";

interface Movie {
  id: number;
  title: string;
  image: string;
  year: string;
  genre: string;
  rating: string;
  duration: string;
}

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

const MovieRow = ({ title, movies }: MovieRowProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(`scroll-${title.replace(/\s+/g, '-')}`);
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;
      
      container.scrollLeft = newPosition;
      setScrollPosition(newPosition);
    }
  };

  return (
    <div className="relative group/row">
      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 px-4">{title}</h2>
      
      {/* Left Arrow */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 bg-background/80 backdrop-blur hover:bg-background/90 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
        onClick={() => scroll('left')}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      {/* Movies Container */}
      <div 
        id={`scroll-${title.replace(/\s+/g, '-')}`}
        className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth px-4 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="flex-none w-64 md:w-80">
            <MovieCard
              title={movie.title}
              image={movie.image}
              year={movie.year}
              genre={movie.genre}
              rating={movie.rating}
              duration={movie.duration}
            />
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 bg-background/80 backdrop-blur hover:bg-background/90 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
        onClick={() => scroll('right')}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default MovieRow;