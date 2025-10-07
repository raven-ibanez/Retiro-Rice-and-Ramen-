-- Force delete ALL exclusive offers from the database
-- This will remove all existing exclusive offers completely

-- First, let's see what we have
SELECT COUNT(*) as total_before FROM exclusive_offers;
SELECT id, title, available FROM exclusive_offers;

-- Delete all records from exclusive_offers table
-- Using TRUNCATE for complete removal
TRUNCATE TABLE exclusive_offers RESTART IDENTITY CASCADE;

-- Alternative: If TRUNCATE doesn't work, use DELETE
-- DELETE FROM exclusive_offers;

-- Verify deletion
SELECT COUNT(*) as total_after FROM exclusive_offers;

-- Show confirmation
SELECT 'All exclusive offers have been forcefully deleted' as status;

-- Check if any data remains
SELECT id, title FROM exclusive_offers;
