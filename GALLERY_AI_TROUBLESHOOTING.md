# Gallery AI Troubleshooting Guide

## Issues Found & Fixes

### Issue 1: Supabase Storage Bucket Missing
**Error:** "Bucket not found" or upload fails
**Fix:** Create the bucket first

```sql
-- In Supabase Dashboard → Storage
1. Click "New Bucket"
2. Name: "gallery"
3. Public: Yes (check the box)
4. Click "Create Bucket"
```

### Issue 2: Storage RLS Policies
**Error:** "new row violates row-level security policy"
**Fix:** Add RLS policies for authenticated users

```sql
-- In Supabase Dashboard → Storage → gallery bucket → Policies

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery');

-- Allow public read access
CREATE POLICY "Public can view gallery"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery');
```

### Issue 3: AI Assistant Context Not Supported
**Error:** AI returns generic response
**Fix:** The AI assistant doesn't have a 'seo' context

**Current code:**
```typescript
context: 'seo'  // ❌ Not defined in ai-assistant function
```

**Should be:**
```typescript
context: 'general'  // ✅ Supported context
```

### Issue 4: OpenAI Vision API Not Used
**Problem:** The current AI assistant uses text-only model (gpt-4o-mini)
**Solution:** Need to enhance the Edge Function to support image analysis

### Issue 5: File Path Issue
**Problem:** Using `gallery/${fileName}` but bucket is already named 'gallery'
**Fix:** Just use `${fileName}` as the path

---

## Quick Fixes to Apply:

### Fix 1: Update AI Context
Change line 148 in AdminGalleryAI.tsx:
```typescript
// FROM:
context: 'seo'

// TO:
context: 'general'
```

### Fix 2: Update File Path
Change line 97 in AdminGalleryAI.tsx:
```typescript
// FROM:
const filePath = `gallery/${fileName}`;

// TO:
const filePath = fileName;
```

### Fix 3: Better Error Handling
Add try-catch around the entire process:
```typescript
const handleProcessUploads = async () => {
  for (let i = 0; i < pendingUploads.length; i++) {
    const upload = pendingUploads[i];
    if (upload.status !== 'pending') continue;

    try {
      const url = await uploadFile(upload, i);
      await analyzeWithAI(url, i);
    } catch (error: any) {
      console.error('Upload error:', error);
      setPendingUploads(prev => {
        const updated = [...prev];
        updated[i] = {
          ...updated[i],
          status: 'error',
          error: error.message || 'Upload failed'
        };
        return updated;
      });
      
      // Show toast for each error
      toast({
        title: `Error processing ${upload.file.name}`,
        description: error.message,
        variant: 'destructive'
      });
    }
  }
};
```

---

## Testing Steps:

### Step 1: Create Storage Bucket
```
1. Supabase Dashboard → Storage
2. New Bucket → "gallery"
3. Public: Yes
4. Create
```

### Step 2: Add RLS Policies
```
1. Storage → gallery → Policies
2. Run the SQL policies above
```

### Step 3: Test Upload
```
1. Admin → Gallery
2. Upload Images/Videos
3. Select 1-2 files
4. Click "Process with AI"
5. Check browser console for errors
```

### Step 4: Check Errors
```
F12 → Console tab
Look for:
- "Bucket not found" → Create bucket
- "RLS policy" → Add policies
- "OpenAI API" → Check API key
- Network errors → Check Supabase connection
```

---

## Alternative: Simplified Version Without Storage

If storage setup is too complex, use URL-based workflow:

1. Upload images to external service (Imgur, Cloudinary, etc.)
2. Get public URLs
3. Paste URLs into gallery admin
4. AI analyzes from URL
5. Save to database

This skips Supabase Storage entirely!

---

## What's Working vs Not Working

### ✅ Working:
- File selection UI
- Multiple file selection
- Preview generation
- Dialog interface
- Table display
- Delete functionality

### ❌ Not Working (Needs Setup):
- Supabase Storage upload (needs bucket + RLS)
- AI image analysis (needs Vision API enhancement)
- Batch processing (depends on above)

### 🔧 Workaround:
Use the **AdminGallerySimple** component instead:
- URL-based (no storage needed)
- Manual metadata entry
- Works immediately
- No AI but functional

---

## Recommended Approach:

**Option A: Fix Storage (15 min)**
1. Create bucket
2. Add RLS policies
3. Test upload
4. AI will work with text-only analysis

**Option B: Use Simple Version (0 min)**
1. Switch back to AdminGallerySimple
2. Use URLs instead of uploads
3. Manual metadata
4. Deploy now, enhance later

**Option C: Hybrid (Best)**
1. Use AdminGallerySimple for now
2. Set up storage bucket in background
3. Enhance AI assistant for vision
4. Switch to AdminGalleryAI when ready

---

## Next Steps:

Which approach do you prefer?
1. Fix the storage setup now?
2. Use simple version and deploy?
3. Hybrid approach?
