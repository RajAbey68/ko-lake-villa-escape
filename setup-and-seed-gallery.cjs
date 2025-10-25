#!/usr/bin/env node

/**
 * Setup and Seed Gallery
 * 1. Creates gallery_images table and storage bucket
 * 2. Seeds with images from src/assets
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '.env.local');
let supabaseUrl, supabaseKey;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  lines.forEach(line => {
    const match = line.match(/^VITE_SUPABASE_URL=(.+)$/);
    if (match) supabaseUrl = match[1].trim();
    
    const keyMatch = line.match(/^VITE_SUPABASE_ANON_KEY=(.+)$/);
    if (keyMatch) supabaseKey = keyMatch[1].trim();
  });
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  console.error('\n📝 Please ensure .env.local contains:');
  console.error('   VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.error('   VITE_SUPABASE_ANON_KEY=your-anon-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Gallery setup SQL
const setupSQL = `
-- Create gallery_images table
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

-- Enable RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "Anyone can insert gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "Anyone can update gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "Anyone can delete gallery" ON public.gallery_images;

-- Create policies
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

-- Create update trigger
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
`;

const galleryImages = [
  // Featured pool and sunset images
  {
    title: 'Ko Lake Pool at Sunset',
    description: 'Beautiful pool area with palm trees and tropical greenery at sunset',
    object_path: '/src/assets/PoolSunset.jpg',
    media_type: 'image',
    is_featured: true,
    display_order: 1,
    category: 'pool',
    filename: 'PoolSunset.jpg'
  },
  {
    title: 'Ko Lake Sunset View',
    description: 'Stunning sunset view over Ko Lake',
    object_path: '/src/assets/KoLakeSunset.jpeg',
    media_type: 'image',
    is_featured: true,
    display_order: 2,
    category: 'views',
    filename: 'KoLakeSunset.jpeg'
  },
  {
    title: 'Villa Dining Area',
    description: 'Elegant dining space with lake views',
    object_path: '/src/assets/hero-villa-dining.jpg',
    media_type: 'image',
    is_featured: true,
    display_order: 3,
    category: 'dining',
    filename: 'hero-villa-dining.jpg'
  },
  {
    title: 'Villa Interior',
    description: 'Luxurious interior design and furnishings',
    object_path: '/src/assets/hero-villa-interior.jpg',
    media_type: 'image',
    is_featured: true,
    display_order: 4,
    category: 'interior',
    filename: 'hero-villa-interior.jpg'
  },
  {
    title: 'Lake View from Villa',
    description: 'Panoramic lake view from the villa',
    object_path: '/src/assets/hero-villa-lake-view.jpg',
    media_type: 'image',
    is_featured: true,
    display_order: 5,
    category: 'views',
    filename: 'hero-villa-lake-view.jpg'
  },
  {
    title: 'Villa Pool Area',
    description: 'Private pool with tropical surroundings',
    object_path: '/src/assets/hero-villa-pool.jpg',
    media_type: 'image',
    is_featured: true,
    display_order: 6,
    category: 'pool',
    filename: 'hero-villa-pool.jpg'
  },
  {
    title: 'Front Garden View 1',
    description: 'Lush tropical front garden with nine peaks view',
    object_path: '/src/assets/KoggalaNinePeaks_front-garden_1.jpg',
    media_type: 'image',
    is_featured: false,
    display_order: 7,
    category: 'garden',
    filename: 'KoggalaNinePeaks_front-garden_1.jpg'
  },
  {
    title: 'Front Garden View 2',
    description: 'Beautiful landscaped front garden area',
    object_path: '/src/assets/KoggalaNinePeaks_front-garden_0 2.jpg',
    media_type: 'image',
    is_featured: false,
    display_order: 8,
    category: 'garden',
    filename: 'KoggalaNinePeaks_front-garden_0 2.jpg'
  },
  {
    title: 'Koggala Sunset',
    description: 'Breathtaking sunset over Koggala',
    object_path: '/src/assets/KoggalaSunset 2.jpeg',
    media_type: 'image',
    is_featured: false,
    display_order: 9,
    category: 'views',
    filename: 'KoggalaSunset 2.jpeg'
  },
  {
    title: 'Stilt Fishermen 1',
    description: 'Traditional Sri Lankan stilt fishing',
    object_path: '/src/assets/Stilt Fishers Raj IP.jpeg',
    media_type: 'image',
    is_featured: false,
    display_order: 10,
    category: 'culture',
    filename: 'Stilt Fishers Raj IP.jpeg'
  },
  {
    title: 'Stilt Fishermen 2',
    description: 'Iconic stilt fishing at sunset',
    object_path: '/src/assets/Stilt Fishers 2 Raj IP.jpeg',
    media_type: 'image',
    is_featured: false,
    display_order: 11,
    category: 'culture',
    filename: 'Stilt Fishers 2 Raj IP.jpeg'
  },
  {
    title: 'Stilt Fishermen 3',
    description: 'Traditional fishing methods of Sri Lanka',
    object_path: '/src/assets/Stilt Fishers 3 Raj IP.jpeg',
    media_type: 'image',
    is_featured: false,
    display_order: 12,
    category: 'culture',
    filename: 'Stilt Fishers 3 Raj IP.jpeg'
  },
  {
    title: 'Villa Exterior View 1',
    description: 'Beautiful villa exterior and surroundings',
    object_path: '/src/assets/1 (3).jpg',
    media_type: 'image',
    is_featured: false,
    display_order: 13,
    category: 'exterior',
    filename: '1 (3).jpg'
  },
  {
    title: 'Villa Exterior View 2',
    description: 'Villa architecture and landscape',
    object_path: '/src/assets/2 (5).jpg',
    media_type: 'image',
    is_featured: false,
    display_order: 14,
    category: 'exterior',
    filename: '2 (5).jpg'
  },
  {
    title: 'Villa Exterior View 3',
    description: 'Stunning villa exterior design',
    object_path: '/src/assets/3 (3).jpg',
    media_type: 'image',
    is_featured: false,
    display_order: 15,
    category: 'exterior',
    filename: '3 (3).jpg'
  },
  {
    title: 'Villa Exterior View 4',
    description: 'Villa with tropical garden',
    object_path: '/src/assets/4 (3).jpg',
    media_type: 'image',
    is_featured: false,
    display_order: 16,
    category: 'exterior',
    filename: '4 (3).jpg'
  },
  {
    title: 'Villa Exterior View 5',
    description: 'Villa grounds and facilities',
    object_path: '/src/assets/6 (1).jpg',
    media_type: 'image',
    is_featured: false,
    display_order: 17,
    category: 'exterior',
    filename: '6 (1).jpg'
  },
  {
    title: 'Villa Exterior View 6',
    description: 'Villa landscape and views',
    object_path: '/src/assets/8 (1).jpg',
    media_type: 'image',
    is_featured: false,
    display_order: 18,
    category: 'exterior',
    filename: '8 (1).jpg'
  },
  {
    title: 'Villa Exterior View 7',
    description: 'Complete villa property view',
    object_path: '/src/assets/9.jpg',
    media_type: 'image',
    is_featured: false,
    display_order: 19,
    category: 'exterior',
    filename: '9.jpg'
  },
  {
    title: 'Ko Lake Villa',
    description: 'Ko Lake Villa property overview',
    object_path: '/src/assets/WhatsApp Image 2025-02-12 at 13.13.34.jpeg',
    media_type: 'image',
    is_featured: false,
    display_order: 20,
    category: 'villa',
    filename: 'WhatsApp Image 2025-02-12 at 13.13.34.jpeg'
  }
];

async function setupAndSeedGallery() {
  console.log('🚀 Ko Lake Villa - Gallery Setup & Seed\n');
  console.log('=' .repeat(60));
  
  // Step 1: Check if table exists by trying to query it
  console.log('\n📋 Step 1: Checking if gallery_images table exists...');
  const { error: checkError } = await supabase
    .from('gallery_images')
    .select('count', { count: 'exact', head: true });
  
  if (checkError) {
    console.log('❌ Table does not exist yet');
    console.log('\n📝 ACTION REQUIRED:');
    console.log('   1. Open Supabase Dashboard → SQL Editor');
    console.log('   2. Copy and run: FRESH_GALLERY_SETUP.sql');
    console.log('   3. Run this script again\n');
    process.exit(1);
  }
  
  console.log('✅ Table exists and is ready');
  
  // Step 2: Check current count
  console.log('\n📊 Step 2: Checking current gallery...');
  const { count: beforeCount } = await supabase
    .from('gallery_images')
    .select('*', { count: 'exact', head: true });
  
  console.log(`   Current items: ${beforeCount || 0}`);
  
  // Step 3: Insert images
  console.log(`\n📸 Step 3: Inserting ${galleryImages.length} images...`);
  
  const { data, error } = await supabase
    .from('gallery_images')
    .insert(galleryImages)
    .select();
  
  if (error) {
    console.error('❌ Error inserting images:', error.message);
    process.exit(1);
  }
  
  console.log(`✅ Successfully inserted ${data?.length || 0} images`);
  
  // Step 4: Verify
  console.log('\n📊 Step 4: Verifying gallery...');
  const { count: afterCount } = await supabase
    .from('gallery_images')
    .select('*', { count: 'exact', head: true });
  
  const { data: stats } = await supabase
    .from('gallery_images')
    .select('is_featured, category');
  
  if (stats) {
    const featured = stats.filter(s => s.is_featured).length;
    const categories = [...new Set(stats.map(s => s.category))];
    
    console.log(`   Total items: ${afterCount || 0}`);
    console.log(`   Featured: ${featured}`);
    console.log(`   Categories: ${categories.join(', ')}`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ GALLERY SETUP COMPLETE!\n');
  console.log('🔗 View gallery: http://localhost:8080/gallery');
  console.log('🔧 Manage: http://localhost:8080/gallery-admin\n');
}

setupAndSeedGallery().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
