import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Car, Plane, Train, Camera } from "lucide-react";

export const Location = () => {
  const attractions = [
    { name: "Galle Fort", distance: "15 km", time: "30 min drive" },
    { name: "Stilt Fishermen", distance: "10 km", time: "20 min drive" },
    { name: "Hikkaduwa Beach", distance: "20 km", time: "35 min drive" },
    { name: "Snake Island", distance: "5 km", time: "10 min drive" },
    { name: "Unawatuna Beach", distance: "25 km", time: "40 min drive" },
    { name: "Martin Wickramasinghe Folk Museum", distance: "8 km", time: "15 min drive" },
  ];

  const transportation = [
    { 
      icon: Plane, 
      title: "Bandaranaike International Airport", 
      distance: "145 km", 
      time: "2.5 hours",
      description: "Airport transfers available on request"
    },
    { 
      icon: Train, 
      title: "Galle Railway Station", 
      distance: "15 km", 
      time: "30 minutes",
      description: "Scenic coastal railway from Colombo"
    },
    { 
      icon: Car, 
      title: "Southern Expressway", 
      distance: "2 hours", 
      time: "from Colombo",
      description: "Modern highway with beautiful coastal views"
    },
  ];

  return (
    <section id="location" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Perfect Location</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Nestled on the tranquil shores of Koggala Lake in Ahangama, with easy access to pristine beaches and cultural attractions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Map Section */}
          <div className="space-y-6">
            <Card className="overflow-hidden shadow-medium">
              <div className="h-80 bg-muted relative">
                {/* Placeholder for interactive map */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Ko Lake Villa</h3>
                    <p className="text-muted-foreground">Koggala Lake, Ahangama</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      5°58'N 80°21'E
                    </p>
                  </div>
                </div>
              </div>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 text-center">
                <Camera className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Coastal Paradise</h4>
                <p className="text-sm text-muted-foreground">Southern Province beaches</p>
              </Card>
              <Card className="p-4 text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Year-Round Climate</h4>
                <p className="text-sm text-muted-foreground">24-28°C average</p>
              </Card>
            </div>
          </div>

          {/* Attractions */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Nearby Attractions</h3>
            <div className="space-y-4">
              {attractions.map((attraction, index) => (
                <Card key={index} className="p-4 hover:shadow-medium smooth-transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{attraction.name}</h4>
                      <p className="text-sm text-muted-foreground">{attraction.distance}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-primary">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">{attraction.time}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Transportation */}
        <div>
          <h3 className="text-2xl font-bold mb-8 text-center">Getting Here</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {transportation.map((transport, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-medium smooth-transition">
                <div className="mb-4">
                  <transport.icon className="h-12 w-12 text-primary mx-auto" />
                </div>
                <h4 className="text-lg font-semibold mb-2">{transport.title}</h4>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{transport.distance}</span>
                  </div>
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{transport.time}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{transport.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact for Transportation */}
        <Card className="mt-12 p-8 text-center bg-primary/5 border-primary/20">
          <h3 className="text-xl font-semibold mb-4">Need Transportation Assistance?</h3>
          <p className="text-muted-foreground mb-6">
            We can arrange airport transfers, local tours, and transportation to nearby attractions. 
            Contact our concierge team for personalized travel arrangements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center justify-center">
              <span className="text-sm font-medium">📞 +94 77 123 4567</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-sm font-medium">✉️ concierge@kolakevilla.com</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};