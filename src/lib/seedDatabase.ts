import { supabase } from '@/integrations/supabase/client';

export async function seedDatabase() {
  const results = {
    success: false,
    errors: [] as string[],
    inserted: {
      hero: 0,
      rooms: 0,
      amenities: 0,
      location: 0,
      gallery: 0
    }
  };

  try {
    // 1. HERO CONTENT
    const heroData = [
      {
        title: 'Ko Lake Villa Escape',
        subtitle: 'Luxury Villa in Ahangama, Sri Lanka',
        description: 'Experience tranquility at our exclusive lakeside villa. Wake up to stunning views, relax by the infinity pool, and immerse yourself in the natural beauty of Sri Lanka.',
        cta_text: 'Book Your Stay',
        cta_url: '/accommodation',
        background_image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920',
        is_active: true,
        display_order: 1
      },
      {
        title: 'Your Private Paradise',
        subtitle: 'Serene Lakeside Living',
        description: 'Discover the perfect blend of luxury and nature. Our villa offers modern amenities, traditional Sri Lankan hospitality, and breathtaking lake views.',
        cta_text: 'Explore Rooms',
        cta_url: '/accommodation',
        background_image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920',
        is_active: false,
        display_order: 2
      }
    ];

    const { data: heroInserted, error: heroError } = await supabase
      .from('hero_content')
      .upsert(heroData, { onConflict: 'id' })
      .select();

    if (heroError) {
      results.errors.push(`Hero: ${heroError.message}`);
    } else {
      results.inserted.hero = heroInserted?.length || 0;
    }

    // 2. ROOM TYPES
    const roomData = [
      {
        name: 'Lakeside Master Suite',
        description: 'Spacious master bedroom with panoramic lake views, king-size bed, ensuite bathroom, and private balcony. Perfect for couples seeking luxury and tranquility.',
        capacity: 2,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ['King Bed', 'Lake View', 'Private Balcony', 'AC', 'Ensuite Bathroom', 'Smart TV'],
        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200'],
        direct_price: 150,
        airbnb_price: 200,
        airbnb_url: 'https://www.airbnb.com/rooms/kolakevilla',
        is_available: true,
        display_order: 1
      },
      {
        name: 'Garden Villa',
        description: 'Charming garden-facing room with queen bed, modern amenities, and access to shared spaces. Ideal for solo travelers or couples.',
        capacity: 2,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ['Queen Bed', 'Garden View', 'AC', 'Shared Pool', 'WiFi', 'Workspace'],
        images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200'],
        direct_price: 120,
        airbnb_price: 160,
        airbnb_url: 'https://www.airbnb.com/rooms/kolakevilla',
        is_available: true,
        display_order: 2
      },
      {
        name: 'Entire Villa (8 Guests)',
        description: 'Book the entire villa for your group! 4 bedrooms, 4 bathrooms, full kitchen, infinity pool, and exclusive lake access. Perfect for families or groups.',
        capacity: 8,
        bedrooms: 4,
        bathrooms: 4,
        amenities: ['4 Bedrooms', 'Private Pool', 'Full Kitchen', 'Lake Access', 'Living Room', 'Dining Area', 'BBQ', 'Parking'],
        images: ['https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1200'],
        direct_price: 500,
        airbnb_price: 700,
        airbnb_url: 'https://www.airbnb.com/rooms/kolakevilla',
        is_available: true,
        display_order: 3
      }
    ];

    const { data: roomsInserted, error: roomsError } = await supabase
      .from('room_types')
      .upsert(roomData, { onConflict: 'id' })
      .select();

    if (roomsError) {
      results.errors.push(`Rooms: ${roomsError.message}`);
    } else {
      results.inserted.rooms = roomsInserted?.length || 0;
    }

    // 3. AMENITIES
    const amenitiesData = [
      { title: 'Infinity Pool', description: 'Stunning infinity pool overlooking the lake', icon_name: 'waves', category: 'Property', is_featured: true, display_order: 1 },
      { title: 'Free WiFi', description: 'High-speed internet throughout', icon_name: 'wifi', category: 'Connectivity', is_featured: true, display_order: 2 },
      { title: 'Lake Access', description: 'Direct access to the tranquil lake', icon_name: 'anchor', category: 'Activities', is_featured: true, display_order: 3 },
      { title: 'Air Conditioning', description: 'Modern AC in all bedrooms', icon_name: 'wind', category: 'Comfort', is_featured: true, display_order: 4 },
      { title: 'Full Kitchen', description: 'Modern kitchen with all appliances', icon_name: 'utensils-crossed', category: 'Dining', is_featured: false, display_order: 5 },
      { title: 'BBQ Area', description: 'Outdoor barbecue area', icon_name: 'flame', category: 'Dining', is_featured: false, display_order: 6 },
      { title: 'Parking', description: 'Free secure parking', icon_name: 'car', category: 'Convenience', is_featured: false, display_order: 7 },
      { title: 'Garden', description: 'Beautiful tropical garden', icon_name: 'trees', category: 'Property', is_featured: false, display_order: 8 },
      { title: 'Housekeeping', description: 'Daily housekeeping service', icon_name: 'sparkles', category: 'Services', is_featured: true, display_order: 9 },
      { title: 'Smart TV', description: 'Smart TVs with streaming', icon_name: 'tv', category: 'Entertainment', is_featured: false, display_order: 10 }
    ];

    const { data: amenitiesInserted, error: amenitiesError } = await supabase
      .from('amenities')
      .upsert(amenitiesData, { onConflict: 'id' })
      .select();

    if (amenitiesError) {
      results.errors.push(`Amenities: ${amenitiesError.message}`);
    } else {
      results.inserted.amenities = amenitiesInserted?.length || 0;
    }

    // 4. LOCATION INFO
    const locationData = {
      title: 'Ko Lake Villa',
      description: 'Located in the peaceful town of Ahangama, our villa offers the perfect escape. Just minutes from pristine beaches and local surf spots.',
      address: 'Lake Road',
      city: 'Ahangama',
      state: 'Southern Province',
      country: 'Sri Lanka',
      postal_code: '80650',
      latitude: 5.9750,
      longitude: 80.3686,
      google_maps_url: 'https://maps.google.com/?q=Ahangama,+Sri+Lanka',
      directions: 'From Colombo: Take Southern Expressway to Galle, then coastal road to Ahangama (approx 2.5 hours).',
      nearby_attractions: [
        'Kabalana Beach - 5 min drive',
        'Ahangama Beach - 10 min walk',
        'Midigama Surf Spots - 5 min drive',
        'Galle Fort - 30 min drive',
        'Koggala Lake - 15 min drive',
        'Local Markets - 5 min walk'
      ],
      is_active: true
    };

    const { data: locationInserted, error: locationError } = await supabase
      .from('location_info')
      .upsert([locationData], { onConflict: 'id' })
      .select();

    if (locationError) {
      results.errors.push(`Location: ${locationError.message}`);
    } else {
      results.inserted.location = locationInserted?.length || 0;
    }

    // 5. GALLERY IMAGES (using correct schema fields)
    const galleryData = [
      { 
        title: 'Lake View at Sunset', 
        description: 'Breathtaking sunset views', 
        object_path: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200',
        image_url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200', 
        thumbnail_url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400', 
        media_type: 'image',
        category: 'exterior', 
        tags: ['lake', 'sunset'], 
        filename: 'lake-sunset.jpg',
        display_order: 1, 
        is_featured: true 
      },
      { 
        title: 'Infinity Pool', 
        description: 'Relax by our stunning pool', 
        object_path: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200',
        image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200', 
        thumbnail_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400', 
        media_type: 'image',
        category: 'pool', 
        tags: ['pool'], 
        filename: 'infinity-pool.jpg',
        display_order: 2, 
        is_featured: true 
      },
      { 
        title: 'Living Room', 
        description: 'Spacious living area', 
        object_path: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
        image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', 
        thumbnail_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400', 
        media_type: 'image',
        category: 'interior', 
        tags: ['living room'], 
        filename: 'living-room.jpg',
        display_order: 3, 
        is_featured: true 
      },
      { 
        title: 'Dining Area', 
        description: 'Elegant dining space', 
        object_path: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
        image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', 
        thumbnail_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', 
        media_type: 'image',
        category: 'dining', 
        tags: ['dining'], 
        filename: 'dining-area.jpg',
        display_order: 4, 
        is_featured: true 
      },
      { 
        title: 'Master Bedroom', 
        description: 'Luxurious suite', 
        object_path: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200',
        image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200', 
        thumbnail_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400', 
        media_type: 'image',
        category: 'bedroom', 
        tags: ['bedroom'], 
        filename: 'master-bedroom.jpg',
        display_order: 5, 
        is_featured: false 
      },
      { 
        title: 'Garden View', 
        description: 'Tropical paradise', 
        object_path: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1200',
        image_url: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1200', 
        thumbnail_url: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=400', 
        media_type: 'image',
        category: 'exterior', 
        tags: ['garden'], 
        filename: 'garden-view.jpg',
        display_order: 6, 
        is_featured: false 
      }
    ];

    const { data: galleryInserted, error: galleryError } = await supabase
      .from('gallery_images')
      .upsert(galleryData, { onConflict: 'id' })
      .select();

    if (galleryError) {
      results.errors.push(`Gallery: ${galleryError.message}`);
    } else {
      results.inserted.gallery = galleryInserted?.length || 0;
    }

    // Success!
    results.success = results.errors.length === 0;
    return results;

  } catch (error: any) {
    results.errors.push(error.message);
    return results;
  }
}
