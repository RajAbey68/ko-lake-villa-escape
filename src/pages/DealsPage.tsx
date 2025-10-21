import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Star, Gift, Sparkles } from "lucide-react";

const DealsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Special Offers & Packages | Ko Lake Villa";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Discover exclusive packages and special offers at Ko Lake Villa. Save on luxury lakefront accommodations with our curated deals.");
  }, []);

  const handleBookingClick = () => navigate('/contact');

  const deals = [
    {
      id: 1,
      title: "Romantic Lakefront Escape",
      description: "Perfect for couples seeking intimacy by the tranquil waters",
      originalPrice: 450,
      discountedPrice: 350,
      savings: 100,
      duration: "2 nights",
      maxGuests: 2,
      validUntil: "2024-12-31",
      features: [
        "Private lakefront villa",
        "Complimentary sunset cruise",
        "Couples spa treatment",
        "Candlelit dinner by the lake",
        "Late checkout until 2 PM"
      ],
      badge: "Most Popular",
      gradient: "from-rose-400 to-pink-600"
    },
    {
      id: 2,
      title: "Family Lake Adventure",
      description: "Create lasting memories with activities for all ages",
      originalPrice: 800,
      discountedPrice: 650,
      savings: 150,
      duration: "3 nights",
      maxGuests: 6,
      validUntil: "2024-11-30",
      features: [
        "Family villa with connecting rooms",
        "Kayaking and fishing equipment",
        "Nature walk guided tours",
        "Children's activity program",
        "Family BBQ by the lake"
      ],
      badge: "Best Value",
      gradient: "from-blue-400 to-cyan-600"
    },
    {
      id: 3,
      title: "Wellness Retreat Package",
      description: "Rejuvenate your mind, body, and soul in nature's embrace",
      originalPrice: 600,
      discountedPrice: 480,
      savings: 120,
      duration: "4 nights",
      maxGuests: 4,
      validUntil: "2024-12-15",
      features: [
        "Daily yoga and meditation sessions",
        "Ayurvedic spa treatments",
        "Healthy cuisine meal plan",
        "Lake meditation sessions",
        "Wellness consultation"
      ],
      badge: "New",
      gradient: "from-green-400 to-emerald-600"
    },
    {
      id: 4,
      title: "Extended Stay Discount",
      description: "Enjoy significant savings for longer peaceful retreats",
      originalPrice: 1200,
      discountedPrice: 900,
      savings: 300,
      duration: "7 nights",
      maxGuests: 4,
      validUntil: "2025-01-31",
      features: [
        "Weekly villa rental discount",
        "Complimentary airport transfers",
        "Daily housekeeping service",
        "Lake activities included",
        "Welcome basket with local treats"
      ],
      badge: "Limited Time",
      gradient: "from-purple-400 to-violet-600"
    }
  ];

  const seasonalOffers = [
    {
      title: "Monsoon Serenity Special",
      description: "Experience the lake's dramatic beauty during monsoon season",
      discount: "40% off",
      period: "June - August 2024"
    },
    {
      title: "Christmas & New Year Package",
      description: "Celebrate the holidays with lakefront luxury and festivities",
      discount: "25% off",
      period: "December 20 - January 5"
    },
    {
      title: "Early Bird Booking",
      description: "Book 3 months in advance and save on your dream getaway",
      discount: "30% off",
      period: "Valid year-round"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation onBookingClick={handleBookingClick} />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-primary-glow text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Special Offers & Packages
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
              Discover exclusive deals and curated experiences at Ko Lake Villa. 
              Luxury lakefront living with exceptional value.
            </p>
            <Button 
              onClick={handleBookingClick}
              variant="secondary" 
              size="lg"
              className="text-primary bg-white hover:bg-white/90"
            >
              <Gift className="w-5 h-5 mr-2" />
              Book Now & Save
            </Button>
          </div>
        </section>

        {/* Featured Packages */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Featured Packages</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Handcrafted experiences combining luxury accommodation with unforgettable activities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {deals.map((deal) => (
                <Card key={deal.id} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                  {deal.badge && (
                    <div className={`absolute top-4 right-4 z-10`}>
                      <Badge className={`bg-gradient-to-r ${deal.gradient} text-white border-none`}>
                        {deal.badge}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-2xl">{deal.title}</CardTitle>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground line-through">
                          ${deal.originalPrice}
                        </div>
                        <div className="text-2xl font-bold text-primary">
                          ${deal.discountedPrice}
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          Save ${deal.savings}
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-base">
                      {deal.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="flex gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {deal.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Up to {deal.maxGuests} guests
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Valid until {deal.validUntil}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        What's Included
                      </h4>
                      <ul className="space-y-2">
                        {deal.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-3 text-sm">
                            <Star className="w-4 h-4 text-primary flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      onClick={handleBookingClick}
                      className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
                    >
                      Book This Package
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Seasonal Offers */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Seasonal Offers</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Limited-time offers that celebrate the unique beauty of each season
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {seasonalOffers.map((offer, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl mb-2">{offer.title}</CardTitle>
                    <div className="text-3xl font-bold text-primary mb-2">
                      {offer.discount}
                    </div>
                    <CardDescription className="text-base">
                      {offer.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-4">
                      {offer.period}
                    </div>
                    <Button 
                      onClick={handleBookingClick}
                      variant="outline" 
                      className="w-full"
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-primary-glow text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Experience Ko Lake Villa?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Don't miss out on these exclusive offers. Book your lakefront retreat today 
              and create memories that will last a lifetime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleBookingClick}
                variant="secondary" 
                size="lg"
                className="text-primary bg-white hover:bg-white/90"
              >
                Book Your Stay Now
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-white border-white hover:bg-white/10"
                onClick={() => window.location.href = '/contact'}
              >
                Contact for Custom Packages
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DealsPage;