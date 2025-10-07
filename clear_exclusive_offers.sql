-- Clear all exclusive offers from the database
-- This will remove all existing exclusive offers

-- Delete all records from exclusive_offers table
DELETE FROM exclusive_offers;

-- Verify that all offers have been removed
SELECT COUNT(*) as remaining_offers FROM exclusive_offers;

-- Optional: Reset the sequence if you want to start fresh with IDs
-- This is not necessary but can be helpful for clean IDs
-- ALTER SEQUENCE exclusive_offers_id_seq RESTART WITH 1;

-- Show confirmation
SELECT 'All exclusive offers have been cleared' as status;
