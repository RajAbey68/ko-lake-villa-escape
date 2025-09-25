import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { KoLakeContact } from "@/components/KoLakeContact";
import { KoLakeBooking } from "@/components/KoLakeBooking";

const ContactPage = () => {
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    document.title = "Contact | Ko Lake Villa";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Contact Ko Lake Villa for reservations, inquiries, and bespoke experiences by the lake in Sri Lanka.");
  }, []);

  const handleBookingClick = () => setBookingOpen(true);

  return (
    <div className="min-h-screen bg-background">
      <Navigation onBookingClick={handleBookingClick} />
      <main>
        <KoLakeContact onBookingClick={handleBookingClick} />
      </main>
      <KoLakeBooking isOpen={bookingOpen} onOpenChange={setBookingOpen} />
    </div>
  );
};

export default ContactPage;
