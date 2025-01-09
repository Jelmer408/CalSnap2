/*
  # Fitness Tracking Tables

  1. New Tables
    - weight_entries: Track user weight entries over time
    - fitness_goals: Store user fitness goals and targets
    - fitness_milestones: Track fitness milestones and achievements

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
*/

-- Weight Entries Table
CREATE TABLE weight_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  weight numeric NOT NULL CHECK (weight > 0),
  date timestamptz NOT NULL DEFAULT now(),
  note text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weight_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own weight entries"
  ON weight_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight entries"
  ON weight_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own weight entries"
  ON weight_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Fitness Goals Table
CREATE TABLE fitness_goals (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  target_weight numeric NOT NULL CHECK (target_weight > 0),
  start_weight numeric NOT NULL CHECK (start_weight > 0),
  start_date timestamptz NOT NULL DEFAULT now(),
  target_date timestamptz NOT NULL,
  goal_type text NOT NULL CHECK (goal_type IN ('gain', 'lose', 'maintain')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE fitness_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own fitness goals"
  ON fitness_goals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own fitness goals"
  ON fitness_goals
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Fitness Milestones Table
CREATE TABLE fitness_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,
  target_value numeric NOT NULL,
  unit text NOT NULL,
  target_date timestamptz NOT NULL,
  achieved_date timestamptz,
  category text NOT NULL CHECK (category IN ('strength', 'cardio', 'flexibility', 'other')),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE fitness_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own milestones"
  ON fitness_milestones
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own milestones"
  ON fitness_milestones
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add weight_unit to user_settings
ALTER TABLE user_settings 
ADD COLUMN IF NOT EXISTS weight_unit text NOT NULL DEFAULT 'kg';

-- Create updated_at trigger for fitness_goals
CREATE TRIGGER update_fitness_goals_timestamp
  BEFORE UPDATE ON fitness_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
