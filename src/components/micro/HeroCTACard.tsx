import { useState } from "react";
import { X, Calendar, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface HeroCTACardProps {
  onBookingClick?: () => void;
}

export function HeroCTACard({ onBookingClick }: HeroCTACardProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="absolute left-4 md:left-8 lg:left-16 top-1/2 transform -translate-y-1/2 z-30">
      <Card className="card-floating p-4 md:p-6 max-w-sm relative">
        {/* Close button for mobile */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors md:hidden"
          aria-label="Close information card"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
            Ko Lake Villa
          </h1>
          <p className="text-gray-600 text-sm mb-1">
            Luxury Lakefront Accommodation in Sri Lanka
          </p>
          <p className="text-amber-600 italic text-xs">
            Relax, Revive, Reconnect
          </p>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
          <div className="flex items-center gap-1 text-gray-600">
            <Star className="w-3 h-3 text-amber-500" />
            <span>5.0</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Users className="w-3 h-3" />
            <span>6 Guests</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar className="w-3 h-3" />
            <span>Available</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button 
            onClick={onBookingClick}
            className="w-full btn-lake text-sm font-medium"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Now
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full text-sm font-medium border-gray-300 hover:bg-gray-50"
          >
            View Rooms & Rates
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Explore Gallery
          </Button>
        </div>
      </Card>
    </div>
  );
}