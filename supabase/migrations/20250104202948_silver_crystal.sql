/*
  # Fix User Settings Policies
  
  1. Changes
    - Add missing INSERT policy for user_settings
    - Fix policy conditions
  
  2. Security
    - Allow authenticated users to insert and update their own settings
*/

-- Drop existing policies to clean up
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;

-- Recreate INSERT policy with correct conditions
CREATE POLICY "Users can insert own settings"
  ON user_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Ensure UPSERT works by allowing updates through INSERT
CREATE POLICY "Users can upsert own settings"
  ON user_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
