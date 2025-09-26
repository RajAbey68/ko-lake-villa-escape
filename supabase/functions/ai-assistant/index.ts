import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const openAIApiKey = appConfig.OPENAI_API_KEY;
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { message, context = 'general' } = await req.json();
    
    // System prompts for different contexts
    const systemPrompts = {
      general: 'You are a helpful assistant for Ko Lake Villa, a luxury eco-friendly resort. Provide friendly, informative responses about the resort, bookings, and guest services.',
      booking: 'You are a booking assistant for Ko Lake Villa. Help guests with reservations, room availability, pricing, and booking modifications. Always encourage direct contact for complex requests.',
      concierge: 'You are a concierge for Ko Lake Villa. Assist guests with local recommendations, activities, dining, transportation, and any special requests during their stay.',
    };

    const systemPrompt = systemPrompts[context as keyof typeof systemPrompts] || systemPrompts.general;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const generatedResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ response: generatedResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in AI assistant function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});