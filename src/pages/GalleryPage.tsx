import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { PublicGallery, AdminGallery } from "@/components/GalleryModule";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const GalleryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminView = location.pathname === '/gallery-admin';

  useEffect(() => {
    document.title = isAdminView ? "Gallery Admin | Ko Lake Villa" : "Gallery | Ko Lake Villa";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Explore the Ko Lake Villa photo and video gallery showcasing luxury lakefront accommodation in Sri Lanka.");
  }, [isAdminView]);

  const handleBookingClick = () => navigate('/contact');

  if (isAdminView) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation onBookingClick={handleBookingClick} />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/gallery')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gallery
            </Button>
            <h1 className="text-3xl font-bold">Gallery Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage images and videos for the Ko Lake Villa gallery
            </p>
          </div>
          <AdminGallery />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation onBookingClick={handleBookingClick} />
      <main>
        <PublicGallery />
      </main>
    </div>
  );
};

export default GalleryPage;
