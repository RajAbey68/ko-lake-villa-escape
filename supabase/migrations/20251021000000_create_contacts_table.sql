-- Create contacts table for storing contact information
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role VARCHAR(100) NOT NULL, -- e.g., 'manager', 'team_leader', 'owner'
  title VARCHAR(200) NOT NULL, -- Display title
  name VARCHAR(200),
  phone VARCHAR(50) NOT NULL,
  whatsapp VARCHAR(50),
  languages TEXT[], -- Array of languages spoken
  location VARCHAR(200), -- e.g., 'Ahangama based', 'Villa-based', 'Remote'
  description TEXT,
  icon VARCHAR(50), -- Emoji or icon identifier
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active contacts
CREATE POLICY "Public can view active contacts"
  ON public.contacts
  FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated users can manage contacts
CREATE POLICY "Authenticated users can manage contacts"
  ON public.contacts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default contacts
INSERT INTO public.contacts (role, title, name, phone, whatsapp, languages, location, description, icon, display_order) VALUES
  ('manager', 'Group Manager', 'Manager', '+94711730345', '+94711730345', ARRAY['English'], 'Ahangama based', 'Available 24/7', '📱', 1),
  ('team_leader', 'Villa Team Leader', 'Team Leader', '+94711730345', '+94711730345', ARRAY['Sinhala', 'English'], 'Villa-based', 'On-site assistance', '👨‍💼', 2),
  ('owner', 'Owner Contact', 'Owner', '+94711730345', '+94711730345', ARRAY['English'], 'Remote', 'Direct line', '👤', 3);

-- Create index for faster queries
CREATE INDEX idx_contacts_active_order ON public.contacts(is_active, display_order);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON public.contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
