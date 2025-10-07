-- Test script to check if exclusive offers toggle works
-- Run this in Supabase SQL Editor to test

-- Check if the table exists and has data
SELECT id, title, available FROM exclusive_offers LIMIT 5;

-- Test a simple update (replace with actual ID from your table)
-- UPDATE exclusive_offers SET available = NOT available WHERE id = '800e8400-e29b-41d4-a716-446655440001';

-- Check if the trigger function exists
SELECT proname FROM pg_proc WHERE proname = 'update_updated_at_column';

-- Check if the trigger exists
SELECT tgname FROM pg_trigger WHERE tgname = 'update_exclusive_offers_updated_at';

-- Check RLS policies
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'exclusive_offers';
