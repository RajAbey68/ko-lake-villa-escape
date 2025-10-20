-- Migration to fix schema mismatches between UI and database
-- Created: 2025-10-19
-- Purpose: Align database schema with admin UI expectations

-- 1. RENAME gallery table to gallery_images
ALTER TABLE IF EXISTS public.gallery RENAME TO gallery_images;

-- 2. ADD missing columns to gallery_images
ALTER TABLE public.gallery_images 
  ADD COLUMN IF NOT EXISTS object_path TEXT,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'villa',
  ADD COLUMN IF NOT EXISTS tags TEXT[],
  ADD COLUMN IF NOT EXISTS filename TEXT;

-- 3. MIGRATE data from media_url to image_url if needed
UPDATE public.gallery_images 
SET image_url = media_url, 
    object_path = media_url,
    thumbnail_url = media_url
WHERE image_url IS NULL;

-- 4. FIX hero_content table to match UI expectations
ALTER TABLE public.hero_content
  ADD COLUMN IF NOT EXISTS background_image TEXT,
  ADD COLUMN IF NOT EXISTS cta_url TEXT;

-- Migrate existing data
UPDATE public.hero_content 
SET background_image = image_url,
    cta_url = cta_action
WHERE background_image IS NULL;

-- 5. FIX location_info table
ALTER TABLE public.location_info
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Sri Lanka',
  ADD COLUMN IF NOT EXISTS postal_code TEXT,
  ADD COLUMN IF NOT EXISTS latitude NUMERIC,
  ADD COLUMN IF NOT EXISTS longitude NUMERIC,
  ADD COLUMN IF NOT EXISTS google_maps_url TEXT,
  ADD COLUMN IF NOT EXISTS directions TEXT,
  ADD COLUMN IF NOT EXISTS nearby_attractions TEXT[];

-- 6. FIX room_types table - ensure capacity field exists
ALTER TABLE public.room_types
  ADD COLUMN IF NOT EXISTS capacity INTEGER;

-- Update capacity from max_guests if not set
UPDATE public.room_types 
SET capacity = max_guests
WHERE capacity IS NULL;

-- 7. UPDATE RLS policies for gallery_images
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

-- 8. ENSURE RLS is enabled
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for room_types if missing
DROP POLICY IF EXISTS "Room types are viewable by everyone" ON public.room_types;
DROP POLICY IF EXISTS "Room types can be managed by admins" ON public.room_types;

CREATE POLICY "Room types are viewable by everyone" 
ON public.room_types 
FOR SELECT 
USING (true);

CREATE POLICY "Room types can be managed by admins" 
ON public.room_types 
FOR ALL 
USING (true)
WITH CHECK (true);

-- 9. UPDATE triggers for gallery_images
DROP TRIGGER IF EXISTS update_gallery_updated_at ON public.gallery_images;

CREATE TRIGGER update_gallery_images_updated_at
  BEFORE UPDATE ON public.gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Schema migration completed successfully!';
  RAISE NOTICE '✅ gallery renamed to gallery_images';
  RAISE NOTICE '✅ Added missing columns to all tables';
  RAISE NOTICE '✅ Updated RLS policies';
  RAISE NOTICE '✅ Ready for admin UI!';
END $$;
