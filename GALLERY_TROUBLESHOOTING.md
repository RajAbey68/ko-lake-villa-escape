# 🔧 Gallery Troubleshooting Guide

## Issue: "Error loading gallery. Please try again later."

### Possible Causes:

1. **Empty Database Table**
   - The `gallery_images` table has no data
   - Solution: Upload images via Admin Gallery

2. **Supabase Connection Issue**
   - API keys not configured
   - RLS policies blocking access
   - Network connection problem

3. **Table Schema Mismatch**
   - Missing columns in database
   - Incorrect column names

---

## ✅ Quick Fixes:

### Fix 1: Check Browser Console
1. Open browser DevTools (F12 or Cmd+Option+I)
2. Go to Console tab
3. Look for errors starting with "Gallery fetch error:"
4. Share the error message

### Fix 2: Upload Test Images
1. Go to http://localhost:8080/
2. Click "Staff" button
3. Click "Gallery" tab
4. Click "Add Gallery Item"
5. Upload a test image
6. Fill in title and click "Create Gallery Item"
7. Go back to Gallery page and refresh

### Fix 3: Check Supabase Connection
```bash
# Check if Supabase is configured
cat .env.local | grep SUPABASE
```

Should show:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Fix 4: Verify Table Exists
1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Look for `gallery_images` table
4. Check if it has these columns:
   - id
   - title
   - description
   - object_path
   - media_type
   - is_featured
   - display_order
   - created_at
   - updated_at

---

## 🔍 Debug Steps:

### Step 1: Check Console Logs
After the fix, you should see:
```
Gallery items fetched: 0
```
or
```
Gallery items fetched: 5
```

If you see:
```
Gallery fetch error: [error details]
```
Then there's a database/connection issue.

### Step 2: Test with Mock Data
If database is the issue, we can temporarily use mock data:

```typescript
// In Gallery.tsx, replace useGallery() with:
const mockData = [
  {
    id: '1',
    title: 'Pool View',
    description: 'Beautiful pool at sunset',
    object_path: '/src/assets/PoolSunset.jpg',
    media_type: 'image',
    is_featured: true,
    display_order: 0,
    category: 'villa',
    filename: 'pool.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const { data: galleryItems = mockData, isLoading: loading, error } = useGallery();
```

### Step 3: Check RLS Policies
The `gallery_images` table needs these RLS policies:

**SELECT (Read):**
```sql
-- Allow public read access
CREATE POLICY "Allow public read access"
ON gallery_images
FOR SELECT
TO public
USING (true);
```

**INSERT/UPDATE/DELETE (Write):**
```sql
-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert"
ON gallery_images
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update"
ON gallery_images
FOR UPDATE
TO authenticated
USING (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated delete"
ON gallery_images
FOR DELETE
TO authenticated
USING (true);
```

---

## 📊 Expected Behavior:

### When Table is Empty:
```
Gallery
Discover the beauty of Ko Lake Villa...

No gallery items available.
Check back soon for beautiful images and videos!
```

### When Table Has Data:
```
Gallery
Discover the beauty of Ko Lake Villa...

[Grid of images/videos]
```

### When There's an Error:
```
Gallery
Error loading gallery. Please try again later.
[Error message]
[Reload Page button]
```

---

## 🚀 Next Steps:

1. **Check browser console** for error details
2. **Upload a test image** via Admin Gallery
3. **Refresh the Gallery page**
4. **Share console errors** if issue persists

---

## 💡 Common Errors:

### Error: "relation 'gallery_images' does not exist"
**Solution:** Run database migrations
```bash
cd supabase
supabase db reset
```

### Error: "permission denied for table gallery_images"
**Solution:** Check RLS policies (see Step 3 above)

### Error: "Failed to fetch"
**Solution:** Check Supabase URL and API keys in `.env.local`

---

**Current Status:** Error handling improved with console logging and reload button.
