import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Gallery } from "@/components/Gallery";

const GalleryPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Gallery | Ko Lake Villa";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Explore the Ko Lake Villa photo and video gallery showcasing luxury lakefront accommodation in Sri Lanka.");
  }, []);

  const handleBookingClick = () => navigate('/contact');

  return (
    <div className="min-h-screen bg-background">
      <Navigation onBookingClick={handleBookingClick} />
      <main>
        <Gallery />
      </main>
    </div>
  );
};

export default GalleryPage;
