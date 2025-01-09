-- Drop existing table if it exists
DROP TABLE IF EXISTS fitness_milestones;

-- Create fitness_milestones table with snake_case column names
CREATE TABLE fitness_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,
  target_value numeric NOT NULL CHECK (target_value > 0),
  unit text NOT NULL,
  target_date timestamptz NOT NULL,
  achieved_date timestamptz,
  category text NOT NULL CHECK (category IN ('strength', 'cardio', 'flexibility', 'other')),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE fitness_milestones ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own milestones"
  ON fitness_milestones
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own milestones"
  ON fitness_milestones
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own milestones"
  ON fitness_milestones
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own milestones"
  ON fitness_milestones
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_fitness_milestones_user_id ON fitness_milestones(user_id);
CREATE INDEX idx_fitness_milestones_target_date ON fitness_milestones(target_date);
