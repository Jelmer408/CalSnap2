/*
  Fix Achievement System - Complete Rebuild
  
  Run this SQL in the Supabase SQL Editor to fix the achievement system
*/

-- Drop existing tables
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;

-- Create the achievements reference table
CREATE TABLE achievements (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  points integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on the reference table
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read achievements
CREATE POLICY "Anyone can read achievements" 
  ON achievements 
  FOR SELECT 
  TO authenticated 
  USING (true);
  
-- Insert all achievement IDs from the application
INSERT INTO achievements (id, name, description, category, points) VALUES
  ('first-entry', 'First Bite', 'Log your first food entry', 'beginner', 10),
  ('calorie-goal', 'Goal Setter', 'Set a daily calorie goal', 'beginner', 15),
  ('complete-day', 'Day Complete', 'Log all your meals for an entire day', 'beginner', 20),
  ('streak-3', 'Consistency Kickoff', 'Log food for 3 consecutive days', 'consistency', 25),
  ('streak-7', 'Week Warrior', 'Log food for 7 consecutive days', 'consistency', 50),
  ('streak-14', 'Fortnight Foodie', 'Log food for 14 consecutive days', 'consistency', 75),
  ('streak-30', 'Month Master', 'Log food for 30 consecutive days', 'consistency', 100),
  ('under-goal', 'Under Control', 'Stay under your calorie goal for a day', 'goals', 20),
  ('perfect-week', 'Perfect Week', 'Stay within 100 calories of your goal every day for a week', 'goals', 80),
  ('balanced-day', 'Balanced Day', 'Log balanced meals with protein, carbs, and vegetables', 'goals', 30),
  ('within-budget', 'Budget Maestro', 'Stay within your calorie budget 5 days in a row', 'goals', 60),
  ('variety-5', 'Variety Starter', 'Log 5 different foods', 'variety', 20),
  ('variety-15', 'Diverse Diet', 'Log 15 different foods', 'variety', 40),
  ('variety-30', 'Food Explorer', 'Log 30 different foods', 'variety', 60),
  ('international', 'International Palate', 'Log foods from at least 3 different cuisines', 'variety', 35),
  ('weekend-warrior', 'Weekend Warrior', 'Log all meals during the weekend', 'special', 40),
  ('early-bird', 'Early Bird', 'Log breakfast before 8 AM', 'special', 25),
  ('night-owl', 'Night Owl', 'Log dinner after 8 PM', 'special', 25),
  ('water-tracker', 'Hydration Hero', 'Log water consumption for 3 consecutive days', 'special', 30),
  ('calorie-master', 'Calorie Master', 'Track every day for 2 months', 'expert', 150),
  ('nutrition-scholar', 'Nutrition Scholar', 'Log 100 different food items', 'expert', 120);

-- Create user_achievements table with correct structure
CREATE TABLE user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id text REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
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