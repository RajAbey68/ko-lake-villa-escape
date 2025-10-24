#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Ko Lake Villa - Gallery Setup Verification"
echo "=============================================="
echo ""

# Load environment variables
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

SUPABASE_URL="${VITE_SUPABASE_URL}"
ANON_KEY="${VITE_SUPABASE_ANON_KEY}"

if [ -z "$SUPABASE_URL" ] || [ -z "$ANON_KEY" ]; then
    echo -e "${RED}❌ Missing Supabase credentials${NC}"
    echo "Please check .env.local file"
    exit 1
fi

echo -e "${GREEN}✅ Supabase credentials loaded${NC}"
echo "URL: $SUPABASE_URL"
echo ""

# Check if gallery_images table exists
echo "📋 Checking gallery_images table..."
RESPONSE=$(curl -s -X GET "${SUPABASE_URL}/rest/v1/gallery_images?limit=1" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}")

if echo "$RESPONSE" | grep -q "relation.*does not exist\|Could not find"; then
    echo -e "${RED}❌ gallery_images table does not exist${NC}"
    echo ""
    echo -e "${YELLOW}📝 MANUAL FIX REQUIRED:${NC}"
    echo "1. Go to: https://supabase.com/dashboard/project/zctpyveoakvbrrjmviqg/sql/new"
    echo "2. Copy and paste the contents of: COMPLETE_SETUP.sql"
    echo "3. Click 'Run'"
    echo ""
    echo "Or run migrations:"
    echo "  supabase db push"
    exit 1
else
    echo -e "${GREEN}✅ gallery_images table exists${NC}"
    
    # Count records
    COUNT=$(echo "$RESPONSE" | grep -o '"id"' | wc -l | tr -d ' ')
    echo "   Records: $COUNT"
fi

echo ""

# Check storage bucket
echo "📦 Checking gallery storage bucket..."
BUCKET_RESPONSE=$(curl -s -X GET "${SUPABASE_URL}/storage/v1/bucket/gallery" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}")

if echo "$BUCKET_RESPONSE" | grep -q "Bucket not found\|error"; then
    echo -e "${YELLOW}⚠️  gallery bucket does not exist${NC}"
    echo ""
    echo -e "${YELLOW}📝 MANUAL FIX REQUIRED:${NC}"
    echo "1. Go to: https://supabase.com/dashboard/project/zctpyveoakvbrrjmviqg/storage/buckets"
    echo "2. Click 'New bucket'"
    echo "3. Name: gallery"
    echo "4. Make it public"
    echo ""
    echo "Or run the SQL from COMPLETE_SETUP.sql in the SQL Editor"
else
    echo -e "${GREEN}✅ gallery bucket exists${NC}"
fi

echo ""
echo "=============================================="
echo ""

# Summary
if echo "$RESPONSE" | grep -q "relation.*does not exist\|Could not find"; then
    echo -e "${RED}❌ SETUP INCOMPLETE${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run COMPLETE_SETUP.sql in Supabase SQL Editor"
    echo "2. Or run: supabase db push (if migrations are synced)"
    echo "3. Then test at: /gallery and /gallery-admin"
else
    echo -e "${GREEN}✅ GALLERY SYSTEM READY!${NC}"
    echo ""
    echo "Test your gallery:"
    echo "  • User view: /gallery"
    echo "  • Admin view: /gallery-admin"
    echo ""
    echo "Components:"
    echo "  • Gallery.tsx - User-facing gallery with lightbox"
    echo "  • AdminGallery.tsx - Full CRUD admin interface"
    echo "  • useGallery.ts - Data hooks for images & videos"
fi

echo ""
