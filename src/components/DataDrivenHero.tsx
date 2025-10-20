import { useState, useEffect } from "react";
import { useHeroContent } from "@/hooks/useHeroContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface DataDrivenHeroProps {
  onBookingClick?: () => void;
}

export const DataDrivenHero = ({ onBookingClick }: DataDrivenHeroProps) => {
  const { data: heroContent, isLoading, error } = useHeroContent();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!heroContent || heroContent.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroContent.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroContent]);

  const handleCTAClick = (action: string | null) => {
    switch (action) {
      case 'booking':
        onBookingClick?.();
        break;
      case 'rooms':
        document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'amenities':
        document.getElementById('amenities')?.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        onBookingClick?.();
    }
  };

  const nextSlide = () => {
    if (heroContent) {
      setCurrentSlide((prev) => (prev + 1) % heroContent.length);
    }
  };

  const prevSlide = () => {
    if (heroContent) {
      setCurrentSlide((prev) => (prev - 1 + heroContent.length) % heroContent.length);
    }
  };

  if (isLoading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5" data-testid="hero">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Skeleton className="h-16 w-96 mx-auto" />
            <Skeleton className="h-6 w-64 mx-auto" />
            <Skeleton className="h-24 w-full max-w-2xl mx-auto" />
            <div className="flex justify-center gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5" data-testid="hero">
        <div className="container mx-auto px-4">
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load hero content. Please refresh the page.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  if (!heroContent || heroContent.length === 0) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5" data-testid="hero">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Ko Lake Villa
            </h1>
            <p className="text-xl text-muted-foreground">
              Lakeside Villa in Ahangama
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              60 foot lao pool, 350 yards from swim and surf and lake sanband next to garden
            </p>
            <Button onClick={onBookingClick} size="lg" className="btn-kurumba text-lg px-8 py-3">
              Book Now
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const currentContent = heroContent[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" data-testid="hero">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${currentContent.image_url})`
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6 text-white">
          <div className="space-y-4">
            {currentContent.subtitle && (
              <p className="text-lg md:text-xl font-medium text-white/90 animate-fade-in">
                {currentContent.subtitle}
              </p>
            )}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-in">
              {currentContent.title}
            </h1>
          </div>

          {currentContent.description && (
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90 animate-fade-in">
              {currentContent.description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-fade-in">
            {currentContent.cta_text && (
              <Button
                onClick={() => handleCTAClick(currentContent.cta_action)}
                size="lg"
                className="btn-kurumba text-lg px-8 py-3"
              >
                {currentContent.cta_text}
              </Button>
            )}
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-3 border-2 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-stone transition-all"
              onClick={() => document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Rooms
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {heroContent.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {heroContent.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {heroContent.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};