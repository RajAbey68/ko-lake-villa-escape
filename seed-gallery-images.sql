-- Seed Gallery Images
-- This script populates the gallery_images table with images from src/assets

-- Clear existing gallery items (optional - comment out if you want to keep existing)
-- DELETE FROM gallery_images;

-- Insert villa images
INSERT INTO gallery_images (title, description, object_path, media_type, is_featured, display_order, category, filename)
VALUES
  -- Featured pool and sunset images
  ('Ko Lake Pool at Sunset', 'Beautiful pool area with palm trees and tropical greenery at sunset', '/src/assets/PoolSunset.jpg', 'image', true, 1, 'pool', 'PoolSunset.jpg'),
  ('Ko Lake Sunset View', 'Stunning sunset view over Ko Lake', '/src/assets/KoLakeSunset.jpeg', 'image', true, 2, 'views', 'KoLakeSunset.jpeg'),
  
  -- Villa interior and exterior
  ('Villa Dining Area', 'Elegant dining space with lake views', '/src/assets/hero-villa-dining.jpg', 'image', true, 3, 'dining', 'hero-villa-dining.jpg'),
  ('Villa Interior', 'Luxurious interior design and furnishings', '/src/assets/hero-villa-interior.jpg', 'image', true, 4, 'interior', 'hero-villa-interior.jpg'),
  ('Lake View from Villa', 'Panoramic lake view from the villa', '/src/assets/hero-villa-lake-view.jpg', 'image', true, 5, 'views', 'hero-villa-lake-view.jpg'),
  ('Villa Pool Area', 'Private pool with tropical surroundings', '/src/assets/hero-villa-pool.jpg', 'image', true, 6, 'pool', 'hero-villa-pool.jpg'),
  
  -- Front garden views
  ('Front Garden View 1', 'Lush tropical front garden with nine peaks view', '/src/assets/KoggalaNinePeaks_front-garden_1.jpg', 'image', false, 7, 'garden', 'KoggalaNinePeaks_front-garden_1.jpg'),
  ('Front Garden View 2', 'Beautiful landscaped front garden area', '/src/assets/KoggalaNinePeaks_front-garden_0 2.jpg', 'image', false, 8, 'garden', 'KoggalaNinePeaks_front-garden_0 2.jpg'),
  
  -- Koggala sunset
  ('Koggala Sunset', 'Breathtaking sunset over Koggala', '/src/assets/KoggalaSunset 2.jpeg', 'image', false, 9, 'views', 'KoggalaSunset 2.jpeg'),
  
  -- Stilt fishermen (local culture)
  ('Stilt Fishermen 1', 'Traditional Sri Lankan stilt fishing', '/src/assets/Stilt Fishers Raj IP.jpeg', 'image', false, 10, 'culture', 'Stilt Fishers Raj IP.jpeg'),
  ('Stilt Fishermen 2', 'Iconic stilt fishing at sunset', '/src/assets/Stilt Fishers 2 Raj IP.jpeg', 'image', false, 11, 'culture', 'Stilt Fishers 2 Raj IP.jpeg'),
  ('Stilt Fishermen 3', 'Traditional fishing methods of Sri Lanka', '/src/assets/Stilt Fishers 3 Raj IP.jpeg', 'image', false, 12, 'culture', 'Stilt Fishers 3 Raj IP.jpeg'),
  
  -- Additional villa photos (numbered series)
  ('Villa Exterior View 1', 'Beautiful villa exterior and surroundings', '/src/assets/1 (3).jpg', 'image', false, 13, 'exterior', '1 (3).jpg'),
  ('Villa Exterior View 2', 'Villa architecture and landscape', '/src/assets/2 (5).jpg', 'image', false, 14, 'exterior', '2 (5).jpg'),
  ('Villa Exterior View 3', 'Stunning villa exterior design', '/src/assets/3 (3).jpg', 'image', false, 15, 'exterior', '3 (3).jpg'),
  ('Villa Exterior View 4', 'Villa with tropical garden', '/src/assets/4 (3).jpg', 'image', false, 16, 'exterior', '4 (3).jpg'),
  ('Villa Exterior View 5', 'Villa grounds and facilities', '/src/assets/6 (1).jpg', 'image', false, 17, 'exterior', '6 (1).jpg'),
  ('Villa Exterior View 6', 'Villa landscape and views', '/src/assets/8 (1).jpg', 'image', false, 18, 'exterior', '8 (1).jpg'),
  ('Villa Exterior View 7', 'Complete villa property view', '/src/assets/9.jpg', 'image', false, 19, 'exterior', '9.jpg'),
  
  -- WhatsApp image
  ('Ko Lake Villa', 'Ko Lake Villa property overview', '/src/assets/WhatsApp Image 2025-02-12 at 13.13.34.jpeg', 'image', false, 20, 'villa', 'WhatsApp Image 2025-02-12 at 13.13.34.jpeg')
ON CONFLICT (id) DO NOTHING;

-- Verify the insert
SELECT COUNT(*) as total_images, 
       COUNT(CASE WHEN is_featured THEN 1 END) as featured_images,
       COUNT(CASE WHEN media_type = 'image' THEN 1 END) as images,
       COUNT(CASE WHEN media_type = 'video' THEN 1 END) as videos
FROM gallery_images;

-- Show all gallery items
SELECT id, title, category, is_featured, display_order, media_type 
FROM gallery_images 
ORDER BY display_order;
