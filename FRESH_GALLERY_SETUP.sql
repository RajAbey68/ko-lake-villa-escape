-- ============================================================================
-- FRESH GALLERY SETUP - Brand New Deployment
-- Run this in Supabase SQL Editor to set up empty gallery system
-- ============================================================================

-- STEP 1: CREATE STORAGE BUCKET FOR UPLOADS
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery',
  'gallery',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];

-- STEP 2: STORAGE POLICIES (OPEN FOR ADMIN UPLOADS)
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can upload to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update gallery files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete from gallery" ON storage.objects;
DROP POLICY IF EXISTS "Public can view gallery files" ON storage.objects;

-- Allow uploads
CREATE POLICY "Anyone can upload to gallery"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'gallery');

-- Allow updates
CREATE POLICY "Anyone can update gallery files"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'gallery');

-- Allow deletes
CREATE POLICY "Anyone can delete from gallery"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'gallery');

-- Allow public viewing
CREATE POLICY "Public can view gallery files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery');

-- STEP 3: CREATE GALLERY_IMAGES TABLE (EMPTY - READY FOR UPLOADS)
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 4: TABLE POLICIES (OPEN FOR ADMIN MANAGEMENT)
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

-- STEP 5: CREATE UPDATE TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_gallery_images_updated_at ON public.gallery_images;

CREATE TRIGGER update_gallery_images_updated_at
  BEFORE UPDATE ON public.gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- VERIFICATION & SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ ✅ ✅ GALLERY SETUP COMPLETE! ✅ ✅ ✅';
  RAISE NOTICE '';
  RAISE NOTICE 'Created:';
  RAISE NOTICE '  ✓ Storage bucket: gallery (public, 50MB limit)';
  RAISE NOTICE '  ✓ Storage policies (open for uploads)';
  RAISE NOTICE '  ✓ gallery_images table (empty, ready for data)';
  RAISE NOTICE '  ✓ Table policies (open for admin management)';
  RAISE NOTICE '  ✓ Auto-update trigger';
  RAISE NOTICE '';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '  1. Go to /gallery-admin';
  RAISE NOTICE '  2. Click "Add Gallery Item"';
  RAISE NOTICE '  3. Upload images/videos';
  RAISE NOTICE '  4. View at /gallery';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  SECURITY: Policies are OPEN for testing.';
  RAISE NOTICE '   Tighten before production!';
END $$;

-- Check what was created
SELECT 
  'Storage Bucket' as component,
  id as name,
  CASE WHEN public THEN 'Public' ELSE 'Private' END as access,
  'Ready' as status
FROM storage.buckets 
WHERE id = 'gallery'

UNION ALL

SELECT 
  'Gallery Table' as component,
  'gallery_images' as name,
  'Empty' as access,
  'Ready for uploads' as status;
