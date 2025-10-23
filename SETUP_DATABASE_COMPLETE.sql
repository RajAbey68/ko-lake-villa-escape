-- ============================================================================
-- Ko Lake Villa - Complete Database Setup
-- ============================================================================
-- Run this ENTIRE file in Supabase Dashboard → SQL Editor
-- This will create all tables, set up RLS, and populate with sample data
-- ============================================================================

-- PART 1: SCHEMA MIGRATIONS
-- ============================================================================

-- 1. RENAME gallery to gallery_images
ALTER TABLE IF EXISTS public.gallery RENAME TO gallery_images;

-- 2. ADD missing columns to gallery_images
ALTER TABLE IF NOT EXISTS public.gallery_images 
  ADD COLUMN IF NOT EXISTS object_path TEXT,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
  ADD COLUMN IF NOT EXISTS thumbnail_path TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'villa',
  ADD COLUMN IF NOT EXISTS filename TEXT;

-- 3. MIGRATE data from media_url to image_url if needed
UPDATE public.gallery_images 
SET image_url = media_url, 
    object_path = media_url,
    thumbnail_url = media_url
WHERE image_url IS NULL AND media_url IS NOT NULL;

-- 4. UPDATE RLS policies for gallery_images
DROP POLICY IF EXISTS "Gallery is viewable by everyone" ON public.gallery_images;
DROP POLICY IF EXISTS "Gallery can be managed by admins" ON public.gallery_images;

CREATE POLICY "Gallery images are viewable by everyone" 
ON public.gallery_images 
FOR SELECT 
USING (true);

CREATE POLICY "Gallery images can be managed by admins" 
ON public.gallery_images 
FOR ALL 
USING (true)
WITH CHECK (true);

-- 5. ENSURE RLS is enabled
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- 6. CREATE contacts table if not exists
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Public can view active contacts" 
ON public.contacts FOR SELECT USING (is_active = true);

CREATE POLICY IF NOT EXISTS "Authenticated can manage contacts" 
ON public.contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================================
-- PART 2: SEED DATA
-- ============================================================================

-- 1. HERO CONTENT
INSERT INTO hero_content (id, title, subtitle, description, cta_text, cta_url, background_image, is_active, display_order)
VALUES 
(1, 'Ko Lake Villa Escape', 'Luxury Villa in Ahangama, Sri Lanka', 'Experience tranquility at our exclusive lakeside villa. Wake up to stunning views, relax by the infinity pool, and immerse yourself in the natural beauty of Sri Lanka.', 'Book Your Stay', '/accommodation', '/images/hero-villa-lake-view.jpg', true, 1),
(2, 'Your Private Paradise', 'Serene Lakeside Living', 'Discover the perfect blend of luxury and nature. Our villa offers modern amenities, traditional Sri Lankan hospitality, and breathtaking lake views.', 'Explore Rooms', '/accommodation', '/images/hero-villa-pool.jpg', false, 2)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  cta_text = EXCLUDED.cta_text,
  cta_url = EXCLUDED.cta_url,
  background_image = EXCLUDED.background_image,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order;

-- 2. ROOM TYPES
INSERT INTO room_types (id, name, description, capacity, bedrooms, bathrooms, amenities, images, direct_price, airbnb_price, airbnb_url, is_available, display_order)
VALUES
(1, 'Lakeside Master Suite', 'Spacious master bedroom with panoramic lake views, king-size bed, ensuite bathroom, and private balcony. Perfect for couples seeking luxury and tranquility.', 2, 1, 1, 
  ARRAY['King Bed', 'Lake View', 'Private Balcony', 'AC', 'Ensuite Bathroom', 'Smart TV'],
  ARRAY['/images/hero-villa-interior.jpg', '/images/hero-villa-lake-view.jpg'], 
  150, 200, 'https://www.airbnb.com/rooms/kolakevilla', true, 1),
  
(2, 'Garden Villa', 'Charming garden-facing room with queen bed, modern amenities, and access to shared spaces. Ideal for solo travelers or couples.', 2, 1, 1,
  ARRAY['Queen Bed', 'Garden View', 'AC', 'Shared Pool', 'WiFi', 'Workspace'],
  ARRAY['/images/hero-villa-dining.jpg', '/images/hero-villa-pool.jpg'],
  120, 160, 'https://www.airbnb.com/rooms/kolakevilla', true, 2),
  
(3, 'Entire Villa (8 Guests)', 'Book the entire villa for your group! 4 bedrooms, 4 bathrooms, full kitchen, infinity pool, and exclusive lake access. Perfect for families or groups.', 8, 4, 4,
  ARRAY['4 Bedrooms', 'Private Pool', 'Full Kitchen', 'Lake Access', 'Living Room', 'Dining Area', 'BBQ', 'Parking'],
  ARRAY['/images/hero-villa-lake-view.jpg', '/images/hero-villa-pool.jpg', '/images/hero-villa-interior.jpg', '/images/hero-villa-dining.jpg'],
  500, 700, 'https://www.airbnb.com/rooms/kolakevilla', true, 3)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  capacity = EXCLUDED.capacity,
  bedrooms = EXCLUDED.bedrooms,
  bathrooms = EXCLUDED.bathrooms,
  amenities = EXCLUDED.amenities,
  images = EXCLUDED.images,
  direct_price = EXCLUDED.direct_price,
  airbnb_price = EXCLUDED.airbnb_price,
  airbnb_url = EXCLUDED.airbnb_url,
  is_available = EXCLUDED.is_available,
  display_order = EXCLUDED.display_order;

-- 3. AMENITIES
INSERT INTO amenities (id, title, description, icon_name, category, is_featured, display_order)
VALUES
(1, 'Infinity Pool', 'Stunning infinity pool overlooking the lake with comfortable loungers', 'waves', 'Property', true, 1),
(2, 'Free WiFi', 'High-speed internet throughout the property', 'wifi', 'Connectivity', true, 2),
(3, 'Lake Access', 'Direct access to the tranquil lake for swimming and kayaking', 'anchor', 'Activities', true, 3),
(4, 'Air Conditioning', 'Modern AC in all bedrooms for your comfort', 'wind', 'Comfort', true, 4),
(5, 'Full Kitchen', 'Modern kitchen with all appliances and cookware', 'utensils-crossed', 'Dining', false, 5),
(6, 'BBQ Area', 'Outdoor barbecue area perfect for evening gatherings', 'flame', 'Dining', false, 6),
(7, 'Parking', 'Free secure parking on premises', 'car', 'Convenience', false, 7),
(8, 'Garden', 'Beautiful tropical garden with seating areas', 'trees', 'Property', false, 8),
(9, 'Housekeeping', 'Daily housekeeping service included', 'sparkles', 'Services', true, 9),
(10, 'Smart TV', 'Smart TVs with streaming services', 'tv', 'Entertainment', false, 10)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  category = EXCLUDED.category,
  is_featured = EXCLUDED.is_featured,
  display_order = EXCLUDED.display_order;

-- 4. LOCATION INFO
INSERT INTO location_info (id, title, description, address, city, state, country, postal_code, latitude, longitude, google_maps_url, directions, nearby_attractions, is_active)
VALUES
(1, 'Ko Lake Villa', 
  'Located in the peaceful town of Ahangama, our villa offers the perfect escape from the hustle and bustle. Just minutes from pristine beaches and local surf spots, yet surrounded by nature and tranquility.',
  'Lake Road', 'Ahangama', 'Southern Province', 'Sri Lanka', '80650',
  5.9750, 80.3686,
  'https://maps.google.com/?q=Ahangama,+Sri+Lanka',
  'From Colombo: Take Southern Expressway to Galle, then coastal road to Ahangama (approx 2.5 hours). From Galle: 30 minutes along Galle-Matara Road.',
  ARRAY[
    'Kabalana Beach - 5 min drive',
    'Ahangama Beach - 10 min walk', 
    'Midigama Surf Spots - 5 min drive',
    'Galle Fort - 30 min drive',
    'Koggala Lake - 15 min drive',
    'Local Markets - 5 min walk'
  ],
  true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  country = EXCLUDED.country,
  postal_code = EXCLUDED.postal_code,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  google_maps_url = EXCLUDED.google_maps_url,
  directions = EXCLUDED.directions,
  nearby_attractions = EXCLUDED.nearby_attractions,
  is_active = EXCLUDED.is_active;

-- 5. GALLERY IMAGES
INSERT INTO gallery_images (id, title, description, object_path, image_url, thumbnail_url, media_type, category, display_order, is_featured)
VALUES
(gen_random_uuid(), 'Lake View at Sunset', 'Breathtaking sunset views from the villa', '/images/hero-villa-lake-view.jpg', '/images/hero-villa-lake-view.jpg', '/images/hero-villa-lake-view.jpg', 'image', 'exterior', 1, true),
(gen_random_uuid(), 'Infinity Pool', 'Relax by our stunning infinity pool', '/images/hero-villa-pool.jpg', '/images/hero-villa-pool.jpg', '/images/hero-villa-pool.jpg', 'image', 'pool', 2, true),
(gen_random_uuid(), 'Living Room', 'Spacious and comfortable living area', '/images/hero-villa-interior.jpg', '/images/hero-villa-interior.jpg', '/images/hero-villa-interior.jpg', 'image', 'interior', 3, true),
(gen_random_uuid(), 'Dining Area', 'Elegant dining space with lake views', '/images/hero-villa-dining.jpg', '/images/hero-villa-dining.jpg', '/images/hero-villa-dining.jpg', 'image', 'dining', 4, true),
(gen_random_uuid(), 'Master Bedroom', 'Luxurious master suite', '/images/hero-villa-interior.jpg', '/images/hero-villa-interior.jpg', '/images/hero-villa-interior.jpg', 'image', 'bedroom', 5, false),
(gen_random_uuid(), 'Pool Deck', 'Perfect spot for morning coffee', '/images/hero-villa-pool.jpg', '/images/hero-villa-pool.jpg', '/images/hero-villa-pool.jpg', 'image', 'exterior', 6, false)
ON CONFLICT DO NOTHING;

-- 6. CONTACTS
INSERT INTO public.contacts (role, title, name, phone, whatsapp, languages, location, description, icon, display_order) VALUES
  ('manager', 'Group Manager', 'Manager', '+94711730345', '+94711730345', ARRAY['English'], 'Ahangama based', 'Available 24/7', '📱', 1),
  ('team_leader', 'Villa Team Leader', 'Team Leader', '+94711730345', '+94711730345', ARRAY['Sinhala', 'English'], 'Villa-based', 'On-site assistance', '👨‍💼', 2),
  ('owner', 'Owner Contact', 'Owner', '+94711730345', '+94711730345', ARRAY['English'], 'Remote', 'Direct line', '👤', 3)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ DATABASE SETUP COMPLETE!';
  RAISE NOTICE '';
  RAISE NOTICE 'Created/Updated:';
  RAISE NOTICE '  - Hero content: 2 items';
  RAISE NOTICE '  - Room types: 3 items';
  RAISE NOTICE '  - Amenities: 10 items';
  RAISE NOTICE '  - Location info: 1 item';
  RAISE NOTICE '  - Gallery images: 6 items';
  RAISE NOTICE '  - Contacts: 3 items';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Refresh your app at http://localhost:8080';
  RAISE NOTICE '  2. Upload real images via /gallery-admin';
  RAISE NOTICE '  3. Update content via /admin';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Your Ko Lake Villa site is ready!';
END $$;
