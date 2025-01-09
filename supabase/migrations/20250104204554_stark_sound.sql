/*
  # Fix Fitness Goals Constraints

  1. Changes
    - Drop and recreate weight check constraints with proper ranges
    - Add validation for goal types and dates
    - Add trigger for weight validation based on goal type

  2. Security
    - Maintains existing RLS policies
    - Ensures data integrity with proper constraints

  3. Notes
    - Weight ranges: 20-500 (kg/lbs)
    - Goal types: gain, lose, maintain
    - Target date must be after start date
*/

-- Drop existing constraints if they exist
DO $$ 
BEGIN
  ALTER TABLE fitness_goals 
  DROP CONSTRAINT IF EXISTS fitness_goals_target_weight_check;
  
  ALTER TABLE fitness_goals 
  DROP CONSTRAINT IF EXISTS fitness_goals_start_weight_check;
  
  ALTER TABLE fitness_goals 
  DROP CONSTRAINT IF EXISTS fitness_goals_target_date_check;
  
  ALTER TABLE fitness_goals 
  DROP CONSTRAINT IF EXISTS fitness_goals_goal_type_check;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Add new check constraints with reasonable ranges
ALTER TABLE fitness_goals
ADD CONSTRAINT fitness_goals_target_weight_check 
CHECK (target_weight BETWEEN 20 AND 500);

ALTER TABLE fitness_goals
ADD CONSTRAINT fitness_goals_start_weight_check 
CHECK (start_weight BETWEEN 20 AND 500);

-- Add constraint to ensure target date is in the future
ALTER TABLE fitness_goals
ADD CONSTRAINT fitness_goals_target_date_check
CHECK (target_date > start_date);

-- Add constraint to ensure goal type is valid
ALTER TABLE fitness_goals
ADD CONSTRAINT fitness_goals_goal_type_check
CHECK (goal_type IN ('gain', 'lose', 'maintain'));

-- Create or replace the validation function
CREATE OR REPLACE FUNCTION validate_fitness_goal()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate goal type based on weight difference
  IF NEW.goal_type = 'gain' AND NEW.target_weight <= NEW.start_weight THEN
    RAISE EXCEPTION 'Target weight must be greater than start weight for gain goal';
  END IF;
  
  IF NEW.goal_type = 'lose' AND NEW.target_weight >= NEW.start_weight THEN
    RAISE EXCEPTION 'Target weight must be less than start weight for lose goal';
  END IF;
  
  IF NEW.goal_type = 'maintain' AND NEW.target_weight != NEW.start_weight THEN
    RAISE EXCEPTION 'Target weight must equal start weight for maintain goal';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS validate_fitness_goal_trigger ON fitness_goals;

-- Create new trigger
CREATE TRIGGER validate_fitness_goal_trigger
  BEFORE INSERT OR UPDATE ON fitness_goals
  FOR EACH ROW
  EXECUTE FUNCTION validate_fitness_goal();
