/*
  # Add User Streaks Table

  1. New Tables
    - `user_streaks`
      - `user_id` (uuid, primary key)
      - `current_streak` (integer)
      - `longest_streak` (integer)
      - `last_log_date` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create user_streaks table
CREATE TABLE user_streaks (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_log_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own streak"
  ON user_streaks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own streak"
  ON user_streaks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger for updating timestamp
CREATE TRIGGER update_user_streaks_timestamp
  BEFORE UPDATE ON user_streaks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create default streak for new users
CREATE OR REPLACE FUNCTION handle_new_user_streak()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_streaks (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ language plpgsql SECURITY DEFINER;

-- Create trigger for new user streak
CREATE TRIGGER on_auth_user_created_streak
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_streak();
