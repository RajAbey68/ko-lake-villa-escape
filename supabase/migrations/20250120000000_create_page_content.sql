-- Shadow CMS: Page Content Management
-- This table stores all editable content for all public pages

CREATE TABLE IF NOT EXISTS page_content (
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
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Display order
  display_order INTEGER DEFAULT 0,
  
  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Unique constraint: one field per section per page
  UNIQUE(page_slug, section_id, field_name)
);

-- Indexes for performance
CREATE INDEX idx_page_content_page ON page_content(page_slug);
CREATE INDEX idx_page_content_published ON page_content(is_published);
CREATE INDEX idx_page_content_section ON page_content(page_slug, section_id);
CREATE INDEX idx_page_content_order ON page_content(page_slug, display_order);

-- RLS Policies
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Public can read published content
CREATE POLICY "Public can read published content"
  ON page_content
  FOR SELECT
  USING (is_published = true);

-- Authenticated users can read all content (for preview)
CREATE POLICY "Authenticated users can read all content"
  ON page_content
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert content
CREATE POLICY "Authenticated users can insert content"
  ON page_content
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update content
CREATE POLICY "Authenticated users can update content"
  ON page_content
  FOR UPDATE
  TO authenticated
  USING (true);

-- Authenticated users can delete content
CREATE POLICY "Authenticated users can delete content"
  ON page_content
  FOR DELETE
  TO authenticated
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_page_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_page_content_updated_at
  BEFORE UPDATE ON page_content
  FOR EACH ROW
  EXECUTE FUNCTION update_page_content_updated_at();

-- Seed initial content for Home page
INSERT INTO page_content (page_slug, section_id, content_type, field_name, published_value, is_published, display_order) VALUES
-- Home page hero section
('home', 'hero', 'text', 'title', 'Ko Lake • Ahangama', true, 1),
('home', 'hero', 'text', 'subtitle', 'the Lakeside Holiday Rental for Surfers, Digital Nomads & Families', true, 2),
('home', 'hero', 'image', 'background_url', '/ko-lake-logo.jpg', true, 3),
('home', 'hero', 'text', 'cta_text', 'Check Availability', true, 4),

-- Home page highlights
('home', 'highlights', 'text', 'item_1', '7 rooms', true, 1),
('home', 'highlights', 'text', 'item_2', 'Unlimited WiFi', true, 2),
('home', 'highlights', 'text', 'item_3', 'Private chef', true, 3),
('home', 'highlights', 'text', 'item_4', 'Lake access', true, 4),
('home', 'highlights', 'text', 'item_5', 'Near surf spots & wildlife safaris', true, 5),
('home', 'highlights', 'text', 'item_6', 'Pet friendly', true, 6),

-- Rooms page header
('rooms', 'header', 'text', 'title', 'Our Luxury Accommodations', true, 1),
('rooms', 'header', 'text', 'subtitle', 'Choose from 7 beautifully designed rooms with stunning lake views', true, 2),

-- Gallery page header
('gallery', 'header', 'text', 'title', 'Photo Gallery', true, 1),
('gallery', 'header', 'text', 'subtitle', 'Explore our stunning property and beautiful surroundings', true, 2),

-- Amenities page header
('amenities', 'header', 'text', 'title', 'Property Amenities', true, 1),
('amenities', 'header', 'text', 'subtitle', 'Everything you need for a perfect stay', true, 2),

-- Experiences page header
('experiences', 'header', 'text', 'title', 'Local Experiences', true, 1),
('experiences', 'header', 'text', 'subtitle', 'Discover the best of Ahangama and surroundings', true, 2),

-- Deals page header
('deals', 'header', 'text', 'title', 'Special Offers', true, 1),
('deals', 'header', 'text', 'subtitle', 'Save on your next stay with our exclusive deals', true, 2),

-- Contact page header
('contact', 'header', 'text', 'title', 'Get in Touch', true, 1),
('contact', 'header', 'text', 'subtitle', 'We''d love to hear from you', true, 2),
('contact', 'contact_info', 'text', 'phone', '+94711730345', true, 1),
('contact', 'contact_info', 'text', 'email', 'contact@KoLakeHouse.com', true, 2),
('contact', 'contact_info', 'text', 'address', 'Ahangama, Sri Lanka', true, 3),

-- Book page header
('book', 'header', 'text', 'title', 'Book Your Stay', true, 1),
('book', 'header', 'text', 'subtitle', 'Check availability and reserve your dates', true, 2)

ON CONFLICT (page_slug, section_id, field_name) DO NOTHING;

-- Comment
COMMENT ON TABLE page_content IS 'Stores all editable content for public pages in the Shadow CMS system';
COMMENT ON COLUMN page_content.page_slug IS 'URL slug of the page (home, rooms, gallery, etc.)';
COMMENT ON COLUMN page_content.section_id IS 'Section identifier within the page (hero, intro, cta, etc.)';
COMMENT ON COLUMN page_content.content_type IS 'Type of content (text, image, video, html, json)';
COMMENT ON COLUMN page_content.field_name IS 'Specific field name (title, subtitle, description, etc.)';
COMMENT ON COLUMN page_content.published_value IS 'Live content visible to public';
COMMENT ON COLUMN page_content.draft_value IS 'Draft content being edited (not yet published)';
