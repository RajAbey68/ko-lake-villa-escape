import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GuestyBooking {
  _id: string;
  status: string;
  checkIn: string;
  checkOut: string;
  guest: {
    fullName: string;
    email: string;
    phone?: string;
  };
  occupancy: {
    numberOfGuests: number;
  };
  money: {
    finalPrice: number;
  };
  specialRequests?: string;
}

// Validation functions
const validateGuestyBooking = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data._id || typeof data._id !== 'string') {
    errors.push('Invalid or missing booking ID');
  }
  
  if (!data.status || typeof data.status !== 'string') {
    errors.push('Invalid or missing booking status');
  }
  
  if (!data.checkIn || !data.checkOut) {
    errors.push('Check-in and check-out dates are required');
  }
  
  if (!data.guest || !data.guest.fullName || !data.guest.email) {
    errors.push('Guest information (name and email) is required');
  }
  
  if (data.guest?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.guest.email)) {
    errors.push('Invalid guest email format');
  }
  
  if (!data.occupancy || !data.occupancy.numberOfGuests || data.occupancy.numberOfGuests < 1) {
    errors.push('Valid guest count is required');
  }
  
  if (!data.money || typeof data.money.finalPrice !== 'number' || data.money.finalPrice < 0) {
    errors.push('Valid final price is required');
  }
  
  return { isValid: errors.length === 0, errors };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const appConfig = JSON.parse(Deno.env.get('APP_CONFIG_JSON') || '{}');
    const supabaseUrl = 'https://zctpyveoakvbrrjmviqg.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdHB5dmVvYWt2YnJyam12aXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNDgyMTMsImV4cCI6MjA3MTcyNDIxM30.rgB4Cy_ktvQ9Dq0KmpX7IrM5vVqZW4HgtwiqulkV3Rg';
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    const guestyData: GuestyBooking = await req.json();
    
    // Validate the incoming Guesty booking data
    const validation = validateGuestyBooking(guestyData);
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid Guesty booking data', 
          details: validation.errors 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Map Guesty booking to our database structure
    const bookingData = {
      guesty_booking_id: guestyData._id,
      booking_status: guestyData.status,
      check_in: guestyData.checkIn,
      check_out: guestyData.checkOut,
      guest_name: guestyData.guest.fullName,
      guest_email: guestyData.guest.email,
      guest_phone: guestyData.guest.phone || null,
      guests_count: guestyData.occupancy.numberOfGuests,
      total_amount: guestyData.money.finalPrice,
      special_requests: guestyData.specialRequests || null,
    };

    // Check if booking already exists
    const { data: existingBooking } = await supabase
      .from('bookings')
      .select('id')
      .eq('guesty_booking_id', guestyData._id)
      .single();

    let result;
    if (existingBooking) {
      // Update existing booking
      result = await supabase
        .from('bookings')
        .update(bookingData)
        .eq('guesty_booking_id', guestyData._id);
    } else {
      // Insert new booking
      result = await supabase
        .from('bookings')
        .insert(bookingData);
    }

    if (result.error) {
      console.error('Supabase error:', result.error);
      throw result.error;
    }

    return new Response(
      JSON.stringify({ success: true, action: existingBooking ? 'updated' : 'created' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing Guesty webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});