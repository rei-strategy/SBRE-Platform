-- Remove the foreign key constraint on profiles.id to allow managed users
-- (users who do not have a corresponding auth.users record)

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
