import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { DataDrivenAmenities } from "@/components/DataDrivenAmenities";

const ExperiencesPage = () => {
  useEffect(() => {
    document.title = "Experiences | Ko Lake Villa";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Discover curated experiences at Ko Lake Villa: lake cruises, cultural tours, wellness, and nature adventures.");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <section className="py-16 container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Experiences</h1>
          <p className="text-muted-foreground max-w-2xl mb-10">
            From serene lake cruises to immersive cultural tours and wellness rituals, elevate your stay with unforgettable moments.
          </p>
        </section>
        <DataDrivenAmenities />
      </main>
    </div>
  );
};

export default ExperiencesPage;
