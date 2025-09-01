import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import MovieRow from "@/components/MovieRow";
import { trendingMovies, popularMovies, newReleases } from "@/data/mockMovies";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroBanner />
        
        <div className="space-y-12 pb-20">
          <MovieRow title="Trending Now" movies={trendingMovies} />
          <MovieRow title="Popular on CINEMIX" movies={popularMovies} />
          <MovieRow title="New Releases" movies={newReleases} />
          <MovieRow title="Continue Watching" movies={trendingMovies.slice(0, 4)} />
          <MovieRow title="My List" movies={popularMovies.slice(0, 3)} />
        </div>
      </main>
    </div>
  );
};

export default Index;
