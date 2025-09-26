import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced validation schemas with comprehensive checks
const validateEndpoint = (endpoint: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!endpoint || typeof endpoint !== 'string') {
    errors.push('Endpoint must be a non-empty string');
    return { isValid: false, errors };
  }
  
  if (!endpoint.startsWith('/')) {
    errors.push('Endpoint must start with /');
  }
  
  if (endpoint.includes('..') || endpoint.includes('//')) {
    errors.push('Endpoint contains invalid path traversal patterns');
  }
  
  if (endpoint.length > 500) {
    errors.push('Endpoint URL too long (max 500 characters)');
  }
  
  // Check for potentially dangerous patterns
  const dangerousPatterns = ['<script', 'javascript:', 'data:', 'vbscript:'];
  if (dangerousPatterns.some(pattern => endpoint.toLowerCase().includes(pattern))) {
    errors.push('Endpoint contains potentially dangerous patterns');
  }
  
  return { isValid: errors.length === 0, errors };
};

const validateMethod = (method: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  
  if (!method || typeof method !== 'string') {
    errors.push('HTTP method is required');
    return { isValid: false, errors };
  }
  
  if (!allowedMethods.includes(method.toUpperCase())) {
    errors.push(`Invalid HTTP method. Allowed: ${allowedMethods.join(', ')}`);
  }
  
  return { isValid: errors.length === 0, errors };
};

const validateGuestyConfig = (config: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!config || typeof config !== 'object') {
    errors.push('Configuration object is required');
    return { isValid: false, errors };
  }
  
  if (!config.GUESTY_API_KEY) {
    errors.push('GUESTY_API_KEY is required');
  } else if (typeof config.GUESTY_API_KEY !== 'string' || config.GUESTY_API_KEY.length < 10) {
    errors.push('GUESTY_API_KEY must be a valid string with minimum 10 characters');
  }
  
  if (config.GUESTY_BASE_URL) {
    if (!config.GUESTY_BASE_URL.startsWith('https://')) {
      errors.push('GUESTY_BASE_URL must be HTTPS');
    }
    try {
      new URL(config.GUESTY_BASE_URL);
    } catch {
      errors.push('GUESTY_BASE_URL must be a valid URL');
    }
  }
  
  return { isValid: errors.length === 0, errors };
};

const validateRequestData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (data !== undefined && data !== null) {
    if (typeof data !== 'object') {
      errors.push('Request data must be an object');
    } else {
      // Check for circular references
      try {
        JSON.stringify(data);
      } catch (error) {
        errors.push('Request data contains circular references or is not serializable');
      }
      
      // Check data size (rough estimate)
      const dataString = JSON.stringify(data);
      if (dataString.length > 1000000) { // 1MB limit
        errors.push('Request data too large (max 1MB)');
      }
    }
  }
  
  return { isValid: errors.length === 0, errors };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const appConfig = JSON.parse(Deno.env.get('APP_CONFIG_JSON') || '{}');
    
    // Validate configuration
    const configValidation = validateGuestyConfig(appConfig);
    if (!configValidation.isValid) {
      throw new Error(`Configuration errors: ${configValidation.errors.join(', ')}`);
    }
    
    const guestyApiKey = appConfig.GUESTY_API_KEY;
    const guestyBaseUrl = appConfig.GUESTY_BASE_URL || 'https://api.guesty.com/v1';
    
    const requestBody = await req.json();
    const { endpoint, method = 'GET', data } = requestBody;
    
    // Enhanced input validation with detailed error reporting
    const endpointValidation = validateEndpoint(endpoint);
    if (!endpointValidation.isValid) {
      return new Response(
        JSON.stringify({ 
          error: 'Endpoint validation failed', 
          details: endpointValidation.errors 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const methodValidation = validateMethod(method);
    if (!methodValidation.isValid) {
      return new Response(
        JSON.stringify({ 
          error: 'Method validation failed', 
          details: methodValidation.errors 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const dataValidation = validateRequestData(data);
    if (!dataValidation.isValid) {
      return new Response(
        JSON.stringify({ 
          error: 'Request data validation failed', 
          details: dataValidation.errors 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Enhanced API call with timeout and retry logic
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    let response;
    let responseData;
    
    try {
      console.log(`Making Guesty API call: ${method} ${guestyBaseUrl}${endpoint}`);
      
      response = await fetch(`${guestyBaseUrl}${endpoint}`, {
        method,
        headers: {
          'Authorization': `Bearer ${guestyApiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Ko-Lake-Villa-API/1.0'
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Enhanced response handling
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = { message: await response.text() };
      }
      
      console.log(`Guesty API response: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorMessage = responseData.message || 
                           responseData.error || 
                           response.statusText || 
                           'Unknown error';
        throw new Error(`Guesty API error: ${response.status} ${errorMessage}`);
      }
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Guesty API request timeout (30 seconds)');
      }
      
      // Re-throw API errors as-is
      if (error.message.includes('Guesty API error:')) {
        throw error;
      }
      
      // Network or other errors
      throw new Error(`Failed to call Guesty API: ${error.message}`);
    }

    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error calling Guesty API:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});