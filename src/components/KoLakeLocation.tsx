import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Clock, Plane, Car, Train } from "lucide-react";

export function KoLakeLocation() {
  return (
    <section id="location" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Location & Getting Here
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nestled in pristine natural beauty, yet easily accessible from major cities
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Map Placeholder */}
          <div className="relative">
            <div className="bg-muted rounded-2xl h-96 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-glow/20"></div>
              <div className="text-center z-10">
                <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ko Lake Villa</h3>
                <p className="text-muted-foreground">Interactive map coming soon</p>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-6">
            
            {/* Address */}
            <Card className="card-lake">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Our Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">
                  Koggala Lake<br />
                  Ahangama, Galle<br />
                  Southern Province, Sri Lanka
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </CardContent>
            </Card>

            {/* Transportation Options */}
            <Card className="card-lake">
              <CardHeader>
                <CardTitle>How to Reach Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div className="flex items-start gap-3">
                  <Plane className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">By Air</h4>
                    <p className="text-sm text-muted-foreground">
                      2.5 hours from Bandaranaike International Airport (CMB)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Car className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">By Car</h4>
                    <p className="text-sm text-muted-foreground">
                      2 hours from Colombo via Southern Expressway. Free parking available.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Train className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">By Train</h4>
                    <p className="text-sm text-muted-foreground">
                      Scenic rail journey to Galle, then 30-minute transfer.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nearby Attractions */}
            <Card className="card-lake">
              <CardHeader>
                <CardTitle>Nearby Attractions</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Galle Fort</span>
                      <span className="text-xs text-muted-foreground">15 min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Stilt Fishermen</span>
                      <span className="text-xs text-muted-foreground">10 min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Hikkaduwa Beach</span>
                      <span className="text-xs text-muted-foreground">20 min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Snake Island</span>
                      <span className="text-xs text-muted-foreground">5 min</span>
                    </div>
                  </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transfer Service */}
        <div className="mt-16 bg-gradient-to-r from-primary to-primary-glow rounded-2xl p-8 text-center text-white">
          <Clock className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Airport Transfer Service</h3>
          <p className="mb-6 opacity-90">
            Let us arrange your comfortable journey from the airport. Our luxury transfer service 
            ensures a smooth start to your Ko Lake Villa experience.
          </p>
          <Button variant="secondary" size="lg">
            Book Transfer Service
          </Button>
        </div>
      </div>
    </section>
  );
}