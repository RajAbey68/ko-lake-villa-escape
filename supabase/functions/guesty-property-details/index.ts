import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

interface PropertyDetailsRequest {
  property_id?: string;
}

interface GuestyPropertyDetails {
  id: string;
  title: string;
  description: string;
  images: string[];
  amenities: string[];
  house_rules: string[];
  check_in_time: string;
  check_out_time: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
  pricing: {
    base_price: number;
    currency: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { property_id }: PropertyDetailsRequest = await req.json();
    
    // Get Guesty configuration
    const appConfigJson = Deno.env.get('APP_CONFIG_JSON');
    if (!appConfigJson) {
      console.error('APP_CONFIG_JSON not found');
      return new Response(
        JSON.stringify({ error: 'Service configuration missing' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const appConfig = JSON.parse(appConfigJson);
    const guestyConfig = appConfig.guesty;
    
    if (!guestyConfig?.api_key || !guestyConfig?.base_url) {
      console.error('Guesty configuration incomplete');
      return new Response(
        JSON.stringify({ error: 'Guesty configuration incomplete' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Fetching property details for property: ${property_id || 'default'}`);
    
    // Mock implementation - replace with actual Guesty API call
    const mockPropertyDetails: GuestyPropertyDetails = {
      id: property_id || "mock-property-123",
      title: "Luxury Lake Villa",
      description: "Stunning waterfront villa with panoramic lake views, private deck, and premium amenities. Perfect for a peaceful getaway with modern comforts.",
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"
      ],
      amenities: [
        "WiFi",
        "Lake View",
        "Private Deck",
        "Full Kitchen",
        "Parking",
        "Air Conditioning",
        "Heating",
        "Washer & Dryer",
        "Smart TV",
        "Coffee Machine"
      ],
      house_rules: [
        "No smoking inside the property",
        "No parties or events",
        "Quiet hours: 10 PM - 8 AM",
        "Maximum 4 guests",
        "Check-in after 3 PM",
        "Check-out before 11 AM",
        "Clean up after yourself"
      ],
      check_in_time: "15:00",
      check_out_time: "11:00",
      bedrooms: 2,
      bathrooms: 2,
      max_guests: 4,
      address: {
        street: "123 Lake Shore Drive",
        city: "Lake Village",
        state: "Mountain State",
        country: "Country"
      },
      pricing: {
        base_price: 250,
        currency: "USD"
      }
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: mockPropertyDetails
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in guesty-property-details function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});