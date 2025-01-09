-- Update user_settings table with new columns
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS height numeric;
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS age integer;
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS sex text CHECK (sex IN ('male', 'female', 'other'));
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS activity_level text;
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS goal_type text;
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS weight_rate numeric;

-- Create function to update calories based on weight
CREATE OR REPLACE FUNCTION update_calories_on_weight_change()
RETURNS TRIGGER AS $$
DECLARE
  user_settings record;
  new_calories integer;
BEGIN
  -- Get user settings
  SELECT * INTO user_settings 
  FROM user_settings 
  WHERE user_id = NEW.user_id;

  -- Calculate new calories if we have all required data
  IF user_settings.height IS NOT NULL 
     AND user_settings.age IS NOT NULL 
     AND user_settings.sex IS NOT NULL 
     AND user_settings.activity_level IS NOT NULL THEN
    
    -- Basic BMR calculation using Mifflin-St Jeor Equation
    new_calories := (
      CASE 
        WHEN user_settings.sex = 'male' THEN
          (10 * NEW.weight + 6.25 * user_settings.height - 5 * user_settings.age + 5)
        WHEN user_settings.sex = 'female' THEN
          (10 * NEW.weight + 6.25 * user_settings.height - 5 * user_settings.age - 161)
        ELSE
          (10 * NEW.weight + 6.25 * user_settings.height - 5 * user_settings.age - 78)
      END
    );

    -- Apply activity multiplier
    new_calories := (
      CASE user_settings.activity_level
        WHEN 'sedentary' THEN new_calories * 1.2
        WHEN 'light' THEN new_calories * 1.375
        WHEN 'moderate' THEN new_calories * 1.55
        WHEN 'very' THEN new_calories * 1.725
        WHEN 'extreme' THEN new_calories * 1.9
        ELSE new_calories * 1.2
      END
    )::integer;

    -- Adjust for goal type
    IF user_settings.goal_type = 'lose' THEN
      new_calories := new_calories - (500 * user_settings.weight_rate)::integer;
    ELSIF user_settings.goal_type = 'gain' THEN
      new_calories := new_calories + (500 * user_settings.weight_rate)::integer;
    END IF;

    -- Update daily goal
    UPDATE user_settings 
    SET daily_goal = new_calories
    WHERE user_id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for weight entries
DROP TRIGGER IF EXISTS update_calories_trigger ON weight_entries;
CREATE TRIGGER update_calories_trigger
  AFTER INSERT OR UPDATE ON weight_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_calories_on_weight_change();
