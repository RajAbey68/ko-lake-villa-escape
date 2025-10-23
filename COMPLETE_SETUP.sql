-- ============================================================================
-- COMPLETE DATABASE + STORAGE SETUP
-- Run this ONCE in Supabase SQL Editor to fix everything
-- ============================================================================

-- STEP 1: CREATE STORAGE BUCKET
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery',
  'gallery',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];

-- STEP 2: STORAGE POLICIES
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can upload to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update gallery files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete from gallery" ON storage.objects;
DROP POLICY IF EXISTS "Public can view gallery files" ON storage.objects;

-- Allow ANYONE to upload (for testing - tighten later)
CREATE POLICY "Anyone can upload to gallery"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'gallery');

-- Allow ANYONE to update
CREATE POLICY "Anyone can update gallery files"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'gallery');

-- Allow ANYONE to delete
CREATE POLICY "Anyone can delete from gallery"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'gallery');

-- Allow public to view files
CREATE POLICY "Public can view gallery files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery');

-- STEP 3: CREATE GALLERY TABLE (Simple Version)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  title TEXT,
  description TEXT,
  category TEXT DEFAULT 'villa',
  media_type TEXT DEFAULT 'image',
  object_path TEXT NOT NULL,
  thumbnail_path TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  analysis_status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 4: TABLE POLICIES
-- ============================================================================

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "Anyone can insert gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "Anyone can update gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "Anyone can delete gallery" ON public.gallery_images;

CREATE POLICY "Anyone can view gallery" 
ON public.gallery_images FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Anyone can insert gallery" 
ON public.gallery_images FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Anyone can update gallery" 
ON public.gallery_images FOR UPDATE 
TO public 
USING (true);

CREATE POLICY "Anyone can delete gallery" 
ON public.gallery_images FOR DELETE 
TO public 
USING (true);

-- STEP 5: SEED SAMPLE DATA
-- ============================================================================

INSERT INTO public.gallery_images (filename, title, description, category, media_type, object_path, is_featured, display_order)
VALUES
  ('pool-sunset.jpg', 'Infinity Pool at Sunset', 'Beautiful infinity pool overlooking the lake', 'pool', 'image', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200', true, 1),
  ('lake-view.jpg', 'Serene Lake View', 'Tranquil lake views from the villa', 'exterior', 'image', 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200', true, 2),
  ('living-room.jpg', 'Spacious Living Room', 'Comfortable and modern living space', 'interior', 'image', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', true, 3)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ ✅ ✅ SETUP COMPLETE! ✅ ✅ ✅';
  RAISE NOTICE '';
  RAISE NOTICE 'Created:';
  RAISE NOTICE '  ✓ Storage bucket: gallery (public)';
  RAISE NOTICE '  ✓ Storage policies (open for testing)';
  RAISE NOTICE '  ✓ gallery_images table';
  RAISE NOTICE '  ✓ Table policies (open for testing)';
  RAISE NOTICE '  ✓ 3 sample images';
  RAISE NOTICE '';
  RAISE NOTICE 'Test upload at: http://localhost:8081/upload';
  RAISE NOTICE 'View gallery at: http://localhost:8081/gallery';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  SECURITY NOTE: Policies are OPEN for testing.';
  RAISE NOTICE '   Tighten them before production!';
END $$;

-- Check what was created
SELECT 'Storage Bucket' as type, id, name, public FROM storage.buckets WHERE id = 'gallery'
UNION ALL
SELECT 'Gallery Images' as type, COUNT(*)::text as id, 'records' as name, 'true' as public FROM gallery_images;
