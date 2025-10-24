# 🚀 Gallery Quick Start - Brand New Deployment

## Step 1: Setup Database (2 minutes)

1. Open Supabase SQL Editor:
   ```
   https://supabase.com/dashboard/project/zctpyveoakvbrrjmviqg/sql/new
   ```

2. Copy/paste entire contents of: **FRESH_GALLERY_SETUP.sql**

3. Click **Run**

4. Wait for success message ✅

## Step 2: Upload Images/Videos

### Option A: Admin Interface (Recommended)
1. Go to: `http://localhost:8082/gallery-admin`
2. Click **"Add Gallery Item"**
3. Choose upload method:
   - **Upload File** tab: Drag & drop or click to browse
   - **Enter URL** tab: Paste external image/video URL
4. Fill in:
   - Title (required)
   - Description (optional)
   - Media Type: Image or Video
   - Display Order: 0, 1, 2, etc.
   - Toggle "Featured" if special
5. Click **Create Gallery Item**
6. Repeat for more images/videos

### Option B: Direct Upload Page
1. Go to: `http://localhost:8082/upload`
2. Drag & drop files
3. Files auto-upload to storage
4. Then add metadata via Admin interface

## Step 3: View Gallery

1. Go to: `http://localhost:8082/gallery`
2. See your uploaded images/videos in grid
3. Click any item to open lightbox
4. Navigate with arrow buttons

## 🎯 Routes

| URL | Purpose |
|-----|---------|
| `/gallery` | Public gallery view |
| `/gallery-admin` | Upload & manage images/videos |
| `/upload` | Direct file upload test page |

## 📦 What Gets Created

**Storage Bucket:**
- Name: `gallery`
- Public: Yes
- Max size: 50MB per file
- Accepts: JPG, PNG, GIF, WebP, MP4, WebM, QuickTime

**Database Table:**
- Name: `gallery_images`
- Empty initially
- Ready for your uploads

## 🖼️ Supported Media

**Images:**
- JPEG, JPG, PNG, GIF, WebP
- Displays in grid with hover effects
- Lightbox view with navigation

**Videos:**
- MP4, WebM, QuickTime
- Shows thumbnail with play button
- Full-screen playback in lightbox

## ✨ Features

- ✅ Drag & drop upload
- ✅ URL input for external media
- ✅ Featured item badges
- ✅ Display order control
- ✅ Edit/Delete functionality
- ✅ Responsive grid layout
- ✅ Lightbox with prev/next
- ✅ Video playback support

## 🔒 Security Note

Current setup has **OPEN policies** for easy testing:
- Anyone can upload
- Anyone can view
- Anyone can edit/delete

**Before production**, tighten policies in Supabase dashboard to require authentication.

## 🐛 Troubleshooting

**"Could not find table gallery_images"**
- Run FRESH_GALLERY_SETUP.sql in Supabase SQL Editor

**"Bucket not found"**
- Check storage bucket exists: https://supabase.com/dashboard/project/zctpyveoakvbrrjmviqg/storage/buckets
- Re-run FRESH_GALLERY_SETUP.sql

**Upload fails**
- Check file size < 50MB
- Check file type is supported
- Check browser console for errors

**Gallery shows empty**
- Upload at least one image via /gallery-admin
- Check gallery_images table has records

## 📝 File Structure

```
src/
├── components/
│   ├── Gallery.tsx              ← User gallery display
│   └── admin/
│       └── AdminGallery.tsx     ← Upload & management
├── hooks/
│   └── useGallery.ts            ← Data fetching
└── pages/
    ├── GalleryPage.tsx          ← Routes /gallery & /gallery-admin
    └── DirectImageUpload.tsx    ← Test upload at /upload
```

## ✅ Checklist

- [ ] Run FRESH_GALLERY_SETUP.sql in Supabase
- [ ] Visit /gallery-admin
- [ ] Upload first image
- [ ] Check it appears in /gallery
- [ ] Upload a video
- [ ] Test lightbox navigation
- [ ] Mark some items as Featured
- [ ] Test Edit/Delete functions

---

**Ready to go! Start uploading your images and videos! 🎉**
