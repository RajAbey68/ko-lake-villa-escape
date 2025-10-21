# Gallery & Gallery Admin - Local Testing Plan

## Current Status
- **Dev Server:** Running on http://localhost:8084
- **Auth:** Bypassed (BYPASS_AUTH = true)
- **Admin URL:** http://localhost:8084/admin

## Test 1: Gallery Page (Public)
**URL:** http://localhost:8084/gallery

**Expected:**
- Shows grid of villa images
- Images load properly
- Lightbox works when clicking images

**Current Route:** Uses `GalleryPageSimple` (self-contained, hardcoded images)

## Test 2: Gallery Admin
**URL:** http://localhost:8084/admin → Gallery tab

**Component:** `AdminGalleryAI` (from `/src/components/admin/AdminGalleryAI.tsx`)

**Expected Features:**
1. View existing gallery images from database
2. Upload new images (AI-powered metadata)
3. Edit image details
4. Delete images
5. Batch upload support

**Requirements:**
- Supabase storage bucket: `gallery`
- Database table: `gallery_images`
- Environment variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

## Test Steps

### Step 1: Access Admin Panel
```
1. Open: http://localhost:8084/admin
2. Verify: "Testing Mode" banner shows
3. Click: Gallery tab
4. Check: What displays?
```

### Step 2: Check Database Connection
```
1. Does it show existing images?
2. Does it show "loading"?
3. Does it show error message?
```

### Step 3: Test Upload (if accessible)
```
1. Click "Upload" or "Add Image" button
2. Select a test image
3. Verify upload process
4. Check if image appears in gallery
```

## Known Issues to Fix
- [ ] Database might not be seeded
- [ ] Storage bucket might not exist
- [ ] Gallery images table might be empty
- [ ] Upload functionality might need OpenAI API key

## Success Criteria
✅ Gallery page shows images (public)
✅ Gallery Admin loads without errors
✅ Can view existing images in admin
✅ Can upload new images via admin
✅ Uploaded images appear on public gallery page

## Next: Manual Testing Required
**Action:** Open browser and test http://localhost:8084/admin
**Report:** What you see in the Gallery tab
