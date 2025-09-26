-- Ko Lake Villa Database Schema
-- Create room types table
CREATE TABLE public.room_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  max_guests INTEGER DEFAULT 2,
  amenities TEXT[],
  images TEXT[],
  direct_price NUMERIC,
  airbnb_price NUMERIC,
  airbnb_url TEXT,
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gallery table
CREATE TABLE public.gallery (
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

-- Create booking requests table
CREATE TABLE public.booking_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_type_id UUID REFERENCES public.room_types(id),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests_count INTEGER NOT NULL DEFAULT 1,
  nights INTEGER,
  total_amount NUMERIC,
  savings_amount NUMERIC,
  special_requests TEXT,
  booking_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact submissions table
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create confirmed bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests_count INTEGER NOT NULL DEFAULT 1,
  total_amount NUMERIC,
  special_requests TEXT,
  guesty_booking_id TEXT,
  booking_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create menu items table
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price NUMERIC,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pricing updates table
CREATE TABLE public.pricing_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  update_date DATE NOT NULL,
  effective_date DATE NOT NULL,
  total_rooms_updated INTEGER DEFAULT 0,
  successful_extractions INTEGER DEFAULT 0,
  failed_extractions INTEGER DEFAULT 0,
  source TEXT DEFAULT 'automated',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_updates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public data
CREATE POLICY "Room types are viewable by everyone" ON public.room_types FOR SELECT USING (true);
CREATE POLICY "Gallery items are viewable by everyone" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Menu items are viewable by everyone" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Pricing updates are viewable by everyone" ON public.pricing_updates FOR SELECT USING (true);

-- Create RLS policies for admin management
CREATE POLICY "Room types can be managed by admins" ON public.room_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Gallery items can be managed by admins" ON public.gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Menu items can be managed by admins" ON public.menu_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Pricing updates can be managed by admins" ON public.pricing_updates FOR ALL USING (true) WITH CHECK (true);

-- Create RLS policies for public submissions
CREATE POLICY "Anyone can create booking requests" ON public.booking_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can submit contact forms" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);

-- Create RLS policies for admin viewing
CREATE POLICY "Admins can view all booking requests" ON public.booking_requests FOR SELECT USING (true);
CREATE POLICY "Admins can update booking requests" ON public.booking_requests FOR UPDATE USING (true);
CREATE POLICY "Admins can view contact submissions" ON public.contact_submissions FOR SELECT USING (true);
CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Admins can update bookings" ON public.bookings FOR UPDATE USING (true);

-- Create storage buckets for media
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery-images', 'gallery-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery-videos', 'gallery-videos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('menu-images', 'menu-images', true);

-- Create storage policies for gallery images
CREATE POLICY "Gallery images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'gallery-images');
CREATE POLICY "Gallery images can be uploaded by admins" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery-images');
CREATE POLICY "Gallery images can be updated by admins" ON storage.objects FOR UPDATE USING (bucket_id = 'gallery-images');
CREATE POLICY "Gallery images can be deleted by admins" ON storage.objects FOR DELETE USING (bucket_id = 'gallery-images');

-- Create storage policies for gallery videos
CREATE POLICY "Gallery videos are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'gallery-videos');
CREATE POLICY "Gallery videos can be uploaded by admins" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery-videos');
CREATE POLICY "Gallery videos can be updated by admins" ON storage.objects FOR UPDATE USING (bucket_id = 'gallery-videos');
CREATE POLICY "Gallery videos can be deleted by admins" ON storage.objects FOR DELETE USING (bucket_id = 'gallery-videos');

-- Create storage policies for menu images
CREATE POLICY "Menu images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'menu-images');
CREATE POLICY "Menu images can be uploaded by admins" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'menu-images');
CREATE POLICY "Menu images can be updated by admins" ON storage.objects FOR UPDATE USING (bucket_id = 'menu-images');
CREATE POLICY "Menu images can be deleted by admins" ON storage.objects FOR DELETE USING (bucket_id = 'menu-images');

-- Create trigger for updating timestamps
CREATE TRIGGER update_room_types_updated_at BEFORE UPDATE ON public.room_types FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON public.gallery FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_booking_requests_updated_at BEFORE UPDATE ON public.booking_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample room types
INSERT INTO public.room_types (name, description, bedrooms, bathrooms, max_guests, amenities, direct_price, airbnb_price, display_order) VALUES
('Lakeside Villa', 'Luxury villa with panoramic lake views and private terrace', 3, 2, 6, ARRAY['Private Terrace', 'Lake View', 'Air Conditioning', 'WiFi', 'Kitchen'], 299.00, 349.00, 1),
('Garden Suite', 'Elegant suite surrounded by tropical gardens', 2, 1, 4, ARRAY['Garden View', 'Air Conditioning', 'WiFi', 'Mini Bar'], 199.00, 249.00, 2),
('Poolside Bungalow', 'Cozy bungalow with direct pool access', 1, 1, 2, ARRAY['Pool Access', 'Air Conditioning', 'WiFi', 'Kitchenette'], 149.00, 189.00, 3);