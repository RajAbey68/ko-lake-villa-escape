// Production CORS configuration for Ko Lake Villa
const allowedOrigins = [
  'https://kolakevilla.com',
  'https://www.kolakevilla.com',
  'https://ko-lake-villa-cloudflare.tar',
  'http://localhost:8080', // Development
  'http://localhost:5000'  // Development
];

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Will be replaced per request
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

export const getCorsHeaders = (origin?: string) => {
  const allowedOrigin = origin && allowedOrigins.includes(origin) ? origin : 'https://kolakevilla.com';
  return {
    ...corsHeaders,
    'Access-Control-Allow-Origin': allowedOrigin,
  };
}