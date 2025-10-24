import { Button } from "@/components/ui/button";
import PoolSunsetImg from "@/assets/PoolSunset.jpg";

interface KoLakeHeroProps {
  onBookingClick?: () => void;
}

export function KoLakeHero({ onBookingClick }: KoLakeHeroProps) {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${PoolSunsetImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
          Ko Lake Villa
        </h1>
        <p className="text-xl md:text-2xl mb-4">
          Luxury Lakefront Accommodation in Sri Lanka
        </p>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Relax, Revive, Reconnect
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onBookingClick}
            size="lg"
            className="text-lg px-8 py-3 bg-[#FF9933] hover:bg-[#CC6600] text-white font-semibold rounded-xl shadow-md"
          >
            Book Now
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-3 border-2 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-stone"
            onClick={() => document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Rooms
          </Button>
        </div>
      </div>
    </section>
  );
}