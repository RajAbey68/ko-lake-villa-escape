# 🧪 Functionality Test Checklist

**Before deploying to production, verify these work:**

## 1. Gallery Page (`/gallery`)

**URL:** http://localhost:8080/gallery

### ✅ Test:
- [ ] Page loads without errors
- [ ] Images display in grid/masonry layout
- [ ] Images are from Supabase storage
- [ ] Clicking image opens lightbox/modal
- [ ] Navigation works (back to home, etc.)
- [ ] Mobile responsive

### Expected Behavior:
- Gallery should show villa photos from database
- Clean, professional layout
- Fast loading

---

## 2. Gallery Admin (`/admin` → Gallery tab)

**URL:** http://localhost:8080/admin

### ✅ Test:
- [ ] Login required (or E2E mode bypasses)
- [ ] "Gallery" tab visible
- [ ] Can see existing gallery items
- [ ] "Add Gallery Item" button works
- [ ] Can upload new image
- [ ] Can add title, description, tags
- [ ] Can delete gallery item
- [ ] Can edit gallery item
- [ ] Changes save to database
- [ ] Changes appear on `/gallery` page

### Expected Behavior:
- Admin can manage all gallery content
- Upload to Supabase storage
- CRUD operations work
- Real-time updates

---

## 3. Contact Page (`/contact`)

**URL:** http://localhost:8080/contact

### ✅ Test:
- [ ] Page loads without errors
- [ ] Contact form displays
- [ ] All fields present (Name, Email, Message)
- [ ] Form validation works (required fields)
- [ ] Submit button works
- [ ] Success message appears after submit
- [ ] Email/notification sent (if configured)
- [ ] Form data saves to database
- [ ] Can view submissions in admin panel

### Expected Behavior:
- User can submit contact form
- Data saves to `contact_submissions` table
- Admin can view submissions at `/admin` → Contacts tab

---

## 4. Homepage (`/`)

**URL:** http://localhost:8080/

### ✅ Test:
- [ ] New clean design loads
- [ ] Orange buttons visible (#FF9933)
- [ ] Hero image displays
- [ ] All 7 rooms show
- [ ] Gallery section shows images
- [ ] Amenities list displays
- [ ] Map embed works
- [ ] Contact form at bottom works
- [ ] Navigation links work
- [ ] Mobile responsive

---

## 🔧 How to Test

### Manual Testing:
1. Open http://localhost:8080 in browser
2. Click through each page
3. Test each feature
4. Check browser console for errors (F12)

### Automated Testing (if Playwright installed):
```bash
npx playwright install
npx playwright test e2e/admin-gallery.spec.ts
npx playwright test e2e/homepage.spec.ts
```

---

## 🚨 Known Issues to Check

### Gallery:
- Are images loading from Supabase?
- Is storage bucket public?
- Are image URLs correct?

### Contact Form:
- Does Supabase function exist for email?
- Is RLS (Row Level Security) configured?
- Can anonymous users insert to `contact_submissions`?

### Admin:
- Is authentication working?
- Can admin access all tabs?
- Do CRUD operations work?

---

## ✅ Deployment Checklist

**Only deploy when:**
- [ ] Gallery page works (images load)
- [ ] Gallery admin works (can add/edit/delete)
- [ ] Contact page works (form submits)
- [ ] No console errors
- [ ] Mobile responsive
- [ ] All links work

---

## 🎯 Priority Order

1. **Gallery** - Most important for villa showcase
2. **Contact** - Critical for bookings
3. **Admin** - Needed for content management

**Test these in order. Fix any issues before deploying.**
