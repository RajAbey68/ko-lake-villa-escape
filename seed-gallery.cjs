#!/usr/bin/env node

/**
 * Seed Gallery Images Script
 * Populates the gallery_images table with images from src/assets
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
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

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
  // Villa interior and exterior
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
  // Front garden views
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
  // Koggala sunset
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
  // Stilt fishermen (local culture)
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
  // Additional villa photos (numbered series)
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
  // WhatsApp image
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

async function seedGallery() {
  console.log('🌱 Starting gallery seed...\n');
  
  // Check current count
  const { count: beforeCount, error: countError } = await supabase
    .from('gallery_images')
    .select('*', { count: 'exact', head: true });
  
  if (countError) {
    console.error('❌ Error checking current gallery count:', countError);
    process.exit(1);
  }
  
  console.log(`📊 Current gallery items: ${beforeCount || 0}`);
  
  // Insert images
  console.log(`\n📸 Inserting ${galleryImages.length} images...`);
  
  const { data, error } = await supabase
    .from('gallery_images')
    .insert(galleryImages)
    .select();
  
  if (error) {
    console.error('❌ Error inserting gallery images:', error);
    process.exit(1);
  }
  
  console.log(`✅ Successfully inserted ${data?.length || 0} images`);
  
  // Verify final count
  const { count: afterCount } = await supabase
    .from('gallery_images')
    .select('*', { count: 'exact', head: true });
  
  console.log(`\n📊 Final gallery items: ${afterCount || 0}`);
  
  // Show breakdown
  const { data: stats } = await supabase
    .from('gallery_images')
    .select('is_featured, category');
  
  if (stats) {
    const featured = stats.filter(s => s.is_featured).length;
    const categories = [...new Set(stats.map(s => s.category))];
    
    console.log(`\n📈 Gallery Statistics:`);
    console.log(`   ⭐ Featured: ${featured}`);
    console.log(`   📁 Categories: ${categories.join(', ')}`);
  }
  
  console.log('\n✅ Gallery seed complete!\n');
  console.log('🔗 View gallery at: http://localhost:8080/gallery');
  console.log('🔧 Manage gallery at: http://localhost:8080/gallery-admin\n');
}

seedGallery().catch(console.error);
