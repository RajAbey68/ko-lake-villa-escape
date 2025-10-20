# 🥥 Ko Lake Villa - Sri Lankan Design System

**Color Palette:** Kurumba (King Coconut) + Sri Lanka Flag  
**Layout:** Option 1 (Modern Coastal Luxury)  
**Branch:** `feature/modern-ui-redesign`

---

## 🎨 Color Palette

### Primary Colors (Sri Lankan Flag & Kurumba)

**Kurumba Orange** (King Coconut)
```css
--kurumba-orange: #FF9933  /* Primary CTA buttons */
--kurumba-light: #FFD4A3   /* Hover states, backgrounds */
--kurumba-dark: #CC6600    /* Active states */
```

**Lanka Maroon** (Sri Lankan Flag)
```css
--lanka-maroon: #8B2500    /* Accents, headings */
--lanka-maroon-light: #B85C47  /* Lighter accents */
```

**Lanka Green** (Sri Lankan Flag & Nature)
```css
--lanka-green: #2D7A4F     /* Secondary buttons, nature elements */
--lanka-green-light: #5FAF7F   /* Hover states */
```

### Supporting Colors

**Lake & Ocean Blues** (Koggala Lake)
```css
--lake-blue: #2596BE       /* Links, water elements */
--ocean-blue: #5FB8D6      /* Lighter blue accents */
```

**Neutrals** (Sand & Stone)
```css
--sand-cream: #F5F0E8      /* Backgrounds, cards */
--stone-gray: #3D3A36      /* Text, borders */
```

---

## 🏗️ Layout Structure

### Homepage Sections (7-Room Villa)

1. **Sticky Header**
   - Logo + "Ko Lake Villa • Ahangama"
   - Navigation: Rooms | Gallery | Amenities | Location | Contact
   - CTA: "Book Now" (Kurumba orange)

2. **Hero Section**
   - Full-screen image (PoolSunset.jpg)
   - Overlay with gradient
   - Heading: "Lakeside villa for families, surfers & friends"
   - Subheading: "7 rooms • Chef on request • Near surf breaks"
   - CTAs: "Check Availability" (Kurumba) + "Browse Rooms" (White)

3. **Booking Widget**
   - Check-in/Check-out dates
   - Guest selector
   - "Search — best direct rates" button (Lanka green)
   - Direct booking discount message

4. **7 Rooms Grid**
   - 3-column grid (responsive)
   - Each card:
     - Room image
     - Name (e.g., "Family Suite (Pool & Stream)")
     - Description
     - Sleeps X • Size
     - Price per night
     - "Book" button (Kurumba orange)

5. **Gallery** (Masonry/Columns)
   - 9+ villa images
   - 2-3 column responsive grid
   - Rounded corners

6. **Amenities**
   - Icon + text list
   - 3-column grid
   - Items: Chef, Wi-Fi, Pool, Surf breaks, Lake safaris, etc.

7. **Map Section**
   - Google Maps embed
   - Location description
   - "Ahangama • Koggala Lake • 10-15 mins to surf"

8. **Guest Reviews**
   - 3-column testimonial cards
   - Quotes from recent guests

9. **Contact/CTA**
   - Form: Name, Email/WhatsApp, Message
   - "Send enquiry" button (White on Lanka green background)

10. **Footer**
    - Copyright
    - Links

---

## 🎯 Component Styles

### Buttons

**Primary (Kurumba Orange)**
```jsx
<button className="btn-kurumba">
  Book Now
</button>
```

**Secondary (Lanka Green)**
```jsx
<button className="btn-lanka-green">
  Search Availability
</button>
```

**Ghost/Outline**
```jsx
<button className="px-6 py-3 rounded-xl border-2 border-kurumba bg-transparent text-kurumba hover:bg-kurumba hover:text-white">
  Browse Rooms
</button>
```

### Cards

**Room Card**
```jsx
<div className="villa-card">
  <img className="w-full h-48 object-cover" />
  <div className="p-4">
    <h3 className="font-playfair font-semibold">Room Name</h3>
    <p className="text-sm text-muted-foreground">Description</p>
    <div className="mt-4 flex justify-between items-center">
      <span className="font-semibold">$120/night</span>
      <button className="btn-kurumba text-sm">Book</button>
    </div>
  </div>
</div>
```

### Hero

**Full-screen with overlay**
```jsx
<section className="relative h-[72vh]">
  <img className="absolute inset-0 w-full h-full object-cover" />
  <div className="hero-overlay" />
  <div className="relative z-10 flex items-center h-full">
    <div className="max-w-6xl mx-auto px-6">
      <h1 className="font-playfair text-5xl md:text-6xl text-white">
        Lakeside villa for families, surfers & friends
      </h1>
      <p className="text-white/90 mt-4">
        7 rooms • Chef on request • Fast Wi-Fi • Near surf breaks
      </p>
      <div className="mt-6 flex gap-3">
        <button className="btn-kurumba">Check Availability</button>
        <button className="px-6 py-3 rounded-xl bg-white/90 text-stone">
          Browse Rooms
        </button>
      </div>
    </div>
  </div>
</section>
```

---

## 📐 Typography

### Headings
```css
font-family: 'Playfair Display', serif
font-weight: 600
```

**Sizes:**
- H1: 3rem (48px) - Hero
- H2: 2.25rem (36px) - Section headings
- H3: 1.5rem (24px) - Card titles
- H4: 1.25rem (20px) - Subsections

### Body
```css
font-family: 'Inter', sans-serif
font-weight: 400
```

**Sizes:**
- Base: 1rem (16px)
- Small: 0.875rem (14px)
- Large: 1.125rem (18px)

---

## 🏠 7 Rooms Data

```javascript
const ROOMS = [
  {
    key: "family-suite",
    name: "Family Suite (Pool & Stream)",
    pax: 4,
    size: "38 m²",
    description: "Family suite by the pool & stream; French doors; lounge.",
    price: 120,
    image: "/rooms/family-suite.jpg"
  },
  {
    key: "group-room",
    name: "Group Room (Pool & Garden)",
    pax: 6,
    size: "42 m²",
    description: "Sleeps up to 6; ideal for surf crews & families.",
    price: 140,
    image: "/rooms/group-room.jpg"
  },
  {
    key: "madolduwa-view",
    name: "Madol Duwa View",
    pax: 3,
    size: "28 m²",
    description: "Large windows; lake & island outlook.",
    price: 95,
    image: "/rooms/madolduwa.jpg"
  },
  {
    key: "lake-room",
    name: "Lake Room (Pool-Left View)",
    pax: 2,
    size: "26 m²",
    description: "Direct lake & pool aspect; sunrise light.",
    price: 90,
    image: "/rooms/lake-room.jpg"
  },
  {
    key: "bridge-lake",
    name: "Bridge Lake View (2F)",
    pax: 2,
    size: "26 m²",
    description: "Iconic bridge & lake panorama; upstairs.",
    price: 98,
    image: "/rooms/bridge-lake.jpg"
  },
  {
    key: "highlake",
    name: "Highlake (2F)",
    pax: 3,
    size: "30 m²",
    description: "Elevated lake view; breezy & bright.",
    price: 105,
    image: "/rooms/highlake.jpg"
  },
  {
    key: "roof-garden",
    name: "Roof Garden View (2F)",
    pax: 2,
    size: "24 m²",
    description: "Opens to roof garden; sunset spot.",
    price: 92,
    image: "/rooms/roof-garden.jpg"
  }
];
```

---

## 🎨 Design Principles

### 1. Sri Lankan Identity
- Use Kurumba orange as primary brand color
- Incorporate flag colors (maroon, green) as accents
- Celebrate local culture and nature

### 2. Modern Luxury
- Clean, spacious layouts
- High-quality imagery
- Elegant typography (Playfair Display)
- Smooth animations

### 3. Conversion-Focused
- Clear "Book Now" CTAs (Kurumba orange)
- Prominent availability search
- Direct booking benefits highlighted
- Easy navigation to rooms

### 4. Mobile-First
- Responsive grid layouts
- Touch-friendly buttons (min 44px)
- Optimized images
- Fast loading

---

## 🚀 Implementation Status

### ✅ Completed
- [x] Sri Lankan color palette defined
- [x] CSS variables created
- [x] Tailwind config updated
- [x] Custom component classes added
- [x] Typography system set up

### 🔄 In Progress
- [ ] Update homepage with new design
- [ ] Implement 7-room structure
- [ ] Add booking widget
- [ ] Update navigation with new colors

### ⏳ Next Steps
- [ ] Test on local dev server
- [ ] Show preview to user
- [ ] Adjust based on feedback
- [ ] Deploy to production

---

## 🎯 Key Differentiators

**What Makes This Design Unique:**
- 🥥 Authentic Sri Lankan color palette (not generic)
- 🏝️ Celebrates local culture (Kurumba, flag colors)
- 🌊 Koggala Lake focus (blues, natural tones)
- 🏄 Surf-friendly vibe (active, energetic)
- 👨‍👩‍👧‍👦 Family-oriented (7 rooms, group accommodations)
- 🍛 Chef services highlighted (food culture)

---

**This design represents Sri Lanka's vibrant culture while maintaining modern luxury appeal.** 🇱🇰
