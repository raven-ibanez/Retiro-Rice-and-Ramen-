-- RETIRO RICE & RAMEN - Promotions Database
-- This script creates tables for managing dynamic promotion content

-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  subtitle VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  gradient_colors VARCHAR(50) NOT NULL DEFAULT 'from-retiro-red to-retiro-kimchi',
  badge_text VARCHAR(50) NOT NULL,
  promo_code VARCHAR(20) NOT NULL,
  valid_until VARCHAR(50) NOT NULL,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_promotions_active_sort ON promotions(active, sort_order);

-- Add promotion settings to site_settings table
INSERT INTO site_settings (id, value, type, description) VALUES
('promotions_enabled', 'true', 'boolean', 'Enable/disable promotion carousel'),
('promotion_auto_rotate', 'true', 'boolean', 'Enable auto-rotation of promotions'),
('promotion_rotation_speed', '5000', 'number', 'Auto-rotation speed in milliseconds (default: 5000ms = 5 seconds)'),
('promotion_max_display', '4', 'number', 'Maximum number of promotions to display')
ON CONFLICT (id) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Insert sample promotion data with proper UUIDs
INSERT INTO promotions (id, title, subtitle, description, image_url, gradient_colors, badge_text, promo_code, valid_until, active, sort_order) VALUES
('700e8400-e29b-41d4-a716-446655440001', '20% OFF', 'Premium Ramen Bowls & Tonkatsu', 'Get 20% OFF on All Premium Ramen Bowls & Tonkatsu Specials', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200&h=600&fit=crop&crop=center', 'from-retiro-red to-retiro-kimchi', '🔥 LIMITED TIME', 'RETIRO20', 'Dec 31, 2024', true, 1),

('700e8400-e29b-41d4-a716-446655440002', 'BUY 2 GET 1 FREE', 'Silog Meals Special', 'Buy any 2 Silog Meals and get 1 FREE! Perfect for sharing', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=1200&h=600&fit=crop&crop=center', 'from-retiro-kimchi to-retiro-red', '🍳 WEEKEND SPECIAL', 'SILOG3', 'Weekends Only', true, 2),

('700e8400-e29b-41d4-a716-446655440003', 'FREE DELIVERY', 'Orders Over ₱500', 'Enjoy FREE delivery on orders above ₱500. No minimum order for pickup!', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=600&fit=crop&crop=center', 'from-retiro-red to-retiro-gold', '🚚 DELIVERY SPECIAL', 'FREEDEL', 'All Week', true, 3),

('700e8400-e29b-41d4-a716-446655440004', 'NEW ITEM ALERT', 'Korean Army Stew', 'Try our new Korean Army Stew - Rich, spicy, and absolutely delicious!', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1200&h=600&fit=crop&crop=center', 'from-retiro-gold to-retiro-kimchi', '🆕 NEW ARRIVAL', 'NEWSTEW', 'Limited Time', true, 4),

('700e8400-e29b-41d4-a716-446655440005', 'HAPPY HOUR', '50% OFF Drinks', 'Get 50% OFF on all drinks during our happy hour from 3-6 PM', 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1200&h=600&fit=crop&crop=center', 'from-retiro-gold to-retiro-red', '🍹 HAPPY HOUR', 'HAPPY50', '3-6 PM Daily', false, 5),

('700e8400-e29b-41d4-a716-446655440006', 'STUDENT DISCOUNT', '15% OFF for Students', 'Show your student ID and get 15% OFF on your entire order', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop&crop=center', 'from-retiro-kimchi to-retiro-gold', '🎓 STUDENT SPECIAL', 'STUDENT15', 'Valid Always', false, 6);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_promotions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_promotions_updated_at
  BEFORE UPDATE ON promotions
  FOR EACH ROW
  EXECUTE FUNCTION update_promotions_updated_at();

-- Create a view for active promotions ordered by sort_order
CREATE OR REPLACE VIEW active_promotions AS
SELECT * FROM promotions 
WHERE active = true 
ORDER BY sort_order ASC;

-- Grant necessary permissions (adjust based on your Supabase setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON promotions TO authenticated;
-- GRANT SELECT ON active_promotions TO anon;

-- Sample queries for admin dashboard:

-- Get all promotions for admin management
-- SELECT * FROM promotions ORDER BY sort_order, created_at DESC;

-- Get only active promotions for display
-- SELECT * FROM active_promotions;

-- Update a promotion
-- UPDATE promotions SET 
--   title = 'NEW TITLE',
--   subtitle = 'NEW SUBTITLE',
--   active = true
-- WHERE id = '700e8400-e29b-41d4-a716-446655440001';

-- Toggle promotion status
-- UPDATE promotions SET active = NOT active WHERE id = '700e8400-e29b-41d4-a716-446655440001';

-- Reorder promotions
-- UPDATE promotions SET sort_order = 1 WHERE id = '700e8400-e29b-41d4-a716-446655440002';

-- Add new promotion
-- INSERT INTO promotions (title, subtitle, description, image_url, badge_text, promo_code, valid_until, sort_order)
-- VALUES ('NEW PROMO', 'New Subtitle', 'Description', 'image_url', 'Badge', 'CODE', 'Valid Until', 5);
