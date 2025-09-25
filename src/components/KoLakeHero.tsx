import { HeroImageRotator } from "@/components/micro/HeroImageRotator";
import { HeroCTACard } from "@/components/micro/HeroCTACard";
import { ScrollIndicator } from "@/components/micro/ScrollIndicator";
import heroLakeView from "@/assets/hero-villa-lake-view.jpg";
import heroInterior from "@/assets/hero-villa-interior.jpg";
import heroDining from "@/assets/hero-villa-dining.jpg";
import heroPool from "@/assets/hero-villa-pool.jpg";

const HERO_IMAGES = [
  heroLakeView,
  heroInterior,
  heroDining,
  heroPool
];

interface KoLakeHeroProps {
  onBookingClick?: () => void;
}

export function KoLakeHero({ onBookingClick }: KoLakeHeroProps) {

  return (
    <section className="hero-fullscreen">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-gray-900">
        <HeroImageRotator 
          images={HERO_IMAGES}
          altText="Ko Lake Villa luxury accommodation"
        />
        
        {/* Overlay for text contrast */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <HeroCTACard onBookingClick={onBookingClick} />
      <ScrollIndicator />
    </section>
  );
}