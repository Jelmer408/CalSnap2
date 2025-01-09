/*
  # Add Insert Policy for User Settings
  
  1. Changes
    - Add INSERT policy for user_settings table
    - Use correct pg_policies column names
  
  2. Security
    - Allow authenticated users to insert their own settings
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_settings' 
    AND policyname = 'Users can insert own settings'
  ) THEN
    CREATE POLICY "Users can insert own settings"
      ON user_settings
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
