import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { KoLakeContact } from "@/components/KoLakeContact";

const ContactPage = () => {
  useEffect(() => {
    document.title = "Contact Us | Ko Lake Villa";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Get in touch with Ko Lake Villa. Book your stay, ask questions, or request information about our luxury lakefront accommodation.");
  }, []);

  const handleBookingClick = () => {
    // Already on contact page, scroll to form
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onBookingClick={handleBookingClick} />
      <main>
        <KoLakeContact onBookingClick={handleBookingClick} />
      </main>
    </div>
  );
};

export default ContactPage;
