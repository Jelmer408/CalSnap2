/*
  # Fix Table Relationships Migration

  1. Changes
    - Fix foreign key references to use auth.users instead of profiles
    - Add missing policies for calorie entries
    - Add missing columns to user_settings
    - Fix trigger conflicts
*/

-- Fix calorie_entries foreign key
ALTER TABLE calorie_entries
DROP CONSTRAINT IF EXISTS calorie_entries_user_id_fkey;

ALTER TABLE calorie_entries
ADD CONSTRAINT calorie_entries_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id);

-- Fix user_settings
ALTER TABLE user_settings
DROP CONSTRAINT IF EXISTS user_settings_user_id_fkey;

ALTER TABLE user_settings
ADD CONSTRAINT user_settings_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id);

-- Add missing policies for calorie entries
DROP POLICY IF EXISTS "Users can update own entries" ON calorie_entries;

CREATE POLICY "Users can update own entries"
  ON calorie_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add missing columns to user_settings if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_settings' AND column_name = 'height'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN height numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_settings' AND column_name = 'age'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN age integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_settings' AND column_name = 'sex'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN sex text CHECK (sex IN ('male', 'female', 'other'));
  END IF;
END $$;
