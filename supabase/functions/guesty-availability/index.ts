import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders, getCorsHeaders } from '../_shared/cors.ts'
import { syncGuestyProperties, getGuestyToken } from '../_shared/guesty-sync.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface AvailabilityRequest {
  property_id?: string;  // New parameter name
  room_type_id?: string; // Legacy parameter name for compatibility
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
}

interface GuestyProperty {
  id: string;
  title: string;
  nickname?: string;
  prices: {
    basePrice: number;
    currency: string;
  };
}

interface GuestyAvailabilityResponse {
  available: boolean;
  totalPrice?: number;
  currency?: string;
  listingId?: string;
  bookingUrl?: string;
}

// Using imported helper functions from shared sync module

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: getCorsHeaders(req.headers.get('origin') || undefined) });
  }

  try {
    const requestData: AvailabilityRequest = await req.json();
    
    // Support both property_id and room_type_id for backward compatibility
    const property_id = requestData.property_id || requestData.room_type_id;
    const { check_in, check_out, adults, children } = requestData;
    
    // Validate inputs
    if (!property_id || !check_in || !check_out) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: property_id (or room_type_id), check_in, check_out' 
        }),
        { 
          status: 400, 
          headers: { ...getCorsHeaders(req.headers.get('origin') || undefined), 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate date format and logic
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return new Response(
        JSON.stringify({ error: 'Invalid date format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    if (checkInDate < today) {
      return new Response(
        JSON.stringify({ error: 'Check-in date cannot be in the past' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    if (checkOutDate <= checkInDate) {
      return new Response(
        JSON.stringify({ error: 'Check-out must be after check-in' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    // Validate occupancy
    if (adults < 1 || adults > 12 || children < 0 || children > 8) {
      return new Response(
        JSON.stringify({ error: 'Invalid occupancy: adults (1-12), children (0-8)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    // Validate reasonable stay length (max 30 days)
    const stayLength = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    if (stayLength > 30) {
      return new Response(
        JSON.stringify({ error: 'Maximum stay length is 30 days' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    // Get Guesty credentials from environment
    const guestyClientId = Deno.env.get('GUESTY_CLIENT_ID');
    const guestyClientSecret = Deno.env.get('GUESTY_CLIENT_SECRET');
    
    if (!guestyClientId || !guestyClientSecret) {
      console.error('Guesty credentials not found');
      return new Response(
        JSON.stringify({ error: 'Guesty credentials missing' }),
        { 
          status: 500, 
          headers: { ...getCorsHeaders(req.headers.get('origin') || undefined), 'Content-Type': 'application/json' }
        }
      );
    }

    // Sync all properties from Guesty API to database (with TTL check)
    console.log('Syncing properties from Guesty API...');
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    const syncResult = await syncGuestyProperties(
      guestyClientId, 
      guestyClientSecret,
      supabaseUrl,
      supabaseServiceKey
    );
    
    console.log('Sync result:', syncResult);
    
    // Get Supabase client for database queries
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify property exists in our database
    const { data: property, error: propertyError } = await supabase
      .from('guesty_properties')
      .select('id, title, base_price, currency, booking_url_template')
      .eq('id', property_id)
      .eq('is_active', true)
      .single();
    
    if (propertyError || !property) {
      return new Response(
        JSON.stringify({ error: `Property ${property_id} not found or inactive` }),
        { 
          status: 404, 
          headers: { ...getCorsHeaders(req.headers.get('origin') || undefined), 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Get Guesty access token for availability check
    console.log('Getting Guesty access token for availability...');
    const accessToken = await getGuestyToken(guestyClientId, guestyClientSecret);
    
    console.log(`Checking availability for property ${property_id} from ${check_in} to ${check_out}`);
    
    // Check real availability using Guesty Calendar API
    const calendarResponse = await fetch(`https://open-api.guesty.com/v1/availability-pricing/api/calendar/listings/${property_id}?startDate=${check_in}&endDate=${check_out}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    let availabilityData;
    let available = false;
    let totalPrice = null;
    let currency = 'USD';
    let pricePerNight = 0;

    if (calendarResponse.ok) {
      availabilityData = await calendarResponse.json();
      
      // Check if all dates are available
      if (availabilityData.data && Array.isArray(availabilityData.data)) {
        available = availabilityData.data.every((day: any) => day.status === 'available');
        
        // Calculate pricing if available
        if (available) {
          const totalNights = Math.ceil((new Date(check_out).getTime() - new Date(check_in).getTime()) / (1000 * 60 * 60 * 24));
          
          // Get average price from available days
          const availableDays = availabilityData.data.filter((day: any) => day.status === 'available');
          if (availableDays.length > 0) {
            pricePerNight = availableDays.reduce((sum: number, day: any) => sum + (day.price || 0), 0) / availableDays.length;
            totalPrice = pricePerNight * totalNights;
            currency = availableDays[0]?.currency || 'USD';
          }
        }
      }
    } else {
      console.warn(`Calendar API failed for property ${property_id}:`, calendarResponse.status);
      // Don't fail completely - return unavailable instead
      available = false;
    }

    const response: GuestyAvailabilityResponse = {
      available,
      totalPrice: totalPrice || (property.base_price * Math.ceil((new Date(check_out).getTime() - new Date(check_in).getTime()) / (1000 * 60 * 60 * 24))),
      currency: currency || property.currency,
      listingId: property_id,
      bookingUrl: property.booking_url_template ? 
        `${property.booking_url_template}?checkIn=${check_in}&checkOut=${check_out}&adults=${adults}&children=${children}` :
        `https://www.guesty.com/book/${property_id}?checkIn=${check_in}&checkOut=${check_out}&adults=${adults}&children=${children}`
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: response
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in guesty-availability function:', error);
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