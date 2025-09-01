-- Create user profiles table connected to auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_profiles table for multiple profiles per user (like Netflix)
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face&auto=format&q=80',
  is_adult BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create movies table
CREATE TABLE public.movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  poster_url TEXT,
  backdrop_url TEXT,
  trailer_url TEXT,
  genre TEXT[],
  release_date DATE,
  runtime INTEGER, -- in minutes
  rating DECIMAL(3,1), -- IMDB rating
  year INTEGER,
  type TEXT CHECK (type IN ('movie', 'tv_show')) DEFAULT 'movie',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create watchlist table
CREATE TABLE public.watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  movie_id UUID REFERENCES public.movies(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(profile_id, movie_id)
);

-- Enable RLS on watchlist
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;

-- Create watch_history table
CREATE TABLE public.watch_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  movie_id UUID REFERENCES public.movies(id) ON DELETE CASCADE NOT NULL,
  progress INTEGER DEFAULT 0, -- progress in seconds
  duration INTEGER, -- total duration in seconds
  last_watched TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(profile_id, movie_id)
);

-- Enable RLS on watch_history
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view own profiles" ON public.user_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for watchlist
CREATE POLICY "Users can manage own watchlist" ON public.watchlist
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = watchlist.profile_id AND user_id = auth.uid()
    )
  );

-- Create RLS policies for watch_history
CREATE POLICY "Users can manage own watch history" ON public.watch_history
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = watch_history.profile_id AND user_id = auth.uid()
    )
  );

-- Create trigger to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample movies data
INSERT INTO public.movies (title, description, poster_url, backdrop_url, trailer_url, genre, release_date, runtime, rating, year, type) VALUES
('Stranger Things', 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.', 'https://images.unsplash.com/photo-1489599732871-42852138d8ac?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80', 'https://images.unsplash.com/photo-1489599732871-42852138d8ac?w=1920&h=1080&fit=crop&crop=entropy&auto=format&q=80', 'https://www.youtube.com/watch?v=b9EkMc79ZSU', ARRAY['Sci-Fi', 'Drama', 'Horror'], '2016-07-15', 50, 8.7, 2016, 'tv_show'),
('The Dark Knight', 'Batman faces his greatest psychological and physical tests when the Joker wreaks havoc and chaos on the people of Gotham.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&crop=entropy&auto=format&q=80', 'https://www.youtube.com/watch?v=EXeTwQWrcwY', ARRAY['Action', 'Crime', 'Drama'], '2008-07-18', 152, 9.0, 2008, 'movie'),
('Inception', 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80', 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1920&h=1080&fit=crop&crop=entropy&auto=format&q=80', 'https://www.youtube.com/watch?v=YoHD9XEInc0', ARRAY['Sci-Fi', 'Thriller'], '2010-07-16', 148, 8.8, 2010, 'movie'),
('Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.', 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80', 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920&h=1080&fit=crop&crop=entropy&auto=format&q=80', 'https://www.youtube.com/watch?v=zSWdZVtXT7E', ARRAY['Sci-Fi', 'Drama'], '2014-11-07', 169, 8.6, 2014, 'movie'),
('Blade Runner 2049', 'A young blade runner discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop&crop=entropy&auto=format&q=80', 'https://www.youtube.com/watch?v=gCcx85zbxz4', ARRAY['Sci-Fi', 'Thriller'], '2017-10-06', 164, 8.0, 2017, 'movie'),
('Dune', 'A noble family becomes embroiled in a war for control over the galaxys most valuable asset while its scion becomes troubled by visions of a dark future.', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=entropy&auto=format&q=80', 'https://www.youtube.com/watch?v=n9xhJrPXop4', ARRAY['Sci-Fi', 'Adventure'], '2021-10-22', 155, 8.1, 2021, 'movie'),
('The Crown', 'Follows the political rivalries and romance of Queen Elizabeth IIs reign and the events that shaped the second half of the twentieth century.', 'https://images.unsplash.com/photo-1594736797933-d0301ba2fe65?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80', 'https://images.unsplash.com/photo-1594736797933-d0301ba2fe65?w=1920&h=1080&fit=crop&crop=entropy&auto=format&q=80', 'https://www.youtube.com/watch?v=JWtnJjn6ng0', ARRAY['Drama', 'History'], '2016-11-04', 58, 8.7, 2016, 'tv_show'),
('Breaking Bad', 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family future.', 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80', 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&h=1080&fit=crop&crop=entropy&auto=format&q=80', 'https://www.youtube.com/watch?v=HhesaQXLuRY', ARRAY['Drama', 'Crime', 'Thriller'], '2008-01-20', 47, 9.5, 2008, 'tv_show'),
('Avatar: The Way of Water', 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Navi race to protect their home.', 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80', 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1920&h=1080&fit=crop&crop=entropy&auto=format&q=80', 'https://www.youtube.com/watch?v=d9MyW72ELq0', ARRAY['Sci-Fi', 'Adventure'], '2022-12-16', 192, 7.6, 2022, 'movie'),
('Top Gun: Maverick', 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUNs elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.', 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80', 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=1920&h=1080&fit=crop&crop=entropy&auto=format&q=80', 'https://www.youtube.com/watch?v=qSqVVswa420', ARRAY['Action', 'Drama'], '2022-05-27', 131, 8.3, 2022, 'movie');