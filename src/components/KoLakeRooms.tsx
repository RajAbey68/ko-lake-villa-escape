import { useAccommodations } from "@/hooks/useAccommodations";
import { AccommodationCard } from "@/components/micro/AccommodationCard";
import { AmenityBadge } from "@/components/micro/AmenityBadge";
import { SectionHeader } from "@/components/micro/SectionHeader";
import { Wifi, Coffee, Car, Waves } from "lucide-react";

interface KoLakeRoomsProps {
  onBookingClick?: () => void;
}

export function KoLakeRooms({ onBookingClick }: KoLakeRoomsProps) {
  const { accommodations, loading, error } = useAccommodations();
  
  // Legacy amenities for this component
  const amenities = [
    { icon: Wifi, label: "Free WiFi" },
    { icon: Coffee, label: "Coffee Bar" },
    { icon: Car, label: "Free Parking" },
    { icon: Waves, label: "Lake Access" },
  ];

  return (
    <section id="rooms" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader 
          title="Luxury Accommodation"
          description="Experience the perfect blend of comfort and nature in our carefully designed spaces"
        />

        {/* Amenities Grid */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {amenities.map((amenity, index) => (
            <AmenityBadge key={index} icon={amenity.icon} label={amenity.label} />
          ))}
        </div>

        {/* Accommodation Cards */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Loading accommodations...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-lg text-destructive">Error loading accommodations: {error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {accommodations.map((accommodation) => (
              <AccommodationCard 
                key={accommodation.id} 
                accommodation={accommodation}
                onBookingClick={onBookingClick}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}