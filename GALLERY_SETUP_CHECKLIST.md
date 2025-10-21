# Gallery Admin Setup Checklist

## Current Issue
Upload shows "Error" - need to identify the specific error message.

## Likely Causes

### 1. Supabase Storage Bucket Missing
**Symptom:** Error during upload
**Fix:** Create storage bucket in Supabase

**Steps:**
1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/storage/buckets
2. Click "New bucket"
3. Name: `gallery`
4. Make it **PUBLIC** ✅
5. Click "Create bucket"

### 2. Database Table Missing
**Symptom:** Error when clicking "Publish to Gallery"
**Fix:** Run migration to create `gallery_images` table

**SQL to run in Supabase SQL Editor:**
```sql
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  object_path TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image',
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  category TEXT,
  filename TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Public read access" ON gallery_images
  FOR SELECT USING (true);

-- Allow authenticated insert/update/delete (for admin)
CREATE POLICY "Authenticated full access" ON gallery_images
  FOR ALL USING (auth.role() = 'authenticated');
```

### 3. Storage Permissions
**Symptom:** Upload fails with permission error
**Fix:** Set storage bucket policies

**SQL to run:**
```sql
-- Allow public read from gallery bucket
CREATE POLICY "Public read gallery" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery');

-- Allow authenticated upload to gallery bucket
CREATE POLICY "Authenticated upload gallery" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- Allow authenticated delete from gallery bucket
CREATE POLICY "Authenticated delete gallery" ON storage.objects
  FOR DELETE USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');
```

## Testing Steps

1. **Upload Test:**
   - Go to http://localhost:8084/admin
   - Click Gallery tab
   - Upload an image
   - Check error message (now shows specific error)

2. **Edit Test:**
   - If upload succeeds, click "Edit Manually"
   - Change title, description, category
   - Click "Done"

3. **Publish Test:**
   - Click "Publish to Gallery"
   - Check if it appears in gallery_images table

4. **Public Gallery Test:**
   - Go to http://localhost:8084/gallery
   - Check if uploaded images appear

## Next: Get Error Message
**Refresh admin page and upload again - tell me the exact error message that appears!**
