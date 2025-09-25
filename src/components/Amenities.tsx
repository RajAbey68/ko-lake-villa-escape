import { Wifi, Car, Coffee, UtensilsCrossed, Waves, TreePine, Dumbbell, Flower2, Wind, Mountain, Sun, Shield } from "lucide-react";

export const Amenities = () => {
  const amenities = [
    {
      icon: Wifi,
      title: "High-Speed WiFi",
      description: "Stay connected with complimentary high-speed internet throughout the property"
    },
    {
      icon: Car,
      title: "Free Parking",
      description: "Secure parking available for all guests at no additional charge"
    },
    {
      icon: Coffee,
      title: "Gourmet Kitchen",
      description: "Fully equipped kitchens with premium appliances and local ingredients"
    },
    {
      icon: UtensilsCrossed,
      title: "Private Dining",
      description: "Personalized dining experiences with local and international cuisine"
    },
    {
      icon: Waves,
      title: "Lake Access",
      description: "Direct access to pristine Kandy Lake for swimming and water activities"
    },
    {
      icon: TreePine,
      title: "Eco-Friendly",
      description: "Sustainable practices with solar power and organic gardens"
    },
    {
      icon: Dumbbell,
      title: "Fitness Center",
      description: "Modern fitness equipment with lake views for your workout routine"
    },
    {
      icon: Flower2,
      title: "Spa Services",
      description: "Rejuvenating treatments using traditional Sri Lankan wellness practices"
    },
    {
      icon: Wind,
      title: "Air Conditioning",
      description: "Climate-controlled comfort in all rooms and common areas"
    },
    {
      icon: Mountain,
      title: "Mountain Views",
      description: "Breathtaking panoramic views of the surrounding mountain ranges"
    },
    {
      icon: Sun,
      title: "Solar Powered",
      description: "Environmentally conscious energy solutions for sustainable luxury"
    },
    {
      icon: Shield,
      title: "24/7 Security",
      description: "Round-the-clock security and concierge services for peace of mind"
    }
  ];

  return (
    <section id="amenities" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Premium Amenities</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience luxury and comfort with our carefully curated amenities designed for the modern traveler
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {amenities.map((amenity, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg smooth-transition hover:bg-card hover:shadow-medium group"
            >
              <div className="amenity-icon mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white">
                <amenity.icon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{amenity.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {amenity.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 rounded-lg bg-card shadow-medium">
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <h3 className="text-lg font-semibold mb-2">Premium Amenities</h3>
            <p className="text-muted-foreground">Carefully selected for your comfort and convenience</p>
          </div>
          <div className="text-center p-8 rounded-lg bg-card shadow-medium">
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <h3 className="text-lg font-semibold mb-2">Concierge Service</h3>
            <p className="text-muted-foreground">Available around the clock for all your needs</p>
          </div>
          <div className="text-center p-8 rounded-lg bg-card shadow-medium">
            <div className="text-3xl font-bold text-primary mb-2">100%</div>
            <h3 className="text-lg font-semibold mb-2">Eco-Friendly</h3>
            <p className="text-muted-foreground">Sustainable luxury without compromise</p>
          </div>
        </div>
      </div>
    </section>
  );
};