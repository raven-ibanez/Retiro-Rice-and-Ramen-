-- Manual delete of all exclusive offers
-- Run these commands one by one if the above doesn't work

-- Step 1: Check what offers exist
SELECT id, title, available FROM exclusive_offers;

-- Step 2: Delete each offer by ID (replace with actual IDs from step 1)
-- DELETE FROM exclusive_offers WHERE id = '800e8400-e29b-41d4-a716-446655440001';
-- DELETE FROM exclusive_offers WHERE id = '800e8400-e29b-41d4-a716-446655440002';
-- DELETE FROM exclusive_offers WHERE id = '800e8400-e29b-41d4-a716-446655440003';
-- DELETE FROM exclusive_offers WHERE id = '800e8400-e29b-41d4-a716-446655440004';
-- DELETE FROM exclusive_offers WHERE id = '800e8400-e29b-41d4-a716-446655440005';

-- Step 3: Alternative - Delete all at once
DELETE FROM exclusive_offers;

-- Step 4: Verify all are gone
SELECT COUNT(*) as remaining_offers FROM exclusive_offers;
SELECT 'All offers deleted' as status;
