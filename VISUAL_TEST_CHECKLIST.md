# 🎨 Visual Test Checklist - Ko Lake Villa

**Server:** http://localhost:8081  
**Status:** ✅ Running (PID: 73090)

---

## 📋 Pages to Test

### 1. **Homepage** - http://localhost:8081/
**What to check:**
- [ ] Hero section loads with title
- [ ] Navigation bar works
- [ ] Room cards display
- [ ] Amenities section shows
- [ ] Gallery preview
- [ ] Footer present
- [ ] No console errors

**Expected:**
- Clean, modern design
- All sections visible
- Smooth scrolling
- Responsive layout

---

### 2. **New Contact Page** ⭐ - http://localhost:8081/contact
**What to check:**
- [ ] Full-screen hero with villa image background
- [ ] "Let's Plan Your Perfect Sri Lankan Escape" headline
- [ ] Large green WhatsApp button
- [ ] 3 contact cards (WhatsApp, Phone, Email)
- [ ] "Why Book Direct" value props section
- [ ] Contact form with quick message templates
- [ ] FAQ accordion (expandable questions)
- [ ] 24/7 Emergency banner at bottom
- [ ] All styling looks polished

**Expected:**
- Visual impact similar to gallery
- WhatsApp button prominent and green
- Professional, conversion-focused design
- Mobile responsive

---

### 3. **Gallery Page** - http://localhost:8081/gallery
**What to check:**
- [ ] Page loads without errors
- [ ] Shows "No gallery items available" OR images if DB seeded
- [ ] Clean layout
- [ ] Loading state works
- [ ] Error handling graceful

**Expected:**
- If DB empty: Clean message "Check back soon"
- If DB seeded: Grid of 6 images
- Lightbox opens on click

---

### 4. **Gallery Admin** - http://localhost:8081/gallery-admin
**What to check:**
- [ ] "Back to Gallery" button
- [ ] "Gallery Management" title
- [ ] "Add Gallery Item" button
- [ ] Table view (empty or with items)
- [ ] Upload dialog works
- [ ] Can switch between "Upload File" and "Enter URL" tabs

**Expected:**
- Professional admin interface
- Easy to upload images
- Clear instructions

---

### 5. **Rooms Page** - http://localhost:8081/rooms
**What to check:**
- [ ] Room listings display
- [ ] Pricing shows
- [ ] Images load
- [ ] "Book Now" buttons work

**Expected:**
- Clean room cards
- Pricing comparison (direct vs Airbnb)
- Professional presentation

---

### 6. **Old Contact Page** - http://localhost:8081/contact-old
**What to check:**
- [ ] Still works (for comparison)
- [ ] Form functional
- [ ] Data-driven contacts show

**Purpose:** Compare with new design

---

## 🎯 Key Visual Elements to Verify

### New Contact Page Highlights

#### Hero Section
```
✅ Full viewport height
✅ Pool sunset background image
✅ White text with shadow
✅ Large headline (48-64px)
✅ Subheadline with bullet points
✅ Green WhatsApp button with shadow
✅ Secondary "Or Fill Form" button
```

#### Contact Cards
```
✅ 3-column grid (responsive to 1-column mobile)
✅ WhatsApp card has green gradient background
✅ Large emoji icons (48px)
✅ Card hover effects (lift + shadow)
✅ Buttons match card theme
```

#### Value Props Section
```
✅ Gray background section
✅ 4 value items in grid
✅ Large emoji icons (56px)
✅ "Why Book Direct?" headline
✅ Clean, centered layout
```

#### Contact Form
```
✅ White card with shadow
✅ Quick reply buttons (pill-shaped)
✅ Clean input fields with focus states
✅ Large submit button
✅ Success/error alerts styled
```

#### FAQ Section
```
✅ Accordion items with borders
✅ Click to expand/collapse
✅ + / - icons
✅ Active state highlighting
✅ Smooth transitions
```

#### Emergency Banner
```
✅ Yellow gradient background
✅ Orange border
✅ Large emoji (40px)
✅ Prominent phone number
✅ Centered layout
```

---

## 🖥️ Browser Console Check

Open DevTools (F12) and check:
- [ ] No red errors in Console
- [ ] No 404s in Network tab
- [ ] No warnings about missing images
- [ ] React renders without issues

---

## 📱 Mobile Responsiveness

Test at these widths:
- [ ] Desktop (1200px+) - Full layout
- [ ] Tablet (768px) - Adjusted grid
- [ ] Mobile (375px) - Single column

**Key checks:**
- [ ] Hero text readable
- [ ] Buttons not cut off
- [ ] Forms usable
- [ ] Navigation works

---

## 🎨 Design Quality Check

### Does it look professional?
- [ ] Typography hierarchy clear
- [ ] Colors consistent
- [ ] Spacing balanced
- [ ] Images sharp (when loaded)
- [ ] Buttons inviting
- [ ] No layout breaks

### Does it match gallery quality?
- [ ] Visual impact similar
- [ ] Professional polish
- [ ] Modern design
- [ ] Attention to detail

---

## 🐛 Known Issues to Expect

### Before Database Seeding
- ❌ Gallery shows "No items available"
- ❌ Homepage may show "Failed to load" errors
- ❌ Room cards might be empty

**Solution:** Run `SETUP_DATABASE_COMPLETE.sql`

### Image Placeholders
- ⚠️ Some images use `/images/` paths
- ⚠️ May show broken image icons

**Solution:** Upload real images via Gallery Admin

---

## ✅ Success Criteria

### Contact Page
- [ ] Looks visually stunning
- [ ] WhatsApp button prominent
- [ ] Form easy to use
- [ ] FAQ helpful
- [ ] Mobile friendly
- [ ] No errors

### Overall Site
- [ ] Navigation works
- [ ] Pages load fast
- [ ] No console errors
- [ ] Professional appearance
- [ ] Ready to show clients

---

## 🚀 Next Steps After Visual Test

If everything looks good:
1. ✅ Run database setup SQL
2. ✅ Upload real images
3. ✅ Push to production
4. ✅ Go live!

If issues found:
1. Note specific problems
2. Take screenshots
3. Share with me
4. We'll fix quickly

---

## 📸 Screenshots to Take

For documentation/approval:
1. Contact page hero
2. Contact cards section
3. Contact form
4. FAQ section
5. Gallery admin interface
6. Mobile view of contact page

---

**Ready to test?** Open these URLs in your browser:

🏠 **Homepage:** http://localhost:8081/  
⭐ **New Contact:** http://localhost:8081/contact  
🖼️ **Gallery:** http://localhost:8081/gallery  
⚙️ **Gallery Admin:** http://localhost:8081/gallery-admin  
🏨 **Rooms:** http://localhost:8081/rooms  

**Start with the new contact page - that's the star of the show!** ✨
