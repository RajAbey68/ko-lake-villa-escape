-- ============================================================================
-- Ko Lake Villa - COMPLETE FIX - Run this ONCE in Supabase SQL Editor
-- ============================================================================
-- This creates ALL tables AND seeds them with data
-- Copy this ENTIRE file and paste into Supabase Dashboard → SQL Editor → Run
-- ============================================================================

-- STEP 1: CREATE ALL TABLES
-- ============================================================================

-- Hero Content Table
CREATE TABLE IF NOT EXISTS public.hero_content (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  cta_text TEXT,
  cta_url TEXT,
  background_image TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Room Types Table
CREATE TABLE IF NOT EXISTS public.room_types (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  capacity INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  amenities TEXT[],
  images TEXT[],
  direct_price NUMERIC,
  airbnb_price NUMERIC,
  airbnb_url TEXT,
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Amenities Table
CREATE TABLE IF NOT EXISTS public.amenities (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  category TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Location Info Table
CREATE TABLE IF NOT EXISTS public.location_info (
  id BIGSERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  google_maps_url TEXT,
  directions TEXT,
  nearby_attractions TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery Images Table
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  object_path TEXT NOT NULL,
  image_url TEXT,
  thumbnail_url TEXT,
  thumbnail_path TEXT,
  media_type TEXT DEFAULT 'image',
  category TEXT DEFAULT 'villa',
  tags TEXT[],
  filename TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts Table
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  name VARCHAR(200),
  phone VARCHAR(50) NOT NULL,
  whatsapp VARCHAR(50),
  languages TEXT[],
  location VARCHAR(200),
  description TEXT,
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Submissions Table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 2: ENABLE RLS
-- ============================================================================

ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- STEP 3: CREATE RLS POLICIES
-- ============================================================================

-- Public read access for all content tables
CREATE POLICY IF NOT EXISTS "Public can view hero" ON public.hero_content FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can view rooms" ON public.room_types FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can view amenities" ON public.amenities FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can view location" ON public.location_info FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can view gallery" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can view contacts" ON public.contacts FOR SELECT USING (is_active = true);

-- Anyone can submit contact forms
CREATE POLICY IF NOT EXISTS "Anyone can submit contact" ON public.contact_submissions FOR INSERT WITH CHECK (true);

-- Authenticated users can manage everything
CREATE POLICY IF NOT EXISTS "Authenticated can manage hero" ON public.hero_content FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Authenticated can manage rooms" ON public.room_types FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Authenticated can manage amenities" ON public.amenities FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Authenticated can manage location" ON public.location_info FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Authenticated can manage gallery" ON public.gallery_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Authenticated can manage contacts" ON public.contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- STEP 4: SEED DATA
-- ============================================================================

-- Hero Content
INSERT INTO public.hero_content (title, subtitle, description, cta_text, cta_url, background_image, is_active, display_order)
VALUES 
  ('Ko Lake Villa Escape', 'Luxury Villa in Ahangama, Sri Lanka', 'Experience tranquility at our exclusive lakeside villa. Wake up to stunning views, relax by the infinity pool, and immerse yourself in the natural beauty of Sri Lanka.', 'Book Your Stay', '/accommodation', 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920', true, 1)
ON CONFLICT DO NOTHING;

-- Room Types
INSERT INTO public.room_types (name, description, capacity, bedrooms, bathrooms, amenities, images, direct_price, airbnb_price, airbnb_url, is_available, display_order)
VALUES
  ('Lakeside Master Suite', 'Spacious master bedroom with panoramic lake views', 2, 1, 1, ARRAY['King Bed', 'Lake View', 'AC'], ARRAY['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200'], 150, 200, 'https://www.airbnb.com', true, 1),
  ('Garden Villa', 'Charming garden-facing room', 2, 1, 1, ARRAY['Queen Bed', 'Garden View', 'AC'], ARRAY['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200'], 120, 160, 'https://www.airbnb.com', true, 2),
  ('Entire Villa', 'Book the entire villa for your group', 8, 4, 4, ARRAY['4 Bedrooms', 'Private Pool', 'Full Kitchen'], ARRAY['https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1200'], 500, 700, 'https://www.airbnb.com', true, 3)
ON CONFLICT DO NOTHING;

-- Amenities
INSERT INTO public.amenities (title, description, icon_name, category, is_featured, display_order)
VALUES
  ('Infinity Pool', 'Stunning infinity pool overlooking the lake', 'waves', 'Property', true, 1),
  ('Free WiFi', 'High-speed internet throughout the property', 'wifi', 'Connectivity', true, 2),
  ('Lake Access', 'Direct access to the tranquil lake', 'anchor', 'Activities', true, 3),
  ('Air Conditioning', 'Modern AC in all bedrooms', 'wind', 'Comfort', true, 4),
  ('Full Kitchen', 'Modern kitchen with all appliances', 'utensils-crossed', 'Dining', false, 5),
  ('BBQ Area', 'Outdoor barbecue area', 'flame', 'Dining', false, 6),
  ('Parking', 'Free secure parking', 'car', 'Convenience', false, 7),
  ('Garden', 'Beautiful tropical garden', 'trees', 'Property', false, 8),
  ('Housekeeping', 'Daily housekeeping service', 'sparkles', 'Services', true, 9),
  ('Smart TV', 'Smart TVs with streaming', 'tv', 'Entertainment', false, 10)
ON CONFLICT DO NOTHING;

-- Location Info
INSERT INTO public.location_info (title, description, address, city, state, country, postal_code, latitude, longitude, google_maps_url, directions, nearby_attractions, is_active)
VALUES
  ('Ko Lake Villa', 'Located in the peaceful town of Ahangama', 'Lake Road', 'Ahangama', 'Southern Province', 'Sri Lanka', '80650', 5.9750, 80.3686, 'https://maps.google.com/?q=Ahangama,+Sri+Lanka', 'From Colombo: Take Southern Expressway to Galle (approx 2.5 hours)', ARRAY['Kabalana Beach - 5 min', 'Galle Fort - 30 min', 'Koggala Lake - 15 min'], true)
ON CONFLICT DO NOTHING;

-- Gallery Images
INSERT INTO public.gallery_images (title, description, object_path, image_url, thumbnail_url, media_type, category, filename, display_order, is_featured)
VALUES
  ('Lake View at Sunset', 'Breathtaking sunset views', 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200', 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200', 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400', 'image', 'exterior', 'lake-sunset.jpg', 1, true),
  ('Infinity Pool', 'Relax by our stunning pool', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400', 'image', 'pool', 'pool.jpg', 2, true),
  ('Living Room', 'Spacious living area', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400', 'image', 'interior', 'living.jpg', 3, true),
  ('Dining Area', 'Elegant dining space', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', 'image', 'dining', 'dining.jpg', 4, true),
  ('Master Bedroom', 'Luxurious suite', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400', 'image', 'bedroom', 'bedroom.jpg', 5, false),
  ('Garden View', 'Tropical paradise', 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1200', 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1200', 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=400', 'image', 'exterior', 'garden.jpg', 6, false)
ON CONFLICT DO NOTHING;

-- Contacts
INSERT INTO public.contacts (role, title, name, phone, whatsapp, languages, location, description, icon, display_order, is_active)
VALUES
  ('manager', 'Group Manager', 'Manager', '+94711730345', '+94711730345', ARRAY['English'], 'Ahangama', 'Available 24/7', '📱', 1, true),
  ('team_leader', 'Villa Team Leader', 'Team Leader', '+94711730345', '+94711730345', ARRAY['Sinhala', 'English'], 'Villa-based', 'On-site assistance', '👨‍💼', 2, true),
  ('owner', 'Owner Contact', 'Owner', '+94711730345', '+94711730345', ARRAY['English'], 'Remote', 'Direct line', '👤', 3, true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SUCCESS!
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ ✅ ✅ DATABASE SETUP COMPLETE! ✅ ✅ ✅';
  RAISE NOTICE '';
  RAISE NOTICE 'Created and populated:';
  RAISE NOTICE '  ✓ hero_content table (1 item)';
  RAISE NOTICE '  ✓ room_types table (3 items)';
  RAISE NOTICE '  ✓ amenities table (10 items)';
  RAISE NOTICE '  ✓ location_info table (1 item)';
  RAISE NOTICE '  ✓ gallery_images table (6 items)';
  RAISE NOTICE '  ✓ contacts table (3 items)';
  RAISE NOTICE '';
  RAISE NOTICE 'NOW: Refresh your browser at http://localhost:8080';
  RAISE NOTICE 'All errors should be GONE!';
END $$;
