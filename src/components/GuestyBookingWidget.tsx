import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Calendar, Users, MapPin, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface GuestyBookingWidgetProps {
  onBookingSearch?: (searchParams: BookingSearchParams) => void;
  className?: string;
}

export interface BookingSearchParams {
  propertyType: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}

interface GuestyAvailabilityResponse {
  available: boolean;
  totalPrice: number | null;
  currency: string;
  listingId: string;
  bookingUrl: string;
  error?: string;
}

export function GuestyBookingWidget({ onBookingSearch, className = "" }: GuestyBookingWidgetProps) {
  const [searchParams, setSearchParams] = useState<BookingSearchParams>({
    propertyType: "",
    checkIn: "",
    checkOut: "",
    adults: 2,
    children: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availabilityData, setAvailabilityData] = useState<GuestyAvailabilityResponse | null>(null);

  const [propertyTypes, setPropertyTypes] = useState<Array<{
    value: string;
    label: string;
    maxGuests: number;
    listingId: string;
    basePrice: number;
  }>>([]);

  // Load properties from Guesty on component mount
  useEffect(() => {
    const loadProperties = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('guesty-properties');
        if (error) {
          console.error('Failed to load properties:', error);
          return;
        }
        
        const properties = data?.properties || [];
        const formattedTypes = properties.map((prop: any) => ({
          value: prop.id,
          label: `${prop.title} (${prop.maxGuests} Guests)`,
          maxGuests: prop.maxGuests,
          listingId: prop.id,
          basePrice: prop.basePrice
        }));
        
        setPropertyTypes(formattedTypes);
      } catch (err) {
        console.error('Error loading properties:', err);
      }
    };
    
    loadProperties();
  }, []);

  const handleInputChange = (field: keyof BookingSearchParams, value: string | number) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const calculateNights = (): number => {
    if (searchParams.checkIn && searchParams.checkOut) {
      const checkInDate = new Date(searchParams.checkIn);
      const checkOutDate = new Date(searchParams.checkOut);
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
      const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return nights > 0 ? nights : 0;
    }
    return 0;
  };

  const validateForm = (): boolean => {
    if (!searchParams.propertyType) {
      setError("Please select a property type");
      return false;
    }
    if (!searchParams.checkIn) {
      setError("Please select check-in date");
      return false;
    }
    if (!searchParams.checkOut) {
      setError("Please select check-out date");
      return false;
    }
    
    const checkInDate = new Date(searchParams.checkIn);
    const checkOutDate = new Date(searchParams.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      setError("Check-in date cannot be in the past");
      return false;
    }
    
    if (checkOutDate <= checkInDate) {
      setError("Check-out date must be after check-in date");
      return false;
    }

    const totalGuests = searchParams.adults + searchParams.children;
    if (totalGuests === 0) {
      setError("Please specify at least 1 guest");
      return false;
    }

    // Check occupancy limits
    const selectedProperty = propertyTypes.find(p => p.value === searchParams.propertyType);
    if (selectedProperty && totalGuests > selectedProperty.maxGuests) {
      setError(`${selectedProperty.label} can accommodate maximum ${selectedProperty.maxGuests} guests`);
      return false;
    }

    return true;
  };

  const handleGuestySearch = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const selectedProperty = propertyTypes.find(p => p.value === searchParams.propertyType);
      
      // Call real Guesty availability API through Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('guesty-availability', {
        body: {
          property_id: selectedProperty?.listingId,
          check_in: searchParams.checkIn,
          check_out: searchParams.checkOut,
          adults: searchParams.adults,
          children: searchParams.children
        }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to check availability');
      }
      
      // Map Supabase function response to our interface
      const responseData = data?.data || data;
      const mappedResponse: GuestyAvailabilityResponse = {
        available: responseData.available || false,
        totalPrice: responseData.totalPrice || null,
        currency: responseData.currency || 'USD',
        listingId: responseData.listingId || selectedProperty?.listingId,
        bookingUrl: responseData.bookingUrl || `https://booking.guesty.com/${responseData.listingId || selectedProperty?.listingId}`
      };
      
      setAvailabilityData(mappedResponse);
      
      // Callback to parent component
      onBookingSearch?.(searchParams);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search availability');
      console.error('Guesty search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get today's date for min date validation
  const today = new Date().toISOString().split('T')[0];
  const checkInMin = searchParams.checkIn || today;

  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Search className="h-5 w-5 text-primary" />
          Check Availability & Pricing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Property Type Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Property Type
          </Label>
          <Select
            value={searchParams.propertyType}
            onValueChange={(value) => handleInputChange("propertyType", value)}
          >
            <SelectTrigger data-testid="select-property-type">
              <SelectValue placeholder="Select accommodation type" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Check-in Date
            </Label>
            <Input
              type="date"
              value={searchParams.checkIn}
              onChange={(e) => handleInputChange("checkIn", e.target.value)}
              min={today}
              data-testid="input-checkin-date"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Check-out Date</Label>
            <Input
              type="date"
              value={searchParams.checkOut}
              onChange={(e) => handleInputChange("checkOut", e.target.value)}
              min={checkInMin}
              data-testid="input-checkout-date"
              className="w-full"
            />
          </div>
        </div>

        {/* Guest Count Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Adults (Over 14)
            </Label>
            <Select
              value={searchParams.adults.toString()}
              onValueChange={(value) => handleInputChange("adults", parseInt(value))}
            >
              <SelectTrigger data-testid="select-adults">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} Adult{num > 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Children (Under 14)</Label>
            <Select
              value={searchParams.children.toString()}
              onValueChange={(value) => handleInputChange("children", parseInt(value))}
            >
              <SelectTrigger data-testid="select-children">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} Child{num !== 1 ? 'ren' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" data-testid="alert-booking-error">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search Button */}
        <Button
          onClick={handleGuestySearch}
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 py-3 text-lg"
          data-testid="button-search-availability"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Checking Availability...
            </>
          ) : (
            <>
              <Search className="w-5 h-5 mr-2" />
              Check Availability & Pricing
            </>
          )}
        </Button>

        {/* Availability Results */}
        {availabilityData && (
          <Card className={`mt-6 ${availabilityData.available ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <h3 className={`text-lg font-semibold ${availabilityData.available ? 'text-green-800' : 'text-red-800'}`}>
                  {availabilityData.available ? '✅ Available for Your Dates!' : '❌ Not Available for Selected Dates'}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Property:</span>
                    <p className="font-medium">
                      {propertyTypes.find(t => t.value === searchParams.propertyType)?.label}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Guests:</span>
                    <p className="font-medium">
                      {searchParams.adults + searchParams.children} ({searchParams.adults} adults, {searchParams.children} children)
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Dates:</span>
                    <p className="font-medium">
                      {new Date(searchParams.checkIn).toLocaleDateString()} - {new Date(searchParams.checkOut).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Estimated Price:</span>
                    <p className="font-semibold text-green-700">
                      ${availabilityData.totalPrice || 'Contact for pricing'}
                    </p>
                  </div>
                </div>
                {availabilityData.available && (
                  <Button 
                    className="w-full mt-4"
                    onClick={() => window.open(availabilityData.bookingUrl, '_blank')}
                  >
                    Book Now with Guesty
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Text */}
        <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          <p className="font-medium mb-2">💡 Booking Information:</p>
          <ul className="space-y-1 text-xs">
            <li>• Real-time availability check with Guesty property management</li>
            <li>• Children under 14 stay free (additional amenities may apply)</li>
            <li>• Best rates guaranteed for direct bookings</li>
            <li>• Instant confirmation available for most dates</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}