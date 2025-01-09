/*
  # Calorie Tracking Tables

  1. New Tables
    - calorie_entries
      - id (uuid, primary key)
      - user_id (uuid, references profiles)
      - name (text)
      - calories (integer)
      - meal_type (text)
      - timestamp (timestamptz)
      - emoji (text)
    
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE calorie_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  name text NOT NULL,
  calories integer NOT NULL,
  meal_type text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  emoji text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE calorie_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own entries"
  ON calorie_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entries"
  ON calorie_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries"
  ON calorie_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
