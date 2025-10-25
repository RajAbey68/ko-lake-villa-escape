#!/bin/bash

# Open Supabase SQL Editor for Gallery Setup
# This script extracts the Supabase URL and opens the SQL Editor

echo "🚀 Opening Supabase SQL Editor..."
echo ""

# Read Supabase URL from .env.local
if [ -f .env.local ]; then
  SUPABASE_URL=$(grep "VITE_SUPABASE_URL" .env.local | cut -d '=' -f2)
  
  if [ -n "$SUPABASE_URL" ]; then
    # Extract project ID from URL (e.g., https://abc123.supabase.co -> abc123)
    PROJECT_ID=$(echo $SUPABASE_URL | sed 's|https://||' | sed 's|.supabase.co||')
    
    SQL_EDITOR_URL="https://supabase.com/dashboard/project/${PROJECT_ID}/sql/new"
    
    echo "📋 Supabase Project: $PROJECT_ID"
    echo "🔗 Opening SQL Editor..."
    echo ""
    echo "INSTRUCTIONS:"
    echo "1. Copy the contents of FRESH_GALLERY_SETUP.sql"
    echo "2. Paste into the SQL Editor that just opened"
    echo "3. Click 'Run' or press Cmd+Enter"
    echo "4. Wait for success message"
    echo "5. Run: node setup-and-seed-gallery.cjs"
    echo ""
    
    # Open in default browser
    open "$SQL_EDITOR_URL"
    
    echo "✅ SQL Editor opened in browser"
  else
    echo "❌ Could not find VITE_SUPABASE_URL in .env.local"
    exit 1
  fi
else
  echo "❌ .env.local file not found"
  exit 1
fi
