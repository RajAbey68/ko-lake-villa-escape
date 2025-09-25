import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Gallery } from "@/components/Gallery";
import { KoLakeBooking } from "@/components/KoLakeBooking";

const GalleryPage = () => {
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    document.title = "Gallery | Ko Lake Villa";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Explore the Ko Lake Villa photo and video gallery showcasing luxury lakefront accommodation in Sri Lanka.");
  }, []);

  const handleBookingClick = () => setBookingOpen(true);

  return (
    <div className="min-h-screen bg-background">
      <Navigation onBookingClick={handleBookingClick} />
      <main>
        <Gallery />
      </main>
      <KoLakeBooking isOpen={bookingOpen} onOpenChange={setBookingOpen} />
    </div>
  );
};

export default GalleryPage;
