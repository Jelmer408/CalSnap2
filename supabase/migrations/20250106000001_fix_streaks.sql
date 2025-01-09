-- Drop existing streak related objects
DROP TRIGGER IF EXISTS update_streak_on_entry ON calorie_entries;
DROP FUNCTION IF EXISTS calculate_streak();
DROP FUNCTION IF EXISTS update_streak();

-- Ensure user_streaks table has correct structure
CREATE TABLE IF NOT EXISTS user_streaks (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_log_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT positive_streaks CHECK (current_streak >= 0 AND longest_streak >= 0)
);

-- Function to calculate streak
CREATE OR REPLACE FUNCTION calculate_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_entry timestamptz;
  entry_date date;
  last_date date;
  streak_record RECORD;
BEGIN
  -- Get the user's streak record
  SELECT * INTO streak_record 
  FROM user_streaks 
  WHERE user_id = NEW.user_id;

  -- If no streak record exists, create one
  IF streak_record IS NULL THEN
    INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_log_date)
    VALUES (NEW.user_id, 1, 1, NEW.timestamp)
    RETURNING * INTO streak_record;
    RETURN NEW;
  END IF;

  -- Get the date of the new entry
  entry_date := date(NEW.timestamp);
  
  -- If there's a last log date, use it
  IF streak_record.last_log_date IS NOT NULL THEN
    last_date := date(streak_record.last_log_date);
    
    -- Same day entry - no streak change
    IF entry_date = last_date THEN
      RETURN NEW;
    END IF;

    -- Next day entry - increment streak
    IF entry_date = last_date + 1 THEN
      UPDATE user_streaks 
      SET 
        current_streak = current_streak + 1,
        longest_streak = GREATEST(longest_streak, current_streak + 1),
        last_log_date = NEW.timestamp,
        updated_at = now()
      WHERE user_id = NEW.user_id;
      RETURN NEW;
    END IF;

    -- Gap in entries - reset streak
    IF entry_date > last_date + 1 THEN
      UPDATE user_streaks 
      SET 
        current_streak = 1,
        last_log_date = NEW.timestamp,
        updated_at = now()
      WHERE user_id = NEW.user_id;
      RETURN NEW;
    END IF;
  ELSE
    -- First entry ever - start streak
    UPDATE user_streaks 
    SET 
      current_streak = 1,
      longest_streak = GREATEST(longest_streak, 1),
      last_log_date = NEW.timestamp,
      updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for streak calculation
CREATE TRIGGER update_streak_on_entry
  AFTER INSERT ON calorie_entries
  FOR EACH ROW
  EXECUTE FUNCTION calculate_streak();

-- Function to reset streaks at midnight
CREATE OR REPLACE FUNCTION reset_expired_streaks()
RETURNS void AS $$
BEGIN
  UPDATE user_streaks
  SET 
    current_streak = 0,
    last_log_date = NULL,
    updated_at = now()
  WHERE last_log_date < current_date - interval '1 day';
END;
$$ LANGUAGE plpgsql;
