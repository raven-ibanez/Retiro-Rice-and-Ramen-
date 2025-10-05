-- RETIRO RICE & RAMEN - Complete Menu Items Database
-- This script adds all menu categories and items with proper pricing and images

-- First, let's insert the menu categories with proper UUIDs
INSERT INTO categories (id, name, icon, sort_order, active, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Tonkatsu', '🥩', 1, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Ramen', '🍜', 2, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Side Dishes', '🥢', 3, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Silog Meals', '🍳', 4, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Store Specials', '⭐', 5, true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

-- TONKATSU CATEGORY
INSERT INTO menu_items (id, name, description, base_price, category, popular, available, image_url, created_at, updated_at) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Katsu Burger', 'Crispy breaded pork cutlet in a soft bun with fresh lettuce and special sauce', 129, '550e8400-e29b-41d4-a716-446655440001', false, true, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440002', 'Tonkatsu Rice', 'Classic breaded pork cutlet served with steamed rice and tonkatsu sauce', 149, '550e8400-e29b-41d4-a716-446655440001', true, true, 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440003', 'Katsu Rice & Coleslaw', 'Breaded pork cutlet with steamed rice and fresh coleslaw salad', 179, '550e8400-e29b-41d4-a716-446655440001', false, true, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440004', 'Katsu Ome Rice', 'Breaded pork cutlet topped with fluffy omelet over steamed rice', 179, '550e8400-e29b-41d4-a716-446655440001', true, true, 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440005', 'Katsudon', 'Breaded pork cutlet and egg over rice in a savory dashi broth', 189, '550e8400-e29b-41d4-a716-446655440001', true, true, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440006', 'Katsu Curry Rice', 'Crispy breaded pork cutlet served with Japanese curry sauce over rice', 189, '550e8400-e29b-41d4-a716-446655440001', true, true, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop', NOW(), NOW());

-- RAMEN CATEGORY
INSERT INTO menu_items (id, name, description, base_price, category, popular, available, image_url, created_at, updated_at) VALUES
('670e8400-e29b-41d4-a716-446655440001', 'Singapore Ramen', 'Spicy curry-flavored ramen with a unique Southeast Asian twist', 159, '550e8400-e29b-41d4-a716-446655440002', false, true, 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop', NOW(), NOW()),
('670e8400-e29b-41d4-a716-446655440002', 'Miso Tofu Ramen', 'Rich miso broth with silky tofu, green onions, and bamboo shoots', 159, '550e8400-e29b-41d4-a716-446655440002', false, true, 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop', NOW(), NOW()),
('670e8400-e29b-41d4-a716-446655440003', 'Buta Miso Ramen', 'Traditional miso ramen with tender pork belly and fresh vegetables', 159, '550e8400-e29b-41d4-a716-446655440002', true, true, 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=300&fit=crop', NOW(), NOW()),
('670e8400-e29b-41d4-a716-446655440004', 'Pork Curry Ramen', 'Rich curry-flavored broth with tender pork and aromatic spices', 229, '550e8400-e29b-41d4-a716-446655440002', false, true, 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=400&h=300&fit=crop', NOW(), NOW()),
('670e8400-e29b-41d4-a716-446655440005', 'Spicy Beef Ramen', 'Hot and spicy beef broth with tender beef slices and vegetables', 229, '550e8400-e29b-41d4-a716-446655440002', true, true, 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop', NOW(), NOW()),
('670e8400-e29b-41d4-a716-446655440006', 'Tonkatsu Ramen', 'Rich pork bone broth with crispy breaded pork cutlet and fresh toppings', 229, '550e8400-e29b-41d4-a716-446655440002', true, true, 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=300&fit=crop', NOW(), NOW()),
('670e8400-e29b-41d4-a716-446655440007', 'Tori Paitan Ramen', 'Creamy chicken broth with tender chicken and fresh vegetables', 229, '550e8400-e29b-41d4-a716-446655440002', false, true, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop', NOW(), NOW()),
('670e8400-e29b-41d4-a716-446655440008', 'Chasu Paitan Ramen', 'Rich and creamy pork broth with tender chashu pork and perfect noodles', 249, '550e8400-e29b-41d4-a716-446655440002', true, true, 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop', NOW(), NOW());

-- SIDE DISHES CATEGORY
INSERT INTO menu_items (id, name, description, base_price, category, popular, available, image_url, created_at, updated_at) VALUES
('680e8400-e29b-41d4-a716-446655440001', 'Kimchi', 'Traditional Korean fermented vegetables with spicy seasoning', 80, '550e8400-e29b-41d4-a716-446655440003', true, true, 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop', NOW(), NOW()),
('680e8400-e29b-41d4-a716-446655440002', 'Buttered Veggies', 'Fresh mixed vegetables lightly sautéed in butter', 109, '550e8400-e29b-41d4-a716-446655440003', false, true, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop', NOW(), NOW()),
('680e8400-e29b-41d4-a716-446655440003', 'Crispy Tofu', 'Golden fried tofu cubes with a crispy exterior and soft interior', 109, '550e8400-e29b-41d4-a716-446655440003', false, true, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop', NOW(), NOW()),
('680e8400-e29b-41d4-a716-446655440004', 'Agedashi Tofu', 'Deep-fried tofu served in a savory dashi broth with grated daikon', 159, '550e8400-e29b-41d4-a716-446655440003', true, true, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop', NOW(), NOW()),
('680e8400-e29b-41d4-a716-446655440005', 'Gyoza', 'Pan-fried Japanese dumplings filled with seasoned pork and vegetables', 159, '550e8400-e29b-41d4-a716-446655440003', true, true, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', NOW(), NOW()),
('680e8400-e29b-41d4-a716-446655440006', 'Japanese Fishcake', 'Traditional Japanese fishcake served with sweet soy sauce', 159, '550e8400-e29b-41d4-a716-446655440003', false, true, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop', NOW(), NOW()),
('680e8400-e29b-41d4-a716-446655440007', 'Okonomiyaki', 'Japanese savory pancake with cabbage, meat, and special okonomiyaki sauce', 185, '550e8400-e29b-41d4-a716-446655440003', true, true, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', NOW(), NOW()),
('680e8400-e29b-41d4-a716-446655440008', 'Ebi Fry', 'Crispy breaded shrimp served with tartar sauce and lemon', 199, '550e8400-e29b-41d4-a716-446655440003', false, true, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', NOW(), NOW());

-- SILOG MEALS CATEGORY
INSERT INTO menu_items (id, name, description, base_price, category, popular, available, image_url, created_at, updated_at) VALUES
('690e8400-e29b-41d4-a716-446655440001', 'Hotdog & Egg', 'Classic Filipino silog with hotdog and sunny-side-up egg over garlic rice', 99, '550e8400-e29b-41d4-a716-446655440004', true, true, 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop', NOW(), NOW()),
('690e8400-e29b-41d4-a716-446655440002', 'Chicken Nuggets', 'Crispy chicken nuggets with sunny-side-up egg and garlic rice', 99, '550e8400-e29b-41d4-a716-446655440004', false, true, 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop', NOW(), NOW()),
('690e8400-e29b-41d4-a716-446655440003', 'Embosilog', 'Filipino silog with sweet embutido, sunny-side-up egg, and garlic rice', 129, '550e8400-e29b-41d4-a716-446655440004', false, true, 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop', NOW(), NOW()),
('690e8400-e29b-41d4-a716-446655440004', 'Longsilog', 'Traditional silog with sweet longanisa sausage, egg, and garlic rice', 129, '550e8400-e29b-41d4-a716-446655440004', true, true, 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop', NOW(), NOW()),
('690e8400-e29b-41d4-a716-446655440005', 'Hungarian Sausage', 'Savory Hungarian sausage with sunny-side-up egg and garlic rice', 129, '550e8400-e29b-41d4-a716-446655440004', false, true, 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop', NOW(), NOW()),
('690e8400-e29b-41d4-a716-446655440006', 'Grilled Chicken', 'Tender grilled chicken with sunny-side-up egg and garlic rice', 140, '550e8400-e29b-41d4-a716-446655440004', true, true, 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=300&fit=crop', NOW(), NOW()),
('690e8400-e29b-41d4-a716-446655440007', 'Tapsilog', 'Premium silog with marinated beef tapa, egg, and garlic rice', 159, '550e8400-e29b-41d4-a716-446655440004', true, true, 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop', NOW(), NOW());

-- STORE SPECIALS CATEGORY
INSERT INTO menu_items (id, name, description, base_price, category, popular, available, image_url, created_at, updated_at) VALUES
('6a0e8400-e29b-41d4-a716-446655440001', 'Pork Bibimbap', 'Korean mixed rice bowl with marinated pork, vegetables, and spicy gochujang sauce', 159, '550e8400-e29b-41d4-a716-446655440005', true, true, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', NOW(), NOW()),
('6a0e8400-e29b-41d4-a716-446655440002', 'Supreme Bibimbap', 'Premium mixed rice bowl with beef, assorted vegetables, and house special sauce', 209, '550e8400-e29b-41d4-a716-446655440005', false, true, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', NOW(), NOW()),
('6a0e8400-e29b-41d4-a716-446655440003', 'Sirloin Tips', 'Tender sirloin tips grilled to perfection with vegetables and rice', 209, '550e8400-e29b-41d4-a716-446655440005', true, true, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', NOW(), NOW()),
('6a0e8400-e29b-41d4-a716-446655440004', 'Korean Beef Stew', 'Rich and hearty Korean beef stew with tender beef and vegetables', 299, '550e8400-e29b-41d4-a716-446655440005', true, true, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop', NOW(), NOW()),
('6a0e8400-e29b-41d4-a716-446655440005', 'Pork Salpicao', 'Tender pork cubes sautéed with garlic and soy sauce, served with rice', 299, '550e8400-e29b-41d4-a716-446655440005', false, true, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', NOW(), NOW()),
('6a0e8400-e29b-41d4-a716-446655440006', 'Korean Army Stew (with meat)', 'Spicy Korean army stew with meat, instant noodles, and vegetables', 309, '550e8400-e29b-41d4-a716-446655440005', true, true, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop', NOW(), NOW()),
('6a0e8400-e29b-41d4-a716-446655440007', 'Korean Army Stew', 'Spicy Korean army stew with instant noodles, vegetables, and cheese', 359, '550e8400-e29b-41d4-a716-446655440005', false, true, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop', NOW(), NOW());

-- Add some popular items as marked
UPDATE menu_items SET popular = true WHERE id IN (
  '660e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440006',
  '670e8400-e29b-41d4-a716-446655440003', '670e8400-e29b-41d4-a716-446655440005', '670e8400-e29b-41d4-a716-446655440006', '670e8400-e29b-41d4-a716-446655440008',
  '680e8400-e29b-41d4-a716-446655440001', '680e8400-e29b-41d4-a716-446655440004', '680e8400-e29b-41d4-a716-446655440005', '680e8400-e29b-41d4-a716-446655440007',
  '690e8400-e29b-41d4-a716-446655440001', '690e8400-e29b-41d4-a716-446655440004', '690e8400-e29b-41d4-a716-446655440006', '690e8400-e29b-41d4-a716-446655440007',
  '6a0e8400-e29b-41d4-a716-446655440001', '6a0e8400-e29b-41d4-a716-446655440003', '6a0e8400-e29b-41d4-a716-446655440004', '6a0e8400-e29b-41d4-a716-446655440006'
);

-- Update site settings for currency
UPDATE site_settings SET value = '₱' WHERE id = 'currency';
UPDATE site_settings SET value = 'PHP' WHERE id = 'currency_code';
