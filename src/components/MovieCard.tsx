import { Play, Plus, ChevronDown, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MovieCardProps {
  title: string;
  image: string;
  year: string;
  genre: string;
  rating: string;
  duration: string;
}

const MovieCard = ({ title, image, year, genre, rating, duration }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative group cursor-pointer transition-all duration-300 transform hover:scale-105 hover:z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Movie Poster */}
      <div className="aspect-[16/9] rounded-lg overflow-hidden bg-card shadow-lg">
        <img 
          src={image} 
          alt={title}
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
                <Button variant="secondary" size="sm" className="h-8 w-8 rounded-full p-0">
                  <Plus className="h-4 w-4" />
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
                <h3 className="font-semibold text-sm text-foreground line-clamp-1">{title}</h3>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span className="text-green-400">{rating}% Match</span>
                  <span>{year}</span>
                  <span>{duration}</span>
                </div>
                <p className="text-xs text-muted-foreground">{genre}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;