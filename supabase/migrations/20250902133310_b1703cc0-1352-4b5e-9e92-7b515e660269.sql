-- Enable RLS on movies table (this was missing)
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;

-- Create policy for movies table - allow everyone to view movies
CREATE POLICY "Anyone can view movies" ON public.movies
  FOR SELECT USING (true);

-- Fix function security by setting proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;