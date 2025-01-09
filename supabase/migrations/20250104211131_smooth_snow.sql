/*
  # Achievement System Migration

  1. Tables
    - user_achievements: Store unlocked achievements
    - user_streaks: Track user activity streaks
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add triggers for data management
*/

-- Drop existing achievements table if it exists
DROP TABLE IF EXISTS achievements;

-- Create user_achievements table
CREATE TABLE user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  achievement_id text NOT NULL,
  points integer NOT NULL CHECK (points >= 0),
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create unique constraint to prevent duplicate achievements
ALTER TABLE user_achievements
ADD CONSTRAINT unique_user_achievement 
UNIQUE (user_id, achievement_id);

-- Create index for faster lookups
CREATE INDEX user_achievements_user_id_idx ON user_achievements(user_id);

-- Enable RLS
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create user_streaks table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_streaks (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_log_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on streaks
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own streak" ON user_streaks;
DROP POLICY IF EXISTS "Users can upsert own streak" ON user_streaks;

-- Create streak policies
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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_user_streaks_timestamp ON user_streaks;

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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created_streak ON auth.users;

-- Create trigger for new user streak
CREATE TRIGGER on_auth_user_created_streak
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_streak();
