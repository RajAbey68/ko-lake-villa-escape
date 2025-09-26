import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

interface TestRequest {
  endpoint?: string;
  test_type: 'auth' | 'api';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { endpoint = 'properties', test_type }: TestRequest = await req.json();
    
    console.log(`Testing Guesty API - Type: ${test_type}, Endpoint: ${endpoint}`);

    // Get Guesty configuration
    const appConfigJson = Deno.env.get('APP_CONFIG_JSON');
    if (!appConfigJson) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'APP_CONFIG_JSON environment variable not found',
          message: 'Guesty configuration is missing'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    let appConfig;
    try {
      appConfig = JSON.parse(appConfigJson);
    } catch (parseError) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid APP_CONFIG_JSON format',
          message: 'Configuration JSON is malformed'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const guestyConfig = appConfig.guesty;
    
    if (!guestyConfig?.api_key || !guestyConfig?.base_url) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Incomplete Guesty configuration',
          message: 'API key or base URL missing in configuration'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Test authentication only
    if (test_type === 'auth') {
      try {
        const authResponse = await fetch(`${guestyConfig.base_url}/accounts`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${guestyConfig.api_key}`,
            'Content-Type': 'application/json'
          }
        });

        if (authResponse.ok) {
          return new Response(
            JSON.stringify({
              success: true,
              message: 'Authentication successful',
              status: authResponse.status,
              endpoint: '/accounts'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        } else {
          const errorText = await authResponse.text();
          return new Response(
            JSON.stringify({
              success: false,
              error: `Authentication failed: ${authResponse.status}`,
              message: errorText,
              status: authResponse.status
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      } catch (fetchError) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Network error during authentication',
            message: fetchError.message
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Test full API endpoint
    if (test_type === 'api') {
      try {
        const apiResponse = await fetch(`${guestyConfig.base_url}/${endpoint}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${guestyConfig.api_key}`,
            'Content-Type': 'application/json'
          }
        });

        if (apiResponse.ok) {
          const responseData = await apiResponse.json();
          return new Response(
            JSON.stringify({
              success: true,
              message: `API endpoint /${endpoint} accessible`,
              status: apiResponse.status,
              endpoint: `/${endpoint}`,
              data: responseData
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        } else {
          const errorText = await apiResponse.text();
          return new Response(
            JSON.stringify({
              success: false,
              error: `API call failed: ${apiResponse.status}`,
              message: errorText,
              status: apiResponse.status,
              endpoint: `/${endpoint}`
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      } catch (fetchError) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Network error during API call',
            message: fetchError.message,
            endpoint: `/${endpoint}`
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Invalid test type',
        message: 'test_type must be either "auth" or "api"'
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in guesty-api-test function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});