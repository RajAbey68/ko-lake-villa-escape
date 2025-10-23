// Quick database seeder - Run with: node seed-now.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://zctpyveoakvbrrjmviqg.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdHB5dmVvYWt2YnJyam12aXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcxMDU5OTEsImV4cCI6MjA0MjY4MTk5MX0.nEWlQkLlPKXPPFOQJwuWJJTXwPJGqRzJPPkOSLjCLZA';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    // 1. HERO CONTENT
    console.log('📸 Seeding hero content...');
    const { error: heroError } = await supabase.from('hero_content').upsert([
      {
        title: 'Ko Lake Villa Escape',
        subtitle: 'Luxury Villa in Ahangama, Sri Lanka',
        description: 'Experience tranquility at our exclusive lakeside villa.',
        cta_text: 'Book Your Stay',
        cta_url: '/accommodation',
        background_image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920',
        is_active: true,
        display_order: 1
      }
    ]);
    if (heroError) throw heroError;
    console.log('✅ Hero content added\n');

    // 2. AMENITIES
    console.log('✨ Seeding amenities...');
    const { error: amenitiesError } = await supabase.from('amenities').upsert([
      { title: 'Infinity Pool', description: 'Stunning pool', icon_name: 'waves', category: 'Property', is_featured: true, display_order: 1 },
      { title: 'Free WiFi', description: 'High-speed internet', icon_name: 'wifi', category: 'Connectivity', is_featured: true, display_order: 2 },
      { title: 'Lake Access', description: 'Direct lake access', icon_name: 'anchor', category: 'Activities', is_featured: true, display_order: 3 },
      { title: 'Air Conditioning', description: 'AC in all rooms', icon_name: 'wind', category: 'Comfort', is_featured: true, display_order: 4 }
    ]);
    if (amenitiesError) throw amenitiesError;
    console.log('✅ Amenities added\n');

    // 3. GALLERY IMAGES
    console.log('🖼️  Seeding gallery...');
    const { error: galleryError } = await supabase.from('gallery_images').upsert([
      {
        title: 'Lake View',
        description: 'Sunset views',
        object_path: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200',
        image_url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200',
        media_type: 'image',
        category: 'exterior',
        filename: 'lake.jpg',
        display_order: 1,
        is_featured: true
      },
      {
        title: 'Infinity Pool',
        description: 'Relax by the pool',
        object_path: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200',
        image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200',
        media_type: 'image',
        category: 'pool',
        filename: 'pool.jpg',
        display_order: 2,
        is_featured: true
      }
    ]);
    if (galleryError) throw galleryError;
    console.log('✅ Gallery images added\n');

    // 4. CONTACTS
    console.log('📞 Seeding contacts...');
    const { error: contactsError } = await supabase.from('contacts').upsert([
      {
        role: 'manager',
        title: 'Group Manager',
        name: 'Manager',
        phone: '+94711730345',
        whatsapp: '+94711730345',
        languages: ['English'],
        location: 'Ahangama',
        description: 'Available 24/7',
        icon: '📱',
        display_order: 1,
        is_active: true
      }
    ]);
    if (contactsError) throw contactsError;
    console.log('✅ Contacts added\n');

    console.log('🎉 DATABASE SEEDED SUCCESSFULLY!\n');
    console.log('Next steps:');
    console.log('1. Refresh your browser');
    console.log('2. Check /gallery - should show 2 images');
    console.log('3. Check /contact - should show contact card');
    console.log('4. Homepage should load without errors\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seed();
