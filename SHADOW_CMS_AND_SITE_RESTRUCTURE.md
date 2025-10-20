# 🎨 Shadow CMS & Site Restructure Plan

## 🎯 Correct Architecture Understanding

---

## 1️⃣ SHADOW PAGE CMS (Correct Concept)

### How It Works:

```
┌─────────────────────────────────────────────────────────┐
│                    ADMIN CONSOLE                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  CMS Shadow Pages Tab                             │  │
│  │                                                    │  │
│  │  Shadow of: [Home] [Gallery] [Rooms] [Contact]   │  │
│  │                                                    │  │
│  │  ┌─────────────────────────────────────────────┐ │  │
│  │  │  SHADOW HOME PAGE (Editable)                │ │  │
│  │  │  ┌─────────────────────────────────────┐    │ │  │
│  │  │  │ Ko Lake • Ahangama [Edit]           │    │ │  │
│  │  │  │ Lakeside Holiday Rental [Edit]      │    │ │  │
│  │  │  │ [Hero Image] [Change]               │    │ │  │
│  │  │  │ 7 rooms • WiFi • Chef [Edit]        │    │ │  │
│  │  │  └─────────────────────────────────────┘    │ │  │
│  │  │                                              │ │  │
│  │  │  [Save Draft] [Preview] [Publish Live]      │ │  │
│  │  └─────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         ↓ PUBLISH
┌─────────────────────────────────────────────────────────┐
│                    PUBLIC WEBSITE                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │  HOME PAGE (Read-Only, displays published data)   │  │
│  │  ┌─────────────────────────────────────────────┐ │  │
│  │  │ Ko Lake • Ahangama                          │ │  │
│  │  │ Lakeside Holiday Rental                     │ │  │
│  │  │ [Hero Image]                                │ │  │
│  │  │ 7 rooms • WiFi • Chef                       │ │  │
│  │  └─────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Key Points:
- ✅ Admin edits SHADOW pages (copies in admin console)
- ✅ Changes saved to database as drafts
- ✅ Admin clicks "Publish" → changes go live
- ✅ Public pages ONLY display published content from database
- ✅ Public pages are READ-ONLY (never edited directly)

---

## 2️⃣ CURRENT SITE STRUCTURE PROBLEMS

### Problem 1: Long Single Page
**Current:** Home page has everything (hero, rooms, gallery, amenities, contact, map)
**Issue:** Too long, slow loading, poor UX

### Problem 2: Duplicated Functions
**Current:** 
- Contact form on Home AND Contact page
- Gallery images on Home AND Gallery page
- Booking widget on multiple pages
- Room info repeated

**Issue:** Confusing, maintenance nightmare, inconsistent

### Problem 3: Multiple Entry Points for Same Action
**Current:**
- "Check Availability" on Home → Opens widget on Home
- "Book Now" on Rooms → Opens widget on Rooms
- "Contact" on multiple pages → Different forms

**Issue:** User confusion, data fragmentation

---

## 3️⃣ REQUIRED SITE STRUCTURE

### Navigation Menu (Each = Dedicated Page):

```
┌─────────────────────────────────────────────────────────┐
│  Ko Lake Logo    [Home] [Rooms] [Gallery] [Amenities]   │
│                  [Experiences] [Deals] [Contact] [Book]  │
└─────────────────────────────────────────────────────────┘
```

### Page Structure:

#### 🏠 HOME PAGE (`/`)
**Purpose:** Welcome, overview, call-to-action
**Content:**
- Hero section (title, subtitle, image)
- Brief intro (2-3 sentences)
- Key highlights (7 rooms, WiFi, Chef, etc.)
- Call-to-action buttons:
  - "View Rooms" → `/rooms`
  - "See Gallery" → `/gallery`
  - "Book Now" → `/book`
- Location map (embedded)
- Quick stats (guests, bedrooms, etc.)

**What's NOT on Home:**
- ❌ Full room listings (link to `/rooms`)
- ❌ Full gallery (link to `/gallery`)
- ❌ Contact form (link to `/contact`)
- ❌ Booking widget (link to `/book`)

---

#### 🛏️ ROOMS PAGE (`/rooms`)
**Purpose:** ONE place for all room information
**Content:**
- All room types with details
- Pricing (direct + comparison)
- Room images
- Capacity, bedrooms, bathrooms
- Amenities per room
- Call-to-action: "Book This Room" → `/book?room=master-suite`

**What's NOT on Rooms:**
- ❌ Contact form (link to `/contact`)
- ❌ Gallery (link to `/gallery`)
- ❌ Booking widget (redirect to `/book`)

---

#### 🖼️ GALLERY PAGE (`/gallery`)
**Purpose:** ONE place for all photos/videos
**Content:**
- All property images
- All property videos
- Categories (exterior, interior, pool, rooms, dining, etc.)
- Lightbox viewer
- Download option (optional)

**What's NOT on Gallery:**
- ❌ Room details (link to `/rooms`)
- ❌ Booking widget (link to `/book`)
- ❌ Contact form (link to `/contact`)

---

#### ⭐ AMENITIES PAGE (`/amenities`)
**Purpose:** ONE place for all property features
**Content:**
- All amenities with icons
- Grouped by category (property, room, activity)
- Detailed descriptions
- Images for key amenities

**What's NOT on Amenities:**
- ❌ Room listings (link to `/rooms`)
- ❌ Booking widget (link to `/book`)

---

#### 🎯 EXPERIENCES PAGE (`/experiences`)
**Purpose:** Activities and local attractions
**Content:**
- Surfing spots
- Wildlife safaris
- Local restaurants
- Cultural sites
- Water sports
- Yoga/wellness

**What's NOT on Experiences:**
- ❌ Booking widget (link to `/book`)
- ❌ Room details (link to `/rooms`)

---

#### 💰 DEALS PAGE (`/deals`)
**Purpose:** ONE place for special offers
**Content:**
- Current promotions
- Seasonal deals
- Long-stay discounts
- Early bird offers
- Last-minute deals
- Call-to-action: "Book This Deal" → `/book?deal=summer-special`

**What's NOT on Deals:**
- ❌ Full room details (link to `/rooms`)
- ❌ Contact form (link to `/contact`)

---

#### 📞 CONTACT PAGE (`/contact`)
**Purpose:** ONE place to send messages
**Content:**
- Contact form (name, email, phone, message)
- Property address
- Phone number (clickable)
- Email (clickable)
- WhatsApp link
- Social media links
- Map with directions

**What's NOT on Contact:**
- ❌ Booking widget (link to `/book`)
- ❌ Room listings (link to `/rooms`)
- ❌ Gallery (link to `/gallery`)

---

#### 📅 BOOK PAGE (`/book`)
**Purpose:** ONE place for availability & booking
**Content:**
- Date picker (check-in, check-out)
- Guest selector (adults, children, toddlers)
- Room selector (if multiple rooms)
- Price calculator
- Availability checker
- Booking form
- Payment integration (future)
- Confirmation page

**What's NOT on Book:**
- ❌ Room details (link to `/rooms` to learn more)
- ❌ Gallery (link to `/gallery` to see photos)
- ❌ Contact form (link to `/contact` for questions)

---

## 4️⃣ REDIRECT LOGIC

### If User Tries to Book from Wrong Page:

**Example 1: User clicks "Check Availability" on Home**
```typescript
// On Home page
<Button onClick={() => navigate('/book')}>
  Check Availability
</Button>
```
Result: Redirects to `/book` page

**Example 2: User clicks "Book This Room" on Rooms page**
```typescript
// On Rooms page
<Button onClick={() => navigate('/book?room=master-suite')}>
  Book This Room
</Button>
```
Result: Redirects to `/book` with room pre-selected

**Example 3: User clicks "Contact" on Gallery page**
```typescript
// On Gallery page
<Button onClick={() => navigate('/contact')}>
  Have Questions?
</Button>
```
Result: Redirects to `/contact` page

---

## 5️⃣ SHADOW CMS DATABASE SCHEMA

### Table: `page_content`
Stores ALL editable content for ALL pages

```sql
CREATE TABLE page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Page identification
  page_slug TEXT NOT NULL,              -- 'home', 'rooms', 'gallery', 'contact', etc.
  section_id TEXT NOT NULL,             -- 'hero', 'intro', 'cta', 'room-1', etc.
  
  -- Content fields
  content_type TEXT NOT NULL,           -- 'text', 'image', 'video', 'html', 'json'
  field_name TEXT NOT NULL,             -- 'title', 'subtitle', 'description', 'image_url', etc.
  
  -- Content values
  published_value TEXT,                 -- Live content (what public sees)
  draft_value TEXT,                     -- Draft content (being edited)
  
  -- Metadata
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Unique constraint
  UNIQUE(page_slug, section_id, field_name)
);

-- Indexes
CREATE INDEX idx_page_content_page ON page_content(page_slug);
CREATE INDEX idx_page_content_published ON page_content(is_published);
CREATE INDEX idx_page_content_section ON page_content(page_slug, section_id);
```

### Example Data:

```sql
-- Home page hero section
INSERT INTO page_content (page_slug, section_id, content_type, field_name, published_value, is_published) VALUES
('home', 'hero', 'text', 'title', 'Ko Lake • Ahangama', true),
('home', 'hero', 'text', 'subtitle', 'Lakeside Holiday Rental for Surfers, Digital Nomads & Families', true),
('home', 'hero', 'image', 'background_url', '/ko-lake-hero.jpg', true),
('home', 'hero', 'text', 'cta_text', 'Check Availability', true);

-- Rooms page
INSERT INTO page_content (page_slug, section_id, content_type, field_name, published_value, is_published) VALUES
('rooms', 'header', 'text', 'title', 'Our Luxury Accommodations', true),
('rooms', 'header', 'text', 'subtitle', 'Choose from 7 beautifully designed rooms', true);

-- Gallery page
INSERT INTO page_content (page_slug, section_id, content_type, field_name, published_value, is_published) VALUES
('gallery', 'header', 'text', 'title', 'Photo Gallery', true),
('gallery', 'header', 'text', 'subtitle', 'Explore our stunning property', true);
```

---

## 6️⃣ IMPLEMENTATION PLAN

### Phase 1: Database Setup (2 hours)
- [ ] Create `page_content` table
- [ ] Create indexes
- [ ] Set up RLS policies
- [ ] Seed initial content from existing pages

### Phase 2: Public Page Restructure (8 hours)
- [ ] Split Home page into sections
- [ ] Create dedicated `/rooms` page
- [ ] Create dedicated `/gallery` page
- [ ] Create dedicated `/amenities` page
- [ ] Create dedicated `/experiences` page
- [ ] Create dedicated `/deals` page
- [ ] Create dedicated `/contact` page
- [ ] Create dedicated `/book` page
- [ ] Remove duplicated content
- [ ] Add redirect logic

### Phase 3: Public Pages Load from Database (6 hours)
- [ ] Create `usePageContent()` hook
- [ ] Update Home page to load from database
- [ ] Update Rooms page to load from database
- [ ] Update Gallery page to load from database
- [ ] Update all other pages
- [ ] Add fallback to hardcoded content
- [ ] Add loading states

### Phase 4: Shadow CMS Admin Component (12 hours)
- [ ] Create `AdminShadowPages.tsx`
- [ ] Add page selector dropdown
- [ ] Create shadow page viewer
- [ ] Implement inline text editing
- [ ] Implement image replacement
- [ ] Add draft/publish system
- [ ] Add preview mode
- [ ] Add publish history

### Phase 5: Testing & Refinement (4 hours)
- [ ] Test editing each page
- [ ] Test publish workflow
- [ ] Test public page display
- [ ] Test redirects
- [ ] Test mobile responsive
- [ ] Fix bugs

**Total Time:** ~32 hours (4-5 days)

---

## 7️⃣ ADMIN SHADOW CMS UI

### Admin Console → Shadow Pages Tab

```
┌─────────────────────────────────────────────────────────────┐
│  Shadow Page Editor                                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Select Page: [Dropdown ▼]                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ ○ Home                                               │    │
│  │ ○ Rooms                                              │    │
│  │ ○ Gallery                                            │    │
│  │ ○ Amenities                                          │    │
│  │ ○ Experiences                                        │    │
│  │ ○ Deals                                              │    │
│  │ ○ Contact                                            │    │
│  │ ○ Book                                               │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  Currently Editing: HOME PAGE                                │
│                                                               │
│  [View Published] [Edit Draft] [Preview Draft]               │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  SHADOW HOME PAGE                                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  HERO SECTION                              [Edit]   │    │
│  │  ┌───────────────────────────────────────────────┐  │    │
│  │  │ Title: Ko Lake • Ahangama          [Edit]     │  │    │
│  │  │ Subtitle: Lakeside Holiday...      [Edit]     │  │    │
│  │  │ Background Image:                  [Change]   │  │    │
│  │  │ [Image Preview]                               │  │    │
│  │  │ CTA Text: Check Availability       [Edit]     │  │    │
│  │  └───────────────────────────────────────────────┘  │    │
│  │                                                      │    │
│  │  INTRO SECTION                             [Edit]   │    │
│  │  ┌───────────────────────────────────────────────┐  │    │
│  │  │ Text: Welcome to Ko Lake...        [Edit]     │  │    │
│  │  └───────────────────────────────────────────────┘  │    │
│  │                                                      │    │
│  │  HIGHLIGHTS SECTION                        [Edit]   │    │
│  │  ┌───────────────────────────────────────────────┐  │    │
│  │  │ • 7 rooms                          [Edit]     │  │    │
│  │  │ • Unlimited WiFi                   [Edit]     │  │    │
│  │  │ • Private chef                     [Edit]     │  │    │
│  │  └───────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  [Save Draft] [Discard Changes] [Publish to Live Site]       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 8️⃣ PUBLIC PAGE COMPONENT EXAMPLE

### Home Page (Loads from Database)

```typescript
// src/pages/Home.tsx
import { usePageContent } from '@/hooks/usePageContent';

export const HomePage = () => {
  const { content, isLoading } = usePageContent('home');
  
  if (isLoading) return <LoadingSpinner />;
  
  // Get published content
  const heroTitle = content.find(
    c => c.section_id === 'hero' && c.field_name === 'title'
  )?.published_value || 'Ko Lake • Ahangama'; // Fallback
  
  const heroSubtitle = content.find(
    c => c.section_id === 'hero' && c.field_name === 'subtitle'
  )?.published_value || 'Lakeside Holiday Rental...';
  
  const heroImage = content.find(
    c => c.section_id === 'hero' && c.field_name === 'background_url'
  )?.published_value || '/default-hero.jpg';
  
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section 
        className="hero" 
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <h1>{heroTitle}</h1>
        <p>{heroSubtitle}</p>
        <Button onClick={() => navigate('/book')}>
          Check Availability
        </Button>
      </section>
      
      {/* Other sections... */}
    </div>
  );
};
```

---

## 9️⃣ KEY PRINCIPLES

### ✅ DO:
1. Each navigation item = dedicated page
2. ONE place for each function
3. Edit in Admin Shadow → Publish to Public
4. Redirect to proper page for actions
5. Load content from database
6. Fallback to defaults if database empty

### ❌ DON'T:
1. Edit public pages directly
2. Duplicate functions across pages
3. Repeat content in multiple places
4. Have multiple contact forms
5. Have multiple booking widgets
6. Mix page purposes

---

## 🚀 IMMEDIATE NEXT STEPS

### Step 1: Confirm Approach
- [ ] Review this plan
- [ ] Confirm page structure
- [ ] Confirm Shadow CMS approach
- [ ] Approve database schema

### Step 2: Start Implementation
- [ ] Create database tables
- [ ] Restructure public pages
- [ ] Build Shadow CMS admin component
- [ ] Test workflow

### Step 3: Deploy
- [ ] Test locally
- [ ] Deploy to staging
- [ ] Final testing
- [ ] Deploy to production

---

**READY TO START? Let me know and I'll begin implementing!** 🚀
