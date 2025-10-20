# 🎨 Shadow Page CMS - Missing Feature Specification

## ⚠️ CRITICAL: This Feature is NOT Yet Implemented

---

## 📋 What is Shadow Page CMS?

**Shadow Page** is a powerful CMS capability that allows you to:
1. **Preview any public page** in "edit mode" within the admin console
2. **Edit text directly** on the shadow/preview version
3. **Update images/videos** inline
4. **Publish changes** to make them live on the public site

**Key Concept:** The admin sees a "shadow" (editable copy) of the public page, makes changes, and publishes them.

---

## 🎯 Core Functionality:

### 1. Shadow Page Viewer
**What it does:**
- Loads any public page (Home, Gallery, Accommodation, etc.) in an iframe or preview mode
- Shows the page exactly as visitors see it
- Adds edit controls/overlays on editable elements

### 2. Inline Text Editing
**What it does:**
- Click any text element (heading, paragraph, button text)
- Edit directly in place
- See changes in real-time
- Save to database

### 3. Inline Image/Video Replacement
**What it does:**
- Click any image or video
- Upload new file or enter new URL
- Preview immediately
- Save to database

### 4. Publish/Unpublish System
**What it does:**
- Changes are saved as "draft" first
- Preview draft changes before publishing
- One-click publish to make changes live
- Rollback capability (optional)

---

## 🏗️ Technical Architecture:

### Database Schema Needed:

```sql
-- Table to store editable page content
CREATE TABLE page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name TEXT NOT NULL,           -- 'home', 'gallery', 'accommodation', etc.
  element_id TEXT NOT NULL,          -- Unique identifier for the element
  element_type TEXT NOT NULL,        -- 'text', 'image', 'video', 'heading', etc.
  content_key TEXT NOT NULL,         -- 'hero_title', 'hero_subtitle', 'section_1_text', etc.
  content_value TEXT NOT NULL,       -- The actual content (text, URL, etc.)
  content_draft TEXT,                -- Draft version (unpublished)
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  UNIQUE(page_name, element_id, content_key)
);

-- Table to track publish history
CREATE TABLE page_content_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_content_id UUID REFERENCES page_content(id),
  content_value TEXT NOT NULL,
  published_at TIMESTAMP DEFAULT NOW(),
  published_by UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX idx_page_content_page ON page_content(page_name);
CREATE INDEX idx_page_content_published ON page_content(is_published);
```

---

## 🎨 UI/UX Design:

### Admin Console - New Tab: "Shadow Pages"

```
Admin Console
├── Setup
├── Analytics
├── Bookings
├── Rooms
├── Amenities
├── Gallery
├── Hero
├── Location
├── Contacts
├── Guesty
├── AI Test
└── 🆕 Shadow Pages  ← NEW TAB
```

### Shadow Pages Interface:

```
┌─────────────────────────────────────────────────────────┐
│  Shadow Page Editor                                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Select Page: [Dropdown: Home, Gallery, Accommodation]  │
│                                                          │
│  Mode: ○ View  ● Edit  ○ Preview Draft                  │
│                                                          │
│  [Publish All Changes]  [Discard Drafts]  [Refresh]     │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  [IFRAME: Public Page with Edit Overlays]       │   │
│  │                                                  │   │
│  │  ┌──────────────────────────────┐              │   │
│  │  │ Ko Lake • Ahangama           │ [Edit]       │   │
│  │  └──────────────────────────────┘              │   │
│  │                                                  │   │
│  │  ┌──────────────────────────────┐              │   │
│  │  │ Lakeside Holiday Rental...   │ [Edit]       │   │
│  │  └──────────────────────────────┘              │   │
│  │                                                  │   │
│  │  ┌──────────────────────────────┐              │   │
│  │  │ [Hero Image]                 │ [Change]     │   │
│  │  └──────────────────────────────┘              │   │
│  │                                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Implementation Components:

### 1. AdminShadowPages.tsx (Main Component)

```typescript
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Eye, Edit, Save, X, RefreshCw } from 'lucide-react';

export const AdminShadowPages = () => {
  const [selectedPage, setSelectedPage] = useState('home');
  const [editMode, setEditMode] = useState<'view' | 'edit' | 'preview'>('view');
  const { toast } = useToast();

  const pages = [
    { value: 'home', label: 'Home Page' },
    { value: 'gallery', label: 'Gallery' },
    { value: 'accommodation', label: 'Accommodation' },
    { value: 'experiences', label: 'Experiences' },
    { value: 'deals', label: 'Deals' },
    { value: 'contact', label: 'Contact' },
  ];

  const publishChanges = async () => {
    // Publish all draft changes for the selected page
    toast({ title: "Changes published!", description: "Page updated successfully." });
  };

  const discardDrafts = async () => {
    // Discard all unpublished changes
    toast({ title: "Drafts discarded", description: "Unpublished changes removed." });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shadow Page Editor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Page Selector */}
        <div className="flex items-center gap-4">
          <label className="font-medium">Select Page:</label>
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pages.map(page => (
                <SelectItem key={page.value} value={page.value}>
                  {page.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mode Selector */}
        <Tabs value={editMode} onValueChange={(v) => setEditMode(v as any)}>
          <TabsList>
            <TabsTrigger value="view">
              <Eye className="h-4 w-4 mr-2" />
              View
            </TabsTrigger>
            <TabsTrigger value="edit">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Preview Draft
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={publishChanges}>
            <Save className="h-4 w-4 mr-2" />
            Publish All Changes
          </Button>
          <Button variant="outline" onClick={discardDrafts}>
            <X className="h-4 w-4 mr-2" />
            Discard Drafts
          </Button>
          <Button variant="ghost">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Shadow Page Viewer */}
        <div className="border rounded-lg p-4 min-h-[600px]">
          <ShadowPageViewer 
            page={selectedPage} 
            mode={editMode}
          />
        </div>
      </CardContent>
    </Card>
  );
};
```

### 2. ShadowPageViewer.tsx (Page Renderer)

```typescript
interface ShadowPageViewerProps {
  page: string;
  mode: 'view' | 'edit' | 'preview';
}

export const ShadowPageViewer = ({ page, mode }: ShadowPageViewerProps) => {
  // Load page content from database
  // Render with edit overlays if mode === 'edit'
  // Show draft content if mode === 'preview'
  
  return (
    <div className="shadow-page-container">
      {/* Render page content with edit capabilities */}
    </div>
  );
};
```

### 3. EditableElement.tsx (Inline Editor)

```typescript
interface EditableElementProps {
  elementId: string;
  elementType: 'text' | 'image' | 'video';
  currentValue: string;
  onSave: (newValue: string) => void;
}

export const EditableElement = ({ 
  elementId, 
  elementType, 
  currentValue, 
  onSave 
}: EditableElementProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(currentValue);

  const handleSave = () => {
    onSave(value);
    setIsEditing(false);
  };

  if (elementType === 'text') {
    return isEditing ? (
      <div className="editable-text">
        <textarea value={value} onChange={(e) => setValue(e.target.value)} />
        <Button onClick={handleSave}>Save</Button>
      </div>
    ) : (
      <div onClick={() => setIsEditing(true)} className="editable-hover">
        {currentValue}
        <Edit className="edit-icon" />
      </div>
    );
  }

  if (elementType === 'image') {
    return (
      <div className="editable-image">
        <img src={currentValue} alt="" />
        <Button onClick={() => {/* Open image upload dialog */}}>
          Change Image
        </Button>
      </div>
    );
  }

  return null;
};
```

### 4. usePageContent.ts (Data Hook)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePageContent = (pageName: string) => {
  const queryClient = useQueryClient();

  // Fetch page content
  const { data: content, isLoading } = useQuery({
    queryKey: ['page-content', pageName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_name', pageName);
      
      if (error) throw error;
      return data;
    },
  });

  // Update content (draft)
  const updateContent = useMutation({
    mutationFn: async ({ elementId, contentKey, newValue }: any) => {
      const { data, error } = await supabase
        .from('page_content')
        .upsert({
          page_name: pageName,
          element_id: elementId,
          content_key: contentKey,
          content_draft: newValue,
          is_published: false,
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-content', pageName] });
    },
  });

  // Publish all changes
  const publishAll = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('page_content')
        .update({ 
          content_value: supabase.raw('content_draft'),
          is_published: true,
          published_at: new Date().toISOString()
        })
        .eq('page_name', pageName)
        .eq('is_published', false);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-content', pageName] });
    },
  });

  return {
    content,
    isLoading,
    updateContent,
    publishAll,
  };
};
```

---

## 📝 Implementation Steps:

### Phase 1: Database Setup
1. Create `page_content` table
2. Create `page_content_history` table
3. Set up RLS policies
4. Seed initial content from existing pages

### Phase 2: Admin Component
1. Create `AdminShadowPages.tsx`
2. Add to AdminPage tabs
3. Implement page selector
4. Implement mode switcher

### Phase 3: Shadow Viewer
1. Create `ShadowPageViewer.tsx`
2. Load page content from database
3. Render with edit overlays
4. Handle edit mode vs view mode

### Phase 4: Inline Editing
1. Create `EditableElement.tsx`
2. Implement text editing
3. Implement image upload/replace
4. Implement video upload/replace
5. Add save/cancel buttons

### Phase 5: Publish System
1. Implement draft saving
2. Implement publish all
3. Implement discard drafts
4. Add publish history tracking

### Phase 6: Public Page Integration
1. Update public pages to load content from database
2. Add fallback to hardcoded content
3. Implement caching for performance
4. Add real-time updates (optional)

---

## 🎯 User Workflow:

### Example: Editing Homepage Hero Text

1. **Go to Admin → Shadow Pages**
2. **Select "Home Page"** from dropdown
3. **Switch to "Edit" mode**
4. **Click on hero title** "Lakeside Holiday Rental..."
5. **Edit text** inline
6. **Click "Save"** (saves as draft)
7. **Switch to "Preview Draft"** to see changes
8. **Click "Publish All Changes"** to make live
9. **Visit public homepage** - changes are live!

### Example: Replacing Hero Image

1. **Go to Admin → Shadow Pages**
2. **Select "Home Page"**
3. **Switch to "Edit" mode**
4. **Click "Change Image"** on hero background
5. **Upload new image** or enter URL
6. **Preview** immediately
7. **Click "Publish All Changes"**
8. **Hero image updated** on public site!

---

## 🚀 Benefits:

### For You (Admin):
- ✅ Edit any page content without touching code
- ✅ See changes in real-time before publishing
- ✅ No need to redeploy for content changes
- ✅ Visual editing (WYSIWYG)
- ✅ Rollback capability

### For Visitors:
- ✅ Always see latest content
- ✅ No downtime during updates
- ✅ Consistent experience

---

## ⚠️ Current Status:

### NOT IMPLEMENTED ❌

**What exists now:**
- ✅ Individual content editors (Hero, Location, etc.)
- ✅ Gallery management
- ✅ Room types management

**What's missing:**
- ❌ Shadow Page viewer
- ❌ Inline editing
- ❌ Unified page content management
- ❌ Draft/publish system
- ❌ Visual WYSIWYG editor

---

## 🎯 Priority Level:

### HIGH PRIORITY 🔴

**Why:**
- This was a core feature in legacy admin
- Provides significant value for content management
- Reduces dependency on developers for content updates
- Improves workflow efficiency

---

## 📅 Estimated Implementation Time:

- **Phase 1 (Database):** 2 hours
- **Phase 2 (Admin UI):** 4 hours
- **Phase 3 (Shadow Viewer):** 6 hours
- **Phase 4 (Inline Editing):** 8 hours
- **Phase 5 (Publish System):** 4 hours
- **Phase 6 (Public Integration):** 6 hours

**Total:** ~30 hours (4-5 days)

---

## 🔄 Alternative Approach (Simpler):

### If full Shadow Page is too complex, we can implement:

**"Quick Edit Mode"** - A simpler version:
1. Add "Edit" button on each public page (visible only to admins)
2. Click "Edit" → page becomes editable
3. Edit text/images inline
4. Click "Save" → changes go live immediately
5. No draft system, but much faster to implement

**Estimated time:** ~15 hours (2 days)

---

## 📞 Next Steps:

### To Implement Shadow Page CMS:

1. **Confirm requirements** - Do you want full Shadow Page or Quick Edit?
2. **Create database tables** - Run migration
3. **Build admin component** - Shadow Pages tab
4. **Implement inline editing** - Text and images
5. **Add publish system** - Draft/publish workflow
6. **Test thoroughly** - All pages, all content types
7. **Deploy** - Make available in production

---

**VERDICT: Shadow Page CMS is a critical missing feature that needs to be implemented.** 🔴

**Would you like me to start building this now?** 🚀
