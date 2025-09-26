-- Create amenities table for KoLakeAmenities data
CREATE TABLE public.amenities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('resort_facilities', 'comfort', 'activities')),
  icon_name TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hero_content table for KoLakeHero data
CREATE TABLE public.hero_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  image_alt TEXT,
  cta_text TEXT,
  cta_action TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create location_info table for KoLakeLocation data
CREATE TABLE public.location_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  address TEXT,
  coordinates TEXT,
  transport_options JSONB,
  nearby_attractions JSONB,
  contact_info JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_info ENABLE ROW LEVEL SECURITY;

-- Create policies for amenities
CREATE POLICY "Amenities are viewable by everyone" 
ON public.amenities 
FOR SELECT 
USING (true);

CREATE POLICY "Amenities can be managed by admins" 
ON public.amenities 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create policies for hero_content
CREATE POLICY "Hero content is viewable by everyone" 
ON public.hero_content 
FOR SELECT 
USING (true);

CREATE POLICY "Hero content can be managed by admins" 
ON public.hero_content 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create policies for location_info
CREATE POLICY "Location info is viewable by everyone" 
ON public.location_info 
FOR SELECT 
USING (true);

CREATE POLICY "Location info can be managed by admins" 
ON public.location_info 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_amenities_updated_at
  BEFORE UPDATE ON public.amenities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hero_content_updated_at
  BEFORE UPDATE ON public.hero_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_location_info_updated_at
  BEFORE UPDATE ON public.location_info
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for amenities
INSERT INTO public.amenities (title, description, category, icon_name, is_featured, display_order) VALUES
('Spa & Wellness Center', 'Traditional Ayurvedic treatments and modern wellness facilities', 'resort_facilities', 'Sparkles', true, 1),
('Infinity Pool', 'Overlooking the serene lake with stunning sunset views', 'resort_facilities', 'Waves', true, 2),
('Fine Dining Restaurant', 'Contemporary Sri Lankan cuisine with international flavors', 'resort_facilities', 'UtensilsCrossed', true, 3),
('Lake Activities', 'Kayaking, paddle boarding, and boat excursions', 'activities', 'Sailboat', true, 4),
('Air Conditioning', 'Individual climate control in all accommodations', 'comfort', 'Snowflake', false, 5),
('Premium Bedding', 'Egyptian cotton linens and luxury mattresses', 'comfort', 'Bed', false, 6),
('Private Balconies', 'Personal outdoor space with lake or garden views', 'comfort', 'TreePine', false, 7),
('Cultural Tours', 'Guided excursions to ancient temples and historic sites', 'activities', 'MapPin', false, 8),
('Yoga Pavilion', 'Sunrise and sunset yoga sessions by the lake', 'activities', 'Heart', false, 9),
('Conference Facilities', 'Modern meeting rooms for business events', 'resort_facilities', 'Presentation', false, 10);

-- Insert sample data for hero_content
INSERT INTO public.hero_content (title, subtitle, description, image_url, image_alt, cta_text, cta_action, display_order) VALUES
('Luxury Eco Villa by Ahangama Lake', 'Sustainable Paradise', 'Experience the perfect blend of luxury and nature in our eco-friendly lakefront resort', '/placeholder.svg', 'Luxury villa overlooking Ahangama Lake', 'Book Your Stay', 'booking', 1),
('Serene Lake Views', 'Wake Up to Paradise', 'Every morning brings breathtaking views of the pristine lake surrounded by lush greenery', '/placeholder.svg', 'Sunrise over Ahangama Lake from villa terrace', 'Explore Rooms', 'rooms', 2),
('Authentic Sri Lankan Experience', 'Culture & Comfort', 'Immerse yourself in local culture while enjoying world-class amenities and hospitality', '/placeholder.svg', 'Traditional Sri Lankan cultural performance at the resort', 'Discover More', 'amenities', 3);

-- Insert sample data for location_info
INSERT INTO public.location_info (title, description, address, coordinates, transport_options, nearby_attractions, contact_info) VALUES
('Prime Location in Ahangama', 
'Nestled on the shores of the pristine Ahangama Lake, Ko Lake Villa offers unparalleled access to Sri Lanka''s southern coastal paradise', 
'Lake Round, Ahangama 80650, Sri Lanka',
'7.2906° N, 80.6337° E',
'{"airport": {"name": "Bandaranaike International Airport", "distance": "115 km", "duration": "2.5 hours"}, "train": {"station": "Kandy Railway Station", "distance": "2 km", "duration": "10 minutes"}, "taxi": {"availability": "24/7", "notes": "Direct pickup from hotel"}}',
'{"temples": [{"name": "Temple of the Sacred Tooth Relic", "distance": "1.5 km"}, {"name": "Gadaladeniya Temple", "distance": "15 km"}], "gardens": [{"name": "Royal Botanical Gardens", "distance": "6 km"}, {"name": "Udawattakele Forest Reserve", "distance": "3 km"}], "cultural": [{"name": "Kandy Cultural Centre", "distance": "1 km"}, {"name": "National Museum", "distance": "2 km"}]}',
'{"phone": "+94 77 123 4567", "email": "info@kolakevilla.com", "whatsapp": "+94 77 123 4567", "emergency": "+94 11 242 2222"}'
);