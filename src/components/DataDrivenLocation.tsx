import { useLocationInfo } from "@/hooks/useLocationInfo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, MapPin, Plane, Train, Car, Phone, Mail, MessageSquare } from "lucide-react";

export const DataDrivenLocation = () => {
  const { data: locationInfo, isLoading, error } = useLocationInfo();

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <Skeleton className="h-8 w-48 mx-auto mb-2" />
              <Skeleton className="h-4 w-96 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load location information. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  if (!locationInfo) {
    return null;
  }

  const transportOptions = locationInfo.transport_options || {};
  const nearbyAttractions = locationInfo.nearby_attractions || {};
  const contactInfo = locationInfo.contact_info || {};

  return (
    <section id="location" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {locationInfo.title}
            </h2>
            {locationInfo.description && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {locationInfo.description}
              </p>
            )}
          </div>

          {/* Address & Coordinates */}
          {(locationInfo.address || locationInfo.coordinates) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {locationInfo.address && (
                  <p className="text-foreground">{locationInfo.address}</p>
                )}
                {locationInfo.coordinates && (
                  <p className="text-muted-foreground font-mono text-sm">
                    {locationInfo.coordinates}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Transport Options */}
            {Object.keys(transportOptions).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-primary" />
                    Getting Here
                  </CardTitle>
                  <CardDescription>Transportation options to reach the resort</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {transportOptions.airport && (
                    <div className="flex items-start gap-3">
                      <Plane className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="flex-1">
                        <p className="font-medium">{transportOptions.airport.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {transportOptions.airport.distance} • {transportOptions.airport.duration}
                        </p>
                      </div>
                    </div>
                  )}
                  {transportOptions.train && (
                    <div className="flex items-start gap-3">
                      <Train className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="flex-1">
                        <p className="font-medium">{transportOptions.train.station}</p>
                        <p className="text-sm text-muted-foreground">
                          {transportOptions.train.distance} • {transportOptions.train.duration}
                        </p>
                      </div>
                    </div>
                  )}
                  {transportOptions.taxi && (
                    <div className="flex items-start gap-3">
                      <Car className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="flex-1">
                        <p className="font-medium">Taxi Service</p>
                        <p className="text-sm text-muted-foreground">
                          {transportOptions.taxi.availability}
                        </p>
                        {transportOptions.taxi.notes && (
                          <p className="text-sm text-muted-foreground">
                            {transportOptions.taxi.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            {Object.keys(contactInfo).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>Get in touch with our team</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactInfo.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={`tel:${contactInfo.phone}`}
                        className="text-foreground hover:text-primary transition-colors"
                      >
                        {contactInfo.phone}
                      </a>
                    </div>
                  )}
                  {contactInfo.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={`mailto:${contactInfo.email}`}
                        className="text-foreground hover:text-primary transition-colors"
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                  )}
                  {contactInfo.whatsapp && (
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-primary transition-colors"
                      >
                        WhatsApp: {contactInfo.whatsapp}
                      </a>
                    </div>
                  )}
                  {contactInfo.emergency && (
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <span className="text-sm">
                        Emergency: <a href={`tel:${contactInfo.emergency}`} className="text-destructive hover:underline">{contactInfo.emergency}</a>
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Nearby Attractions */}
          {Object.keys(nearbyAttractions).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Nearby Attractions</CardTitle>
                <CardDescription>Discover the cultural treasures around the resort</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {nearbyAttractions.temples && (
                    <div>
                      <h4 className="font-semibold mb-3 text-foreground">Sacred Temples</h4>
                      <div className="space-y-2">
                        {nearbyAttractions.temples.map((temple: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-foreground">{temple.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {temple.distance}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {nearbyAttractions.gardens && (
                    <div>
                      <h4 className="font-semibold mb-3 text-foreground">Gardens & Nature</h4>
                      <div className="space-y-2">
                        {nearbyAttractions.gardens.map((garden: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-foreground">{garden.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {garden.distance}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {nearbyAttractions.cultural && (
                    <div>
                      <h4 className="font-semibold mb-3 text-foreground">Cultural Sites</h4>
                      <div className="space-y-2">
                        {nearbyAttractions.cultural.map((site: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-foreground">{site.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {site.distance}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};