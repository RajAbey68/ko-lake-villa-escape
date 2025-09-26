import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const requestBody = await req.json();
    const { 
      checkIn, 
      checkOut, 
      guests, 
      guestName, 
      guestEmail, 
      guestPhone,
      specialRequests,
      sendToGuesty = false 
    } = requestBody;
    
    // Enhanced validation logic with comprehensive checks
    const validateBookingRequest = (data: any): { isValid: boolean; errors: string[] } => {
      const errors: string[] = [];
      
      // Basic structure validation
      if (!data || typeof data !== 'object') {
        errors.push('Request data must be an object');
        return { isValid: false, errors };
      }
      
      // Date validation
      if (!data.checkIn || !data.checkOut) {
        errors.push('Check-in and check-out dates are required');
      } else {
        try {
          const checkInDate = new Date(data.checkIn);
          const checkOutDate = new Date(data.checkOut);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          // Validate date objects
          if (isNaN(checkInDate.getTime())) {
            errors.push('Invalid check-in date format');
          } else if (checkInDate < today) {
            errors.push('Check-in date cannot be in the past');
          }
          
          if (isNaN(checkOutDate.getTime())) {
            errors.push('Invalid check-out date format');
          } else if (checkOutDate <= checkInDate) {
            errors.push('Check-out date must be after check-in date');
          }
          
          // Check for reasonable booking duration (max 30 days)
          if (checkOutDate.getTime() - checkInDate.getTime() > 30 * 24 * 60 * 60 * 1000) {
            errors.push('Booking duration cannot exceed 30 days');
          }
        } catch (dateError) {
          errors.push('Invalid date format provided');
        }
      }
      
      // Guest count validation
      if (!data.guests || typeof data.guests !== 'number') {
        errors.push('Guest count must be a number');
      } else if (!Number.isInteger(data.guests) || data.guests < 1 || data.guests > 20) {
        errors.push('Guest count must be between 1 and 20');
      }
      
      // Guest name validation
      if (!data.guestName || typeof data.guestName !== 'string') {
        errors.push('Guest name is required and must be a string');
      } else {
        const trimmedName = data.guestName.trim();
        if (trimmedName.length < 2) {
          errors.push('Guest name must be at least 2 characters');
        } else if (trimmedName.length > 100) {
          errors.push('Guest name must be less than 100 characters');
        } else if (!/^[a-zA-Z\s\-'\.]+$/.test(trimmedName)) {
          errors.push('Guest name contains invalid characters');
        }
      }
      
      // Email validation
      if (!data.guestEmail || typeof data.guestEmail !== 'string') {
        errors.push('Valid email address is required');
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.guestEmail)) {
          errors.push('Invalid email format');
        } else if (data.guestEmail.length > 254) {
          errors.push('Email address too long');
        }
      }
      
      // Phone validation (optional)
      if (data.guestPhone) {
        if (typeof data.guestPhone !== 'string') {
          errors.push('Phone number must be a string');
        } else {
          const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,20}$/;
          if (!phoneRegex.test(data.guestPhone)) {
            errors.push('Invalid phone number format (7-20 digits, +, spaces, hyphens, parentheses allowed)');
          }
        }
      }
      
      // Special requests validation (optional)
      if (data.specialRequests && typeof data.specialRequests !== 'string') {
        errors.push('Special requests must be a string');
      } else if (data.specialRequests && data.specialRequests.length > 1000) {
        errors.push('Special requests must be less than 1000 characters');
      }
      
      return { isValid: errors.length === 0, errors };
    };
    
    // Validate the booking request
    const validation = validateBookingRequest(requestBody);
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ 
          error: 'Validation failed', 
          details: validation.errors 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Store booking request in Supabase
    const { data: booking, error: bookingError } = await supabase
      .from('booking_requests')
      .insert({
        check_in: checkIn,
        check_out: checkOut,
        guests_count: guests,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        special_requests: specialRequests,
        status: 'pending'
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Booking storage error:', bookingError);
      throw bookingError;
    }

    let guestyResponse = null;

    // Enhanced Guesty API integration with improved error handling
    if (sendToGuesty && appConfig.GUESTY_API_KEY) {
      try {
        console.log('Attempting to send booking to Guesty API');
        
        const guestyPayload = {
          listingId: appConfig.GUESTY_LISTING_ID,
          checkIn,
          checkOut,
          guest: {
            fullName: guestName,
            email: guestEmail,
            phone: guestPhone || null
          },
          occupancy: {
            numberOfGuests: guests
          },
          specialRequests: specialRequests || null,
          source: 'Ko Lake Villa Website'
        };

        // Validate Guesty payload
        if (!appConfig.GUESTY_LISTING_ID) {
          throw new Error('GUESTY_LISTING_ID not configured');
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const guestyApiResponse = await fetch(`${appConfig.GUESTY_BASE_URL || 'https://api.guesty.com/v1'}/bookings`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${appConfig.GUESTY_API_KEY}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Ko-Lake-Villa-API/1.0'
          },
          body: JSON.stringify(guestyPayload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (guestyApiResponse.ok) {
          guestyResponse = await guestyApiResponse.json();
          console.log(`Successfully created Guesty booking: ${guestyResponse._id}`);
          
          // Update booking with Guesty ID
          const { error: updateError } = await supabase
            .from('booking_requests')
            .update({ 
              guesty_booking_id: guestyResponse._id,
              status: 'sent_to_guesty'
            })
            .eq('id', booking.id);

          if (updateError) {
            console.error('Failed to update booking with Guesty ID:', updateError);
          }
        } else {
          const errorData = await guestyApiResponse.json().catch(() => ({}));
          throw new Error(`Guesty API responded with ${guestyApiResponse.status}: ${errorData.message || guestyApiResponse.statusText}`);
        }
      } catch (guestyError) {
        console.error('Guesty API integration error:', guestyError);
        
        // Update booking status to indicate Guesty failure
        try {
          await supabase
            .from('booking_requests')
            .update({ 
              status: 'guesty_failed',
              special_requests: `${specialRequests || ''}\n\nGuesty Error: ${guestyError.message}`.trim()
            })
            .eq('id', booking.id);
        } catch (updateError) {
          console.error('Failed to update booking status after Guesty error:', updateError);
        }
        
        // Continue without failing - booking is still stored locally
      }
    }

    // Send notification email (if configured)
    if (appConfig.SENDGRID_API_KEY) {
      try {
        await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${appConfig.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{
              to: [{ email: appConfig.NOTIFICATION_EMAIL || 'admin@kolakevilla.com' }],
              subject: 'New Booking Request - Ko Lake Villa'
            }],
            from: { email: appConfig.FROM_EMAIL || 'noreply@kolakevilla.com' },
            content: [{
              type: 'text/html',
              value: `
                <h2>New Booking Request</h2>
                <p><strong>Guest:</strong> ${guestName}</p>
                <p><strong>Email:</strong> ${guestEmail}</p>
                <p><strong>Phone:</strong> ${guestPhone || 'Not provided'}</p>
                <p><strong>Check-in:</strong> ${checkIn}</p>
                <p><strong>Check-out:</strong> ${checkOut}</p>
                <p><strong>Guests:</strong> ${guests}</p>
                <p><strong>Special Requests:</strong> ${specialRequests || 'None'}</p>
                ${guestyResponse ? `<p><strong>Guesty ID:</strong> ${guestyResponse._id}</p>` : ''}
              `
            }]
          })
        });
      } catch (emailError) {
        console.error('Email notification error:', emailError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        bookingId: booking.id,
        guestyBooking: guestyResponse 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing booking:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});