import { 
  Wifi, 
  Coffee, 
  Car, 
  Waves, 
  Utensils, 
  Dumbbell, 
  Heart,
  Wind,
  TreePine,
  MapPin,
  Phone
} from "lucide-react";

interface AmenityCategory {
  title: string;
  description: string;
  amenities: Array<{
    icon: React.ComponentType<{ className?: string }>;
    name: string;
    description: string;
  }>;
}

export const useAmenityCategories = () => {
  const amenityCategories: AmenityCategory[] = [
    {
      title: "Ko Lake Facilities",
      description: "Premium amenities for the perfect getaway",
      amenities: [
        { icon: Waves, name: "Private Lake Access", description: "Direct access to pristine lake waters" },
        { icon: Heart, name: "Wellness Spa", description: "Full-service spa and massage treatments" },
        { icon: Dumbbell, name: "Fitness Center", description: "Modern equipment with lake views" },
        { icon: Utensils, name: "Fine Dining", description: "Gourmet restaurant with local cuisine" }
      ]
    },
    {
      title: "In-Room Comfort",
      description: "Everything you need for a luxurious stay",
      amenities: [
        { icon: Wifi, name: "High-Speed WiFi", description: "Complimentary fiber internet throughout" },
        { icon: Coffee, name: "Premium Coffee Bar", description: "Fresh coffee and tea selection" },
        { icon: Wind, name: "Climate Control", description: "Individual room temperature control" },
        { icon: Phone, name: "24/7 Concierge", description: "Round-the-clock guest services" }
      ]
    },
    {
      title: "Outdoor Activities",
      description: "Adventure and relaxation in nature",
      amenities: [
        { icon: TreePine, name: "Nature Trails", description: "Scenic lake and forest trail access" },
        { icon: Waves, name: "Water Sports", description: "Kayaking, paddleboarding, fishing" },
        { icon: TreePine, name: "Nature Walks", description: "Guided tours of local flora and fauna" },
        { icon: Car, name: "Free Parking", description: "Secure parking with electric charging" }
      ]
    }
  ];

  const specialFeatures = [
    { icon: MapPin, label: "Exclusive lakefront location" },
    { icon: TreePine, label: "Sustainable eco-friendly practices" },
    { icon: Waves, label: "Direct lake access & water activities" }
  ];

  return { amenityCategories, specialFeatures };
};