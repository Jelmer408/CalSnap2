/*
  # Achievement Tracking Tables

  1. New Tables
    - achievements
      - id (uuid, primary key)
      - user_id (uuid, references profiles)
      - achievement_id (text)
      - unlocked_at (timestamptz)
      - points (integer)
    
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  achievement_id text NOT NULL,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  points integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own achievements"
  ON achievements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
