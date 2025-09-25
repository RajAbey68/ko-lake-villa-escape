import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface AccommodationCardProps {
  accommodation: {
    id: string | number;
    name: string;
    description: string;
    price: string;
    guests: number;
    features: string[];
    image: string;
    direct_price: number | null;
    airbnb_price: number | null;
    airbnb_url: string | null;
  };
  onBookingClick?: () => void;
}

export function AccommodationCard({ accommodation, onBookingClick }: AccommodationCardProps) {
  const savings = accommodation.direct_price && accommodation.airbnb_price 
    ? accommodation.airbnb_price - accommodation.direct_price 
    : null;

  return (
    <Card className="card-lake overflow-hidden group hover:shadow-[var(--shadow-elegant)] transition-[var(--transition-luxury)]">
      <div className="relative overflow-hidden">
        <img 
          src={accommodation.image} 
          alt={accommodation.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 space-y-2">
          <Badge className="bg-primary text-primary-foreground block text-center">
            ${accommodation.direct_price}/night
          </Badge>
          {savings && savings > 0 && (
            <Badge className="bg-green-600 text-white block text-center">
              Save ${savings}
            </Badge>
          )}
        </div>
      </div>
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{accommodation.name}</CardTitle>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm">{accommodation.guests}</span>
          </div>
        </div>
        <CardDescription>{accommodation.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {accommodation.features.map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>
        
        {accommodation.direct_price && accommodation.airbnb_price && (
          <div className="mb-4 p-3 bg-secondary/50 rounded-lg">
            <div className="text-sm text-center space-y-1">
              <div className="flex justify-between">
                <span>Direct Booking:</span>
                <span className="font-semibold text-primary">${accommodation.direct_price}/night</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Airbnb Rate:</span>
                <span className="line-through">${accommodation.airbnb_price}/night</span>
              </div>
              {savings && savings > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>You Save:</span>
                  <span>${savings}/night</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <Button 
          onClick={onBookingClick}
          className="btn-lake w-full"
        >
          Book Direct & Save
        </Button>
      </CardContent>
    </Card>
  );
}