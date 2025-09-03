const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';

// Using a demo API key - user should replace with their own
const TMDB_API_KEY = process.env.TMDB_API_KEY || 'demo_key_replace_with_real_key';

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  runtime?: number;
  genres?: Array<{ id: number; name: string }>;
  genre_ids?: number[];
  popularity: number;
  video?: boolean;
}

export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface TMDBMovieDetails extends TMDBMovie {
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  videos: {
    results: TMDBVideo[];
  };
}

class TMDBService {
  private async fetchFromTMDB(endpoint: string): Promise<any> {
    try {
      const response = await fetch(`${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}`);
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('TMDB API Error:', error);
      throw error;
    }
  }

  async getTrendingMovies(): Promise<TMDBMovie[]> {
    const data = await this.fetchFromTMDB('/trending/movie/week');
    return data.results || [];
  }

  async getPopularMovies(): Promise<TMDBMovie[]> {
    const data = await this.fetchFromTMDB('/movie/popular');
    return data.results || [];
  }

  async getTopRatedMovies(): Promise<TMDBMovie[]> {
    const data = await this.fetchFromTMDB('/movie/top_rated');
    return data.results || [];
  }

  async getNowPlayingMovies(): Promise<TMDBMovie[]> {
    const data = await this.fetchFromTMDB('/movie/now_playing');
    return data.results || [];
  }

  async getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
    const data = await this.fetchFromTMDB(`/movie/${movieId}?append_to_response=videos`);
    return data;
  }

  async searchMovies(query: string): Promise<TMDBMovie[]> {
    if (!query.trim()) return [];
    const data = await this.fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}`);
    return data.results || [];
  }

  async getMovieVideos(movieId: number): Promise<TMDBVideo[]> {
    const data = await this.fetchFromTMDB(`/movie/${movieId}/videos`);
    return data.results || [];
  }

  getImageUrl(path: string | null): string {
    if (!path) return '/placeholder.svg';
    return `${TMDB_IMAGE_BASE_URL}${path}`;
  }

  getBackdropUrl(path: string | null): string {
    if (!path) return '/placeholder.svg';
    return `${TMDB_BACKDROP_BASE_URL}${path}`;
  }

  getTrailerUrl(videos: TMDBVideo[]): string | null {
    const trailer = videos.find(
      video => video.site === 'YouTube' && 
               (video.type === 'Trailer' || video.type === 'Teaser') &&
               video.official
    ) || videos.find(
      video => video.site === 'YouTube' && 
               (video.type === 'Trailer' || video.type === 'Teaser')
    );
    
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  }

  getYouTubeEmbedUrl(videos: TMDBVideo[]): string | null {
    const trailer = videos.find(
      video => video.site === 'YouTube' && 
               (video.type === 'Trailer' || video.type === 'Teaser') &&
               video.official
    ) || videos.find(
      video => video.site === 'YouTube' && 
               (video.type === 'Trailer' || video.type === 'Teaser')
    );
    
    return trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0` : null;
  }
}

export const tmdbService = new TMDBService();