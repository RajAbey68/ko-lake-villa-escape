# Check Supabase Connection from Browser

## Current Situation
- Node.js DNS fails (doesn't matter - we don't need it)
- Browser should be able to connect
- Need to verify what's actually failing in the upload

## Steps to Debug

### 1. Open Browser Console
1. Go to http://localhost:8084/admin
2. Press F12 or Cmd+Option+I
3. Go to Console tab
4. Clear console (trash icon)

### 2. Upload a Test Image
1. Click Gallery tab
2. Click "Upload Images/Videos"
3. Select 1 small image
4. Watch the console

### 3. Look for These Logs
```
🔵 Starting upload for: [filename]
File size: [size] bytes
File type: image/jpeg
Upload path: [path]
Bucket: gallery
Attempting upload to Supabase storage...
```

### 4. Check for Error
If it fails, you'll see:
```
❌ Upload error: [error object]
Error details: {
  message: "...",
  statusCode: "...",
  error: "...",
  name: "..."
}
```

## What to Report
Copy the **entire error details object** from the console.

This will tell us:
- 404 = Bucket doesn't exist
- 403 = Permission denied
- 401 = Auth failed
- Network error = Connection issue

## Alternative: Check Network Tab
1. Open DevTools → Network tab
2. Upload image
3. Look for failed requests (red)
4. Click on the failed request
5. Check Response tab for error message
