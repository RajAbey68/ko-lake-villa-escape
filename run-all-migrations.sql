-- Combined migrations for Ko Lake Villa
-- Run this in Supabase Dashboard → SQL Editor

-- 1. Create gallery storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery',
  'gallery',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Create all tables
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

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

-- 3. Enable RLS
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY IF NOT EXISTS "Public can view gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Authenticated can manage gallery" ON public.gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Authenticated can view submissions" ON public.contact_submissions FOR SELECT TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Anyone can submit contact" ON public.contact_submissions FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Public can view active contacts" ON public.contacts FOR SELECT USING (is_active = true);
CREATE POLICY IF NOT EXISTS "Authenticated can manage contacts" ON public.contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. Storage policies
CREATE POLICY IF NOT EXISTS "Authenticated users can upload to gallery"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'gallery');

CREATE POLICY IF NOT EXISTS "Public can view gallery files"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'gallery');

CREATE POLICY IF NOT EXISTS "Authenticated users can delete from gallery"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'gallery');

-- 6. Insert default contacts
INSERT INTO public.contacts (role, title, name, phone, whatsapp, languages, location, description, icon, display_order) VALUES
  ('manager', 'Group Manager', 'Manager', '+94711730345', '+94711730345', ARRAY['English'], 'Ahangama based', 'Available 24/7', '📱', 1),
  ('team_leader', 'Villa Team Leader', 'Team Leader', '+94711730345', '+94711730345', ARRAY['Sinhala', 'English'], 'Villa-based', 'On-site assistance', '👨‍💼', 2),
  ('owner', 'Owner Contact', 'Owner', '+94711730345', '+94711730345', ARRAY['English'], 'Remote', 'Direct line', '👤', 3)
ON CONFLICT DO NOTHING;
