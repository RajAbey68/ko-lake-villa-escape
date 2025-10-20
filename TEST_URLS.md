# 🔗 Test URLs - Quick Access

**Dev Server:** http://localhost:8080

---

## Pages to Test

### 1. Homepage (New Design) ✅
**URL:** http://localhost:8080/

**What to check:**
- Orange buttons visible
- 7 rooms display
- Gallery images show
- All sections present

---

### 2. Gallery Page
**URL:** http://localhost:8080/gallery

**What to check:**
- Images load from Supabase
- Grid/masonry layout works
- Can click images
- No console errors

---

### 3. Contact Page
**URL:** http://localhost:8080/contact

**What to check:**
- Form displays
- Can fill out fields
- Submit button works
- Success message appears
- Data saves to database

---

### 4. Admin Panel
**URL:** http://localhost:8080/admin

**What to check:**
- Can access (login or E2E mode)
- Gallery tab works
- Can add/edit/delete gallery items
- Contact submissions visible

---

## Quick Test Commands

```bash
# Open all test URLs in browser
open http://localhost:8080/
open http://localhost:8080/gallery
open http://localhost:8080/contact
open http://localhost:8080/admin
```

---

## Browser Console Check

Press **F12** or **Cmd+Option+I** to open DevTools

Look for:
- ❌ Red errors
- ⚠️ Yellow warnings
- ✅ No errors = good to deploy

---

**Test these 4 URLs and report back which ones work!**
