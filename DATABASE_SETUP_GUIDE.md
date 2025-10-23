# Database Setup Guide - Ko Lake Villa

## 🚨 Current Issue
Your database is empty! That's why you're seeing:
- "No gallery items available"
- "Failed to load featured amenities"
- "Failed to load resort facilities"
- Multiple error messages on homepage

## ✅ Solution: Run These SQL Scripts in Supabase

### Step 1: Run Schema Migrations
Go to **Supabase Dashboard → SQL Editor** and run this file:
```
supabase/migrations/20251019_fix_schema_mismatches.sql
```

This will:
- Rename `gallery` table to `gallery_images`
- Add all missing columns
- Set up proper RLS policies
- Create storage buckets

### Step 2: Seed the Database
After migrations, run this file:
```
seed-database.sql
```

This will populate:
- ✅ Hero content (2 items)
- ✅ Room types (3 items)
- ✅ Amenities (10 items)
- ✅ Location info (1 item)
- ✅ Gallery images (6 items)
- ✅ Contacts (3 items)

## 📋 Quick Copy-Paste Instructions

### Option A: Use Supabase Dashboard (Recommended)

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy the entire content of `supabase/migrations/20251019_fix_schema_mismatches.sql`
6. Paste and click **Run**
7. Wait for success message
8. Create another **New Query**
9. Copy the entire content of `seed-database.sql`
10. Paste and click **Run**
11. Refresh your app at http://localhost:8080

### Option B: Use CLI (If you have Supabase CLI installed)

```bash
# From project root
supabase db push
supabase db seed
```

## 🔍 Verify It Worked

After running the scripts, check these URLs:
- http://localhost:8080/ - Should show hero content and amenities
- http://localhost:8080/gallery - Should show 6 gallery images
- http://localhost:8080/contact - Should show 3 contact cards
- http://localhost:8080/rooms - Should show 3 room types

## 🎯 What Each Table Does

| Table | Purpose | Records Needed |
|-------|---------|----------------|
| `hero_content` | Homepage hero section | 1-2 active |
| `room_types` | Accommodation listings | 3+ |
| `amenities` | Villa features | 10+ |
| `location_info` | Address & directions | 1 |
| `gallery_images` | Photo/video gallery | 6+ |
| `contacts` | Contact page cards | 3+ |

## 🚀 Next Steps After Seeding

1. **Upload Real Images** - Replace placeholder images via Gallery Admin
2. **Update Content** - Edit text via Admin pages
3. **Add More Gallery Items** - Use `/gallery-admin` to upload photos
4. **Customize Contacts** - Update phone numbers and details
5. **Set Real Prices** - Update room rates in `/rooms-admin`

## 🔧 Troubleshooting

### Still seeing errors after seeding?
1. Check browser console for specific errors
2. Verify Supabase connection in `.env` file
3. Ensure RLS policies are enabled
4. Check that all migrations ran successfully

### Tables exist but still empty?
- The seed script uses `ON CONFLICT DO UPDATE` so it's safe to run multiple times
- Check Supabase Dashboard → Table Editor to verify data

### Images not loading?
- Placeholder images use `/images/` paths
- Upload real images to Supabase Storage via Gallery Admin
- Or update `image_url` fields to use external URLs
