import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { DataDrivenHero } from "@/components/DataDrivenHero";
import { Rooms } from "@/components/Rooms";
import { Gallery } from "@/components/Gallery";
import { DataDrivenAmenities } from "@/components/DataDrivenAmenities";
import { DataDrivenLocation } from "@/components/DataDrivenLocation";
import { KoLakeContact } from "@/components/KoLakeContact";

const Index = () => {
  const navigate = useNavigate();

  const handleBookingClick = () => {
    navigate('/contact');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onBookingClick={handleBookingClick} />
      <main>
        <DataDrivenHero onBookingClick={handleBookingClick} />
        {/* Stats placeholder for E2E (non-visual) */}
        <div data-testid="stats" className="sr-only">stats</div>
        <Rooms onBookingClick={handleBookingClick} />
        <Gallery />
        <DataDrivenAmenities />
        <DataDrivenLocation />
        <KoLakeContact onBookingClick={handleBookingClick} />
      </main>
    </div>
  );
};

export default Index;
