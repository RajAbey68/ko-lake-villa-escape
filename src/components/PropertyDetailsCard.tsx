import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useGuestyPropertyDetails } from '@/hooks/useGuestyPropertyDetails';
import { 
  Users, 
  Bed, 
  Bath, 
  Clock, 
  MapPin,
  Wifi,
  Car,
  Coffee,
  Home,
  Shield
} from 'lucide-react';

interface PropertyDetailsCardProps {
  property_id?: string;
}

export function PropertyDetailsCard({ property_id }: PropertyDetailsCardProps) {
  const { data, loading, error, fetchPropertyDetails } = useGuestyPropertyDetails();

  useEffect(() => {
    fetchPropertyDetails(property_id);
  }, [property_id, fetchPropertyDetails]);

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi')) return <Wifi className="w-4 h-4" />;
    if (amenityLower.includes('parking') || amenityLower.includes('car')) return <Car className="w-4 h-4" />;
    if (amenityLower.includes('coffee') || amenityLower.includes('kitchen')) return <Coffee className="w-4 h-4" />;
    if (amenityLower.includes('tv') || amenityLower.includes('smart')) return <Home className="w-4 h-4" />;
    return <Shield className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Error loading property details: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No property details available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Property Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{data.title}</CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{data.bedrooms} bed{data.bedrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{data.bathrooms} bath{data.bathrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>Up to {data.max_guests} guests</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.images.slice(0, 3).map((image, index) => (
              <div 
                key={index}
                className="aspect-video bg-cover bg-center rounded-lg"
                style={{ backgroundImage: `url(${image})` }}
              />
            ))}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{data.description}</p>
          </div>

          {/* Pricing */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <span className="text-lg font-semibold">Base Price:</span>
            <span className="text-2xl font-bold text-primary">
              {data.pricing.currency} {data.pricing.base_price}/night
            </span>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
            <div>
              <p className="font-medium">Location</p>
              <p className="text-sm text-muted-foreground">
                {data.address.street}, {data.address.city}, {data.address.state}, {data.address.country}
              </p>
            </div>
          </div>

          {/* Check-in/Check-out Times */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Check-in</p>
                <p className="text-sm text-muted-foreground">{data.check_in_time}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Check-out</p>
                <p className="text-sm text-muted-foreground">{data.check_out_time}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Amenities Card */}
      <Card>
        <CardHeader>
          <CardTitle>Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.amenities.map((amenity, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {getAmenityIcon(amenity)}
                {amenity}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* House Rules Card */}
      <Card>
        <CardHeader>
          <CardTitle>House Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {data.house_rules.map((rule, index) => (
              <li key={index} className="flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span className="text-sm">{rule}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}