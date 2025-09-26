import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Interface for database property data
interface DatabaseProperty {
  id: string;
  title: string;
  nickname?: string;
  description?: string;
  base_price: number;
  currency: string;
  guests_capacity: number;
  min_nights: number;
  max_nights: number;
  booking_url_template?: string;
  pictures?: any;
  amenities?: any;
  last_synced_at: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get properties from database instead of API calls
    console.log('Fetching properties from database...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: properties, error: propertiesError } = await supabase
      .from('public_properties')
      .select(`
        id,
        title,
        nickname,
        description,
        base_price,
        currency,
        guests_capacity,
        min_nights,
        max_nights,
        booking_url_template,
        pictures,
        amenities,
        last_synced_at
      `)
      .order('title');
    
    if (propertiesError) {
      console.error('Database error:', propertiesError);
      throw new Error(`Failed to fetch properties: ${propertiesError.message}`);
    }
    
    if (!properties || properties.length === 0) {
      console.log('No properties found in database');
      return new Response(
        JSON.stringify({ 
          success: true, 
          properties: [],
          message: 'No properties available - sync may be needed'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Format properties for the booking widget
    const formattedProperties = properties.map((property: any) => ({
      id: property.id,
      title: property.title,
      nickname: property.nickname,
      description: property.description,
      basePrice: property.base_price || 199,
      currency: property.currency || 'USD',
      maxGuests: property.guests_capacity || 6,
      minNights: property.min_nights || 1,
      maxNights: property.max_nights || 30,
      bookingUrlTemplate: property.booking_url_template,
      heroImage: property.pictures?.[0]?.original || property.pictures?.[0]?.thumbnail,
      amenities: property.amenities || [],
      lastSynced: property.last_synced_at
    }));

    return new Response(
      JSON.stringify({
        success: true,
        properties: formattedProperties
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in guesty-properties function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch properties',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});