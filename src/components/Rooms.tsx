import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Users, Bed, Bath, Wifi, Car, Coffee, MapPin } from "lucide-react";

interface Room {
  id: string;
  name: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  amenities: string[];
  images: string[];
  direct_price: number;
  airbnb_price: number;
  airbnb_url: string;
  is_available: boolean;
  display_order: number;
}

interface RoomsProps {
  onBookingClick?: () => void;
}

export const Rooms = ({ onBookingClick }: RoomsProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('room_types')
        .select('*')
        .eq('is_available', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: any } = {
      'WiFi': Wifi,
      'Air Conditioning': Coffee, // Using coffee as AC icon
      'Kitchen': Coffee,
      'Kitchenette': Coffee,
      'Mini Bar': Coffee,
      'Private Terrace': MapPin,
      'Garden View': MapPin,
      'Lake View': MapPin,
      'Pool Access': MapPin,
      'Parking': Car,
    };
    
    const IconComponent = iconMap[amenity] || MapPin;
    return <IconComponent className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <section id="rooms" className="py-20 bg-muted/30" data-testid="rooms-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Luxury Accommodations</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Loading rooms...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="rooms" className="py-20 bg-muted/30" data-testid="rooms-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Luxury Accommodations</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our carefully designed rooms and villas, each offering unique views and premium amenities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <Card key={room.id} className="room-card overflow-hidden shadow-medium hover:shadow-large">
              <div className="relative h-64 bg-muted">
                <img 
                  src={(room.images?.[0] && room.images?.[0].startsWith('/')) ? room.images[0] : "/placeholder.svg"} 
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90 text-primary">
                    Featured
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-2xl">{room.name}</CardTitle>
                <p className="text-muted-foreground">{room.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Room Details */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>Up to {room.max_guests} guests</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Bed className="h-4 w-4" />
                    <span>{room.bedrooms} bedroom{room.bedrooms > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Bath className="h-4 w-4" />
                    <span>{room.bathrooms} bathroom{room.bathrooms > 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h4 className="font-semibold mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities?.slice(0, 4).map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-1 text-sm text-muted-foreground">
                        {getAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                    ))}
                    {room.amenities?.length > 4 && (
                      <span className="text-sm text-muted-foreground">
                        +{room.amenities.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Pricing */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        ${room.direct_price}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        per night • Direct booking
                      </div>
                    </div>
                    {room.airbnb_price && (
                      <div className="text-right">
                        <div className="text-lg line-through text-muted-foreground">
                          ${room.airbnb_price}
                        </div>
                        <div className="text-sm text-green-600 font-semibold">
                          Save ${room.airbnb_price - room.direct_price}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button 
                      onClick={onBookingClick}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      Book Direct & Save
                    </Button>
                    {room.airbnb_url && (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.open(room.airbnb_url, '_blank')}
                      >
                        View on Airbnb
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {rooms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No rooms available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};