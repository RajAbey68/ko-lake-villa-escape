import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroProps {
  onBookingClick?: () => void;
}

export const Hero = ({ onBookingClick }: HeroProps) => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 hero-bg"></div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
            Ko Lake Villa
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-white/90 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Luxury Eco-Friendly Resort by Kandy Lake
          </p>
          <p className="text-lg md:text-xl mb-8 text-white/80 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            Experience the perfect blend of luxury and nature in our stunning lakeside villas. 
            Sustainable hospitality meets breathtaking views.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-8 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="text-lg font-semibold">4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span className="text-lg font-semibold">Up to 6 Guests</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span className="text-lg font-semibold">Year-Round Luxury</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
            <Button 
              size="lg" 
              onClick={onBookingClick}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold shadow-large"
            >
              Book Your Stay
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild
              className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold"
            >
              <Link to="/gallery">Explore Gallery</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Booking Card */}
      <Card className="absolute bottom-8 left-1/2 transform -translate-x-1/2 glass-card p-6 max-w-md w-full mx-4 animate-fade-in-up" style={{ animationDelay: "1s" }}>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2 text-white">Starting from</h3>
          <div className="text-3xl font-bold text-primary mb-2">$199</div>
          <p className="text-sm text-white/80 mb-4">per night • Direct booking discount</p>
          <Button 
            onClick={onBookingClick}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Check Availability
          </Button>
        </div>
      </Card>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};