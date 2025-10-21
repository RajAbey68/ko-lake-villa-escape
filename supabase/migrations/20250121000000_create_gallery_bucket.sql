-- Create gallery storage bucket for images and videos
-- This bucket will store all gallery media files

-- Create the bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery',
  'gallery',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for gallery bucket

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload to gallery"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update gallery files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery');

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete from gallery"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery');

-- Allow public to view files (read-only)
CREATE POLICY "Public can view gallery files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery');

-- Comments
COMMENT ON TABLE storage.buckets IS 'Storage buckets for file uploads';
