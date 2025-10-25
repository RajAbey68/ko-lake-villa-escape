# Gallery Setup Instructions

## ⚠️ CRITICAL: Table Must Be Created First

The `gallery_images` table does not exist in your Supabase database yet.

## Step-by-Step Setup

### 1. Create the Table in Supabase

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your Ko Lake Villa project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Setup SQL**
   - Copy the contents of `FRESH_GALLERY_SETUP.sql`
   - Paste into the SQL Editor
   - Click "Run" or press Cmd+Enter

4. **Verify Success**
   - You should see: "✅ GALLERY SETUP COMPLETE!"
   - Check Table Editor → gallery_images table should exist

### 2. Seed the Gallery with Images

After the table is created, run:

```bash
node setup-and-seed-gallery.cjs
```

This will insert 20 images from `/src/assets` into the gallery.

### 3. View the Gallery

- **User View**: http://localhost:8080/gallery
- **Admin View**: http://localhost:8080/gallery-admin

## What Gets Created

### Database Table: `gallery_images`
- 20 images from src/assets
- 6 featured images (pool, sunset, dining, interior, lake view)
- Categories: pool, views, dining, interior, garden, culture, exterior, villa
- All images ready to display

### Images Included
1. ✨ Ko Lake Pool at Sunset (featured)
2. ✨ Ko Lake Sunset View (featured)
3. ✨ Villa Dining Area (featured)
4. ✨ Villa Interior (featured)
5. ✨ Lake View from Villa (featured)
6. ✨ Villa Pool Area (featured)
7. Front Garden Views (2 images)
8. Koggala Sunset
9. Stilt Fishermen (3 images - local culture)
10. Villa Exterior Views (7 images)
11. Ko Lake Villa overview

## Troubleshooting

### Error: "Could not find table 'gallery_images'"
**Solution**: Run `FRESH_GALLERY_SETUP.sql` in Supabase SQL Editor first

### Error: "Missing Supabase credentials"
**Solution**: Ensure `.env.local` contains:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Gallery shows "No images"
**Solution**: Run `node setup-and-seed-gallery.cjs` to seed the database

## Manual SQL Insert (Alternative)

If the Node script doesn't work, you can also run `seed-gallery-images.sql` directly in Supabase SQL Editor.

---

**Next**: After setup, the gallery will be fully populated and ready for production!
