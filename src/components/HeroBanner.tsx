import { Play, Info, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const HeroBanner = () => {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="relative h-screen flex items-center justify-start">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1489599732871-42852138d8ac?w=1920&h=1080&fit=crop&crop=entropy&auto=format&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 max-w-2xl">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
            Stranger Things
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
            When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.
          </p>
          
          <div className="flex items-center space-x-4">
            <Button size="lg" className="px-8 py-3 text-lg font-semibold">
              <Play className="mr-2 h-5 w-5 fill-current" />
              Play
            </Button>
            <Button variant="secondary" size="lg" className="px-8 py-3 text-lg">
              <Info className="mr-2 h-5 w-5" />
              More Info
            </Button>
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span className="bg-primary px-2 py-1 text-primary-foreground rounded">2016</span>
            <span>4 Seasons</span>
            <span>•</span>
            <span>Sci-Fi</span>
            <span>•</span>
            <span>Drama</span>
          </div>
        </div>
      </div>

      {/* Volume Control */}
      <Button 
        variant="ghost" 
        size="icon"
        className="absolute bottom-8 right-8 z-10"
        onClick={() => setIsMuted(!isMuted)}
      >
        {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
      </Button>
    </section>
  );
};

export default HeroBanner;