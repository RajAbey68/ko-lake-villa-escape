import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Rooms } from "@/components/Rooms";
import { PropertyDetailsCard } from "@/components/PropertyDetailsCard";
import { PropertyAvailabilityCalendar } from "@/components/PropertyAvailabilityCalendar";

const AccommodationPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Accommodation | Ko Lake Villa";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "View Ko Lake Villa rooms and rates. Luxury villas with lake views, premium amenities, and direct booking savings.");
  }, []);

  const handleBookingClick = () => navigate('/contact');

  return (
    <div className="min-h-screen bg-background">
      <Navigation onBookingClick={handleBookingClick} />
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Enhanced Guesty Integration Section */}
        <section>
          <h1 className="text-3xl font-bold mb-6">Live Property Details & Availability</h1>
          <div className="grid lg:grid-cols-2 gap-8">
            <PropertyDetailsCard />
            <PropertyAvailabilityCalendar onDateSelect={(date) => console.log('Selected date:', date)} />
          </div>
        </section>

        {/* Legacy Room Types Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Available Accommodations</h2>
          <Rooms onBookingClick={handleBookingClick} />
        </section>
      </main>
    </div>
  );
};

export default AccommodationPage;
