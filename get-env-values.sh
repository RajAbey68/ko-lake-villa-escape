#!/bin/bash

# Script to display environment variable values for Vercel setup
# Run: bash get-env-values.sh

echo "================================================"
echo "📋 COPY THESE VALUES TO VERCEL"
echo "================================================"
echo ""
echo "🔗 Vercel Settings:"
echo "https://vercel.com/rajabey68s-projects/ko-lake-villa-escape/settings/environment-variables"
echo ""
echo "================================================"
echo ""

if [ -f .env.local ]; then
    echo "✅ Found .env.local file"
    echo ""
    
    echo "1️⃣  VITE_SUPABASE_URL"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    grep "^VITE_SUPABASE_URL=" .env.local | cut -d'=' -f2
    echo ""
    
    echo "2️⃣  VITE_SUPABASE_ANON_KEY"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    grep "^VITE_SUPABASE_ANON_KEY=" .env.local | cut -d'=' -f2
    echo ""
    
    echo "3️⃣  VITE_GUESTY_API_KEY (optional)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    grep "^VITE_GUESTY_API_KEY=" .env.local | cut -d'=' -f2
    echo ""
    
    echo "4️⃣  VITE_GUESTY_BASE_URL (optional)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    grep "^VITE_GUESTY_BASE_URL=" .env.local | cut -d'=' -f2
    echo ""
    
    echo "================================================"
    echo "✅ Copy each value above and paste into Vercel"
    echo "================================================"
else
    echo "❌ .env.local file not found!"
    echo "Make sure you're in the project directory."
fi
