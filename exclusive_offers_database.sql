-- Create exclusive_offers table
CREATE TABLE IF NOT EXISTS exclusive_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2) NOT NULL,
  discount_text VARCHAR(50),
  image_url TEXT,
  badge_text VARCHAR(100),
  available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE exclusive_offers ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'exclusive_offers' 
    AND policyname = 'Anyone can read exclusive offers'
  ) THEN
    CREATE POLICY "Anyone can read exclusive offers"
      ON exclusive_offers
      FOR SELECT
      TO public
      USING (available = true);
  END IF;
END $$;

-- Drop existing policies if they exist to recreate them properly
DROP POLICY IF EXISTS "Authenticated users can manage exclusive offers" ON exclusive_offers;

-- Create policies for authenticated admin access
CREATE POLICY "Authenticated users can manage exclusive offers"
  ON exclusive_offers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Also allow service_role to manage (for admin operations)
DROP POLICY IF EXISTS "Service role can manage exclusive offers" ON exclusive_offers;

CREATE POLICY "Service role can manage exclusive offers"
  ON exclusive_offers
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create updated_at trigger for exclusive_offers (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_exclusive_offers_updated_at'
  ) THEN
    CREATE TRIGGER update_exclusive_offers_updated_at
      BEFORE UPDATE ON exclusive_offers
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Create exclusive offers settings in site_settings
INSERT INTO site_settings (id, value, type, description) VALUES
('exclusive_offers_enabled', 'true', 'boolean', 'Enable or disable the exclusive offers section'),
('exclusive_offers_auto_rotate', 'true', 'boolean', 'Enable auto-rotation for exclusive offers carousel'),
('exclusive_offers_rotation_speed', '6000', 'number', 'Auto-rotation speed in milliseconds'),
('exclusive_offers_title', 'Premium Offerings', 'text', 'Title for the exclusive offers section'),
('exclusive_offers_subtitle', 'Discover our signature collection of premium dishes crafted with exceptional ingredients', 'text', 'Subtitle for the exclusive offers section'),
('exclusive_offers_badge', 'EXCLUSIVE COLLECTION', 'text', 'Badge text for the exclusive offers section')
ON CONFLICT (id) DO UPDATE SET
value = EXCLUDED.value,
updated_at = NOW();

-- Insert sample exclusive offers data (with conflict handling)
INSERT INTO exclusive_offers (id, title, subtitle, description, price, original_price, discount_text, image_url, badge_text, available, display_order) VALUES
('800e8400-e29b-41d4-a716-446655440001', 'Premium Wagyu Ramen', 'Limited Edition', 'Our signature wagyu beef ramen with truffle oil and premium ingredients', 899.00, 1299.00, '30% OFF', 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600&h=400&fit=crop', 'EXCLUSIVE', true, 1),
('800e8400-e29b-41d4-a716-446655440002', 'Chef''s Special Omakase', 'Daily Selection', 'Chef''s daily selection of premium dishes served in authentic Japanese style', 699.00, 999.00, '25% OFF', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop', 'CHEF SPECIAL', true, 2),
('800e8400-e29b-41d4-a716-446655440003', 'Diamond Collection Set', 'Ultimate Experience', 'Complete dining experience with premium ramen, appetizers, and dessert', 1299.00, 1899.00, '35% OFF', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop', 'DIAMOND', false, 3),
('800e8400-e29b-41d4-a716-446655440004', 'Truffle Gold Ramen', 'Ultra Premium', 'Premium ramen with black truffle, gold leaf, and the finest ingredients', 1599.00, 2299.00, '30% OFF', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&h=400&fit=crop', 'GOLD SPECIAL', true, 4),
('800e8400-e29b-41d4-a716-446655440005', 'Black Diamond Ramen', 'Rare Collection', 'Exclusive ramen with black garlic, premium wagyu, and diamond-grade ingredients', 1999.00, 2999.00, '33% OFF', 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=600&h=400&fit=crop', 'BLACK DIAMOND', true, 5)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  discount_text = EXCLUDED.discount_text,
  image_url = EXCLUDED.image_url,
  badge_text = EXCLUDED.badge_text,
  available = EXCLUDED.available,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

-- Sample queries for testing
-- Get all exclusive offers ordered by display_order
SELECT * FROM exclusive_offers ORDER BY display_order ASC;

-- Get only available exclusive offers
SELECT * FROM exclusive_offers WHERE available = true ORDER BY display_order ASC;

-- Update an exclusive offer
-- UPDATE exclusive_offers SET title = 'New Title', price = 999.00, updated_at = NOW() WHERE id = '800e8400-e29b-41d4-a716-446655440001';

-- Toggle availability
-- UPDATE exclusive_offers SET available = NOT available, updated_at = NOW() WHERE id = '800e8400-e29b-41d4-a716-446655440001';

-- Get exclusive offers settings
SELECT * FROM site_settings WHERE id LIKE 'exclusive_offers_%';

-- Test query to check if updates work (uncomment to test)
-- UPDATE exclusive_offers SET available = NOT available WHERE id = '800e8400-e29b-41d4-a716-446655440001';
-- SELECT id, title, available, updated_at FROM exclusive_offers WHERE id = '800e8400-e29b-41d4-a716-446655440001';

-- Test CRUD operations (uncomment to test)
-- Test INSERT
-- INSERT INTO exclusive_offers (title, subtitle, description, price, original_price, discount_text, image_url, badge_text, available, display_order) 
-- VALUES ('Test Offer', 'Test Subtitle', 'Test Description', 100.00, 150.00, '10% OFF', 'https://example.com/image.jpg', 'TEST', true, 999);

-- Test UPDATE
-- UPDATE exclusive_offers SET title = 'Updated Test Offer' WHERE title = 'Test Offer';

-- Test DELETE
-- DELETE FROM exclusive_offers WHERE title = 'Updated Test Offer';

-- Check current policies
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'exclusive_offers';
