-- Create mosques table with geolocation data
CREATE TABLE public.mosques (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  country TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  geofence_radius INTEGER NOT NULL DEFAULT 100,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on mosques
ALTER TABLE public.mosques ENABLE ROW LEVEL SECURITY;

-- Mosques are publicly readable (anyone can see mosque locations)
CREATE POLICY "Mosques are viewable by everyone" 
ON public.mosques FOR SELECT 
USING (true);

-- Create user_favorite_mosques table
CREATE TABLE public.user_favorite_mosques (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mosque_id UUID NOT NULL REFERENCES public.mosques(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, mosque_id)
);

-- Enable RLS
ALTER TABLE public.user_favorite_mosques ENABLE ROW LEVEL SECURITY;

-- Users can manage their own favorites
CREATE POLICY "Users can view their own favorites" 
ON public.user_favorite_mosques FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites" 
ON public.user_favorite_mosques FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
ON public.user_favorite_mosques FOR DELETE 
USING (auth.uid() = user_id);

-- Create mosque_visits table to track user visits
CREATE TABLE public.mosque_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mosque_id UUID NOT NULL REFERENCES public.mosques(id) ON DELETE CASCADE,
  entered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  exited_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER
);

-- Enable RLS
ALTER TABLE public.mosque_visits ENABLE ROW LEVEL SECURITY;

-- Users can manage their own visits
CREATE POLICY "Users can view their own visits" 
ON public.mosque_visits FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own visits" 
ON public.mosque_visits FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own visits" 
ON public.mosque_visits FOR UPDATE 
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_mosques_updated_at
BEFORE UPDATE ON public.mosques
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample mosques for testing
INSERT INTO public.mosques (name, address, city, country, latitude, longitude, geofence_radius, is_verified) VALUES
('Masjid Al-Noor', '123 Islamic Way', 'New York', 'USA', 40.7128, -74.0060, 100, true),
('Islamic Center of America', '456 Dearborn Ave', 'Dearborn', 'USA', 42.3223, -83.1763, 150, true),
('Masjid Al-Huda', '789 Faith Street', 'Los Angeles', 'USA', 34.0522, -118.2437, 100, true),
('East London Mosque', '82 Whitechapel Road', 'London', 'UK', 51.5170, -0.0650, 120, true),
('Masjid Sultan', '3 Muscat Street', 'Singapore', 'Singapore', 1.3024, 103.8591, 80, true);