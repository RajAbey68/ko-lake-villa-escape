# 🚀 Pre-Deployment Checklist

## ✅ Manual Testing Checklist

### Test on: http://localhost:8083/

---

## 1. Homepage Tests
- [ ] Visit http://localhost:8083/
- [ ] Fisherman logo appears (top left)
- [ ] "Ko Lake • Ahangama" text visible
- [ ] Hero section loads
- [ ] Navigation menu works
- [ ] "Check Availability" button redirects to /book
- [ ] Mobile responsive (resize browser)

---

## 2. Navigation Tests
- [ ] Click "Rooms" → Goes to /rooms
- [ ] Click "Gallery" → Goes to /gallery
- [ ] Click "Amenities" → Goes to /amenities
- [ ] Click "Experiences" → Goes to /experiences
- [ ] Click "Deals" → Goes to /deals
- [ ] Click "Contact" → Goes to /contact
- [ ] Click "Staff" → Goes to /admin

---

## 3. Admin Console Tests
- [ ] Visit http://localhost:8083/admin
- [ ] No login required (bypass working)
- [ ] Yellow "Testing Mode" banner visible
- [ ] All tabs visible (Setup, Analytics, Bookings, etc.)
- [ ] Click "Gallery" tab → AdminGallery loads
- [ ] Click "Shadow CMS" tab → AdminShadowPages loads

---

## 4. Shadow CMS Tests
- [ ] Go to Admin → Shadow CMS tab
- [ ] Page selector dropdown works
- [ ] Select "Home" page
- [ ] Content table shows rows
- [ ] Click Edit on any row
- [ ] Edit dialog opens
- [ ] Change content
- [ ] Click "Save as Draft"
- [ ] Toast notification appears
- [ ] Draft counter updates
- [ ] Switch to "Draft" view mode
- [ ] See draft content
- [ ] Click "Publish All Changes"
- [ ] Success notification
- [ ] Draft counter resets to 0

---

## 5. Gallery Admin Tests
- [ ] Go to Admin → Gallery tab
- [ ] Click "Add Gallery Item"
- [ ] Upload file or enter URL
- [ ] Fill in title
- [ ] Click "Create Gallery Item"
- [ ] Item appears in list
- [ ] Edit item works
- [ ] Delete item works

---

## 6. Booking Page Tests
- [ ] Visit http://localhost:8083/book
- [ ] Page loads with header
- [ ] Booking widget visible
- [ ] Date picker works
- [ ] Guest selector works

---

## 7. Mobile Tests
- [ ] Resize browser to mobile width (375px)
- [ ] Navigation hamburger menu appears
- [ ] All pages responsive
- [ ] Admin console responsive
- [ ] Shadow CMS table scrollable

---

## 8. Browser Console Tests
- [ ] Open DevTools (F12)
- [ ] Check Console tab
- [ ] No red errors (warnings OK)
- [ ] Check Network tab
- [ ] All requests successful (200 status)

---

## ⚠️ Known Issues (Expected):

### TypeScript Warnings:
- "Cannot find module" warnings in IDE
- **These are IDE-only, code runs fine**

### Database Migration:
- Shadow CMS will show empty table until migration runs
- **Need to run migration on Vercel after deploy**

---

## 🚀 Ready to Deploy When:

- [ ] All homepage tests pass
- [ ] Navigation works
- [ ] Admin console loads
- [ ] Shadow CMS tab visible
- [ ] Gallery admin works
- [ ] No critical errors in console
- [ ] Mobile responsive

---

## 📋 Deployment Steps:

### Step 1: Commit and Push
```bash
git add -A
git commit -m "feat: Complete Shadow CMS implementation and site restructure"
git push origin feature/modern-ui-redesign
```

### Step 2: Deploy to Vercel
```bash
# Option A: Vercel CLI
vercel --prod

# Option B: GitHub Integration
# Push will auto-deploy if connected
```

### Step 3: Run Migration on Vercel
```bash
# After deploy, run migration in Supabase Dashboard:
1. Go to SQL Editor
2. Copy: supabase/migrations/20250120000000_create_page_content.sql
3. Run it
```

### Step 4: Test Production
```
1. Visit your Vercel URL
2. Test all features
3. Go to /admin → Shadow CMS
4. Edit content
5. Publish changes
6. Verify on public site
```

---

## 🎯 Current Status:

### ✅ Implemented:
- Fisherman logo on all pages
- "Ko Lake" branding (no "Villa")
- Shadow CMS admin component
- Database schema
- usePageContent hook
- Dedicated /book page
- Proper routing
- Admin bypass for testing

### ⏳ Pending:
- Database migration (run after deploy)
- Update public pages to use Shadow CMS (optional)
- Production authentication (when ready)

---

## 📞 If Issues Found:

### Logo Not Showing:
- Check `/public/ko-lake-logo.jpg` exists
- Hard refresh: Cmd+Shift+R

### Admin Not Loading:
- Check console for errors
- Verify BYPASS_AUTH = true

### Shadow CMS Empty:
- Need to run database migration
- Check Supabase connection

### TypeScript Errors:
- These are IDE warnings only
- Code will run fine

---

**Test everything above, then we'll push to Vercel!** 🚀
