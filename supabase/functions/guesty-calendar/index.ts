import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

interface CalendarRequest {
  property_id?: string;
  start_date: string;
  end_date: string;
}

interface CalendarDay {
  date: string;
  available: boolean;
  price: number;
  currency: string;
  blocked_reason?: string;
  minimum_stay?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { property_id, start_date, end_date }: CalendarRequest = await req.json();
    
    // Validate inputs
    if (!start_date || !end_date) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: start_date, end_date' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

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

    console.log(`Fetching calendar for property ${property_id || 'default'} from ${start_date} to ${end_date}`);
    
    // Mock implementation - replace with actual Guesty API call
    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);
    const mockCalendar: CalendarDay[] = [];
    
    // Generate mock calendar data
    const currentDate = new Date(startDateObj);
    while (currentDate <= endDateObj) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayOfWeek = currentDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const randomBlock = Math.random() < 0.1; // 10% chance of being blocked
      
      mockCalendar.push({
        date: dateStr,
        available: !randomBlock,
        price: isWeekend ? 300 : 250,
        currency: 'USD',
        blocked_reason: randomBlock ? 'Maintenance' : undefined,
        minimum_stay: 2
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          property_id: property_id || "mock-property-123",
          calendar: mockCalendar
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in guesty-calendar function:', error);
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