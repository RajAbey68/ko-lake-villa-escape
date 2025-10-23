-- Quick fix: Add sample gallery images
-- Run this in Supabase Dashboard → SQL Editor

INSERT INTO gallery_images (
  filename,
  title,
  description,
  category,
  media_type,
  object_path,
  is_featured,
  display_order,
  analysis_status
) VALUES
  ('pool-sunset.jpg', 'Pool at Sunset', 'Beautiful infinity pool overlooking the lake', 'pool', 'image', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200', true, 1, 'completed'),
  ('lake-view.jpg', 'Lake View', 'Serene lake views from the villa', 'exterior', 'image', 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200', true, 2, 'completed'),
  ('living-room.jpg', 'Living Room', 'Spacious and comfortable living area', 'interior', 'image', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', true, 3, 'completed')
ON CONFLICT DO NOTHING;

-- Verify it worked
SELECT id, title, category, media_type FROM gallery_images ORDER BY display_order;
