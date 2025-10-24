#!/bin/bash

SUPABASE_URL="https://zctpyveoakvbrrjmviqg.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdHB5dmVvYWt2YnJyam12aXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNDgyMTMsImV4cCI6MjA3MTcyNDIxM30.rgB4Cy_ktvQ9Dq0KmpX7IrM5vVqZW4HgtwiqulkV3Rg"

echo "🚀 Setting up gallery via Supabase API..."
echo ""

# Step 1: Create storage bucket
echo "📦 Creating storage bucket 'gallery'..."
curl -X POST "${SUPABASE_URL}/storage/v1/bucket" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "gallery",
    "name": "gallery",
    "public": true,
    "file_size_limit": 52428800,
    "allowed_mime_types": ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "video/mp4", "video/webm", "video/quicktime"]
  }'
echo ""
echo ""

# Step 2: Create gallery_images table
echo "📋 Creating gallery_images table..."
curl -X POST "${SUPABASE_URL}/rest/v1/gallery_images" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d '{}'
echo ""
echo ""

# Step 3: Insert sample data
echo "🖼️  Inserting sample images..."
curl -X POST "${SUPABASE_URL}/rest/v1/gallery_images" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '[
    {
      "filename": "pool-sunset.jpg",
      "title": "Infinity Pool at Sunset",
      "description": "Beautiful infinity pool overlooking the lake",
      "category": "pool",
      "media_type": "image",
      "object_path": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200",
      "is_featured": true,
      "display_order": 1
    },
    {
      "filename": "lake-view.jpg",
      "title": "Serene Lake View",
      "description": "Tranquil lake views from the villa",
      "category": "exterior",
      "media_type": "image",
      "object_path": "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200",
      "is_featured": true,
      "display_order": 2
    },
    {
      "filename": "living-room.jpg",
      "title": "Spacious Living Room",
      "description": "Comfortable and modern living space",
      "category": "interior",
      "media_type": "image",
      "object_path": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
      "is_featured": true,
      "display_order": 3
    }
  ]'
echo ""
echo ""

echo "✅ Setup complete!"
echo ""
echo "Verify at:"
echo "  - Storage: https://supabase.com/dashboard/project/zctpyveoakvbrrjmviqg/storage/buckets"
echo "  - Table: https://supabase.com/dashboard/project/zctpyveoakvbrrjmviqg/editor"
echo ""
echo "Test your app:"
echo "  - Upload: /upload route"
echo "  - Gallery: /gallery route"
