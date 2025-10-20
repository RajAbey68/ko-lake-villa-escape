# 🎛️ Admin Console Setup Guide - Ko Lake Villa

**Quick Start:** Get your admin panel working in 5 minutes!

---

## 🚀 Step 1: Populate Database with Placeholders

### **Option A: Via Supabase Dashboard (Easiest)**

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/zctpyveoakvbrrjmviqg/editor
   - Click **"SQL Editor"** in left sidebar

2. **Run the seed script:**
   - Copy ALL contents from `seed-database.sql`
   - Paste into SQL editor
   - Click **"Run"** (or press Cmd/Ctrl + Enter)

3. **Verify:**
   - Should see success messages
   - Check Tables → `hero_content`, `room_types`, etc. should have data

### **Option B: Via Supabase CLI**

```bash
cd /Users/arajiv/CascadeProjects/ko-lake-villa-escape
supabase db reset  # Optional: clear existing data
psql $DATABASE_URL -f seed-database.sql
```

---

## 🔐 Step 2: Access Admin Panel

### **URL:**
```
http://localhost:8080/admin
```

### **If You Get "Access Denied":**

Your admin panel might require authentication. Let me check the auth setup...

**Quick Fix - Disable Auth for Testing:**

Edit `/src/pages/AdminPage.tsx` and temporarily disable auth check:

```typescript
// Comment out this line:
// <AdminGuard>

// And this line:
// </AdminGuard>
```

**Or create an admin user:**

Run in Supabase SQL Editor:
```sql
-- Check if you have auth enabled
SELECT * FROM auth.users LIMIT 1;

-- If empty, sign up at http://localhost:8080/auth
-- Then run this to make user admin:
UPDATE auth.users 
SET raw_user_meta_data = jsonb_build_object('role', 'admin')
WHERE email = 'your-email@example.com';
```

---

## 🎨 Step 3: Using Admin Console

Once logged in, you'll see these sections:

### **📸 Gallery Management**
**Upload your villa images here!**

1. Go to Admin → **Gallery**
2. Click **"Add New Image"**
3. Fill in:
   - **Title:** e.g., "Pool at Sunset"
   - **Description:** Short description
   - **Category:** exterior, interior, pool, bedroom, dining, etc.
   - **Image URL:** Upload to Supabase Storage or use external URL
   - **Featured:** Check for homepage gallery

**How to upload images:**

**Method 1: Supabase Storage (Recommended)**
```
1. Supabase Dashboard → Storage
2. Create bucket: "villa-images" (public)
3. Upload your images
4. Copy public URL
5. Paste into Admin Gallery form
```

**Method 2: External URL**
```
- Upload to Imgur, Cloudinary, or your own server
- Copy direct image URL
- Paste into Admin Gallery form
```

### **🏠 Hero Content**
Edit homepage hero section:
- Main title and subtitle
- Call-to-action text
- Background image
- Multiple hero slides

### **🛏️ Room Types**
Manage accommodation listings:
- Room name, description, capacity
- Pricing (direct + Airbnb comparison)
- Room images (comma-separated URLs)
- Amenities list
- Availability toggle

### **✨ Amenities**
Add/edit villa features:
- Amenity name and description
- Icon (uses Lucide React icons)
- Category grouping
- Featured toggle

### **📍 Location Info**
Update location details:
- Address and coordinates
- Google Maps link
- Directions
- Nearby attractions

### **📊 Analytics**
View booking statistics and contact submissions

---

## 📸 Step 4: Upload Your Real Images

### **Recommended Image Sizes:**

```
Hero Images:     1920x1080px (landscape)
Gallery Images:  1200x800px (landscape)
Room Images:     1200x800px (landscape/square)
Thumbnails:      400x300px
Logo:            500x200px (transparent PNG)
```

### **Image Upload Workflow:**

1. **Prepare images:**
   - Resize and optimize (use TinyPNG.com)
   - Name clearly: `pool-sunset.jpg`, `master-bedroom.jpg`

2. **Upload to Supabase Storage:**
   ```
   Dashboard → Storage → Create bucket "villa-images"
   Set to PUBLIC
   Upload your images
   ```

3. **Get URLs:**
   - Click image → Copy URL
   - Should look like: `https://zctpyveoakvbrrjmviqg.supabase.co/storage/v1/object/public/villa-images/pool-sunset.jpg`

4. **Add via Admin:**
   - Admin → Gallery → Add New
   - Paste URL into Image URL field
   - Fill in title, description, category
   - Save

---

## 🎯 Quick Test Checklist

After seeding database:

- [ ] Visit http://localhost:8080 - Should show hero with placeholder
- [ ] See "Our Luxury Accommodations" section with 3 rooms
- [ ] Gallery section shows 6 placeholder images
- [ ] Amenities section displays features
- [ ] Location section shows map and info
- [ ] Visit http://localhost:8080/admin - Admin panel loads
- [ ] Admin → Gallery - Can see/add images
- [ ] Admin → Room Types - Can edit rooms

---

## 🐛 Troubleshooting

### **"Failed to load" errors persist:**
```bash
# Check if seed script ran successfully
# In Supabase SQL Editor:
SELECT COUNT(*) FROM hero_content;
SELECT COUNT(*) FROM room_types;
SELECT COUNT(*) FROM amenities;
SELECT COUNT(*) FROM gallery_images;

# Should all return > 0
```

### **Admin panel shows blank:**
- Check browser console (F12) for errors
- Verify you're logged in at `/auth`
- Try disabling AdminGuard temporarily

### **Images not showing:**
- Check image URLs are correct
- Verify Supabase Storage bucket is PUBLIC
- Check browser console for 404 errors
- Try using placeholder: `https://placehold.co/1200x800`

### **"Unauthorized" errors:**
```sql
-- Make your user an admin:
UPDATE auth.users 
SET raw_user_meta_data = jsonb_build_object('role', 'admin')
WHERE email = 'your-email@example.com';
```

---

## 📋 Image Upload Batch Script

Once you have multiple images, use this to batch upload:

```bash
#!/bin/bash
# upload-images.sh

BUCKET="villa-images"
PROJECT_ID="zctpyveoakvbrrjmviqg"

for img in images/*.jpg; do
  filename=$(basename "$img")
  echo "Uploading $filename..."
  
  # Upload to Supabase Storage
  curl -X POST \
    "https://$PROJECT_ID.supabase.co/storage/v1/object/$BUCKET/$filename" \
    -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
    -H "Content-Type: image/jpeg" \
    --data-binary "@$img"
  
  echo "✓ Uploaded: https://$PROJECT_ID.supabase.co/storage/v1/object/public/$BUCKET/$filename"
done
```

---

## 🎉 Next Steps

1. ✅ **Run seed script** - Get placeholder content
2. ✅ **Test site** - Verify everything loads
3. ✅ **Access admin** - Log in and explore
4. 📸 **Upload images** - Replace placeholders with real photos
5. ✏️ **Edit content** - Customize text, pricing, descriptions
6. 🚀 **Deploy** - Push to production when ready

---

## 📞 Quick Commands Reference

```bash
# Check if database has data
psql $DATABASE_URL -c "SELECT COUNT(*) FROM gallery_images;"

# Access Supabase Dashboard
open https://supabase.com/dashboard/project/zctpyveoakvbrrjmviqg

# Restart dev server
cd /Users/arajiv/CascadeProjects/ko-lake-villa-escape
npm run dev

# Access admin panel
open http://localhost:8080/admin
```

---

**Ready to populate your database? Run the seed script and your site will come to life!** 🎉
