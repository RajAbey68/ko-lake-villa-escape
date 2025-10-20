import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { DataDrivenHero } from "@/components/DataDrivenHero";
import { Rooms } from "@/components/Rooms";
import { Gallery } from "@/components/Gallery";
import { DataDrivenAmenities } from "@/components/DataDrivenAmenities";
import { DataDrivenLocation } from "@/components/DataDrivenLocation";
import { KoLakeContact } from "@/components/KoLakeContact";
import { KoLakeBooking } from "@/components/KoLakeBooking";

const Index = () => {
  const [bookingOpen, setBookingOpen] = useState(false);

  const handleBookingClick = () => {
    setBookingOpen(true);
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
      <KoLakeBooking isOpen={bookingOpen} onOpenChange={setBookingOpen} />
      
    </div>
  );
};

export default Index;
