// Your actual villa images!
import PoolSunset from '@/assets/PoolSunset.jpg';
import KoLakeSunset from '@/assets/KoLakeSunset.jpeg';
import KoggalaSunset from '@/assets/KoggalaSunset 2.jpeg';
import Villa1 from '@/assets/1 (3).jpg';
import Villa2 from '@/assets/2 (5).jpg';
import Villa3 from '@/assets/3 (3).jpg';
import Villa4 from '@/assets/4 (3).jpg';
import Villa6 from '@/assets/6 (1).jpg';
import Villa8 from '@/assets/8 (1).jpg';
import Villa9 from '@/assets/9.jpg';
import FrontGarden0 from '@/assets/KoggalaNinePeaks_front-garden_0 2.jpg';
import FrontGarden1 from '@/assets/KoggalaNinePeaks_front-garden_1.jpg';

export const mockHeroContent = [
  {
    id: '1',
    title: 'Ko Lake Villa Escape',
    subtitle: 'Luxury Villa in Ahangama, Sri Lanka',
    description: 'Experience tranquility at our exclusive lakeside villa',
    background_image: PoolSunset, // YOUR sunset pool photo!
    cta_text: 'Book Your Stay',
    cta_url: '/accommodation',
    is_active: true,
    display_order: 1
  }
];

export const mockRooms = [
  {
    id: '1',
    name: 'Lakeside Master Suite',
    description: 'Spacious master bedroom with panoramic lake views, king-size bed, and private balcony',
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['King Bed', 'Lake View', 'Private Balcony', 'AC', 'Smart TV'],
    images: [Villa1],
    direct_price: 150,
    airbnb_price: 200,
    is_available: true,
    display_order: 1
  },
  {
    id: '2',
    name: 'Garden Villa',
    description: 'Charming garden-facing room with queen bed and modern amenities',
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['Queen Bed', 'Garden View', 'AC', 'WiFi'],
    images: [Villa2],
    direct_price: 120,
    airbnb_price: 160,
    is_available: true,
    display_order: 2
  },
  {
    id: '3',
    name: 'Entire Villa (8 Guests)',
    description: 'Book the entire villa! 4 bedrooms, infinity pool, and exclusive lake access',
    capacity: 8,
    bedrooms: 4,
    bathrooms: 4,
    amenities: ['4 Bedrooms', 'Private Pool', 'Kitchen', 'Lake Access'],
    images: [Villa3],
    direct_price: 500,
    airbnb_price: 700,
    is_available: true,
    display_order: 3
  }
];

export const mockAmenities = [
  { id: '1', title: 'Infinity Pool', description: 'Stunning pool with lake views', icon_name: 'waves', category: 'Property', is_featured: true },
  { id: '2', title: 'Free WiFi', description: 'High-speed internet', icon_name: 'wifi', category: 'Connectivity', is_featured: true },
  { id: '3', title: 'Lake Access', description: 'Direct lake access', icon_name: 'anchor', category: 'Activities', is_featured: true },
  { id: '4', title: 'Air Conditioning', description: 'AC in all rooms', icon_name: 'wind', category: 'Comfort', is_featured: true },
  { id: '5', title: 'Full Kitchen', description: 'Modern kitchen', icon_name: 'utensils-crossed', category: 'Dining', is_featured: false },
  { id: '6', title: 'BBQ Area', description: 'Outdoor BBQ', icon_name: 'flame', category: 'Dining', is_featured: false },
  { id: '7', title: 'Parking', description: 'Free parking', icon_name: 'car', category: 'Convenience', is_featured: false },
  { id: '8', title: 'Garden', description: 'Tropical garden', icon_name: 'trees', category: 'Property', is_featured: false },
];

export const mockGallery = [
  { id: '1', title: 'Pool Sunset', image_url: PoolSunset, category: 'pool', is_featured: true },
  { id: '2', title: 'Ko Lake Sunset', image_url: KoLakeSunset, category: 'exterior', is_featured: true },
  { id: '3', title: 'Villa View 1', image_url: Villa1, category: 'interior', is_featured: true },
  { id: '4', title: 'Villa View 2', image_url: Villa2, category: 'interior', is_featured: true },
  { id: '5', title: 'Villa View 3', image_url: Villa3, category: 'interior', is_featured: true },
  { id: '6', title: 'Villa View 4', image_url: Villa4, category: 'interior', is_featured: false },
  { id: '7', title: 'Villa View 6', image_url: Villa6, category: 'interior', is_featured: false },
  { id: '8', title: 'Villa View 8', image_url: Villa8, category: 'exterior', is_featured: false },
  { id: '9', title: 'Villa View 9', image_url: Villa9, category: 'exterior', is_featured: false },
  { id: '10', title: 'Front Garden', image_url: FrontGarden0, category: 'garden', is_featured: false },
  { id: '11', title: 'Garden View', image_url: FrontGarden1, category: 'garden', is_featured: false },
  { id: '12', title: 'Koggala Sunset', image_url: KoggalaSunset, category: 'exterior', is_featured: false },
];

export const mockLocation = {
  id: '1',
  title: 'Ko Lake Villa',
  description: 'Located in peaceful Ahangama, just minutes from pristine beaches',
  address: 'Lake Road, Ahangama',
  city: 'Ahangama',
  country: 'Sri Lanka',
  latitude: 5.9750,
  longitude: 80.3686,
  google_maps_url: 'https://maps.google.com/?q=Ahangama,+Sri+Lanka',
  nearby_attractions: [
    'Kabalana Beach - 5 min drive',
    'Ahangama Beach - 10 min walk',
    'Galle Fort - 30 min drive'
  ]
};
