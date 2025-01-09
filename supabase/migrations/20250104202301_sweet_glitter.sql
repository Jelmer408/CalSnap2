/*
  # User Settings Table

  1. New Tables
    - user_settings
      - user_id (uuid, primary key)
      - daily_goal (integer)
      - weight_unit (text)
      - height_unit (text)
      - activity_level (text)
      - goal_type (text)
      - weight_rate (numeric)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create user settings table
CREATE TABLE user_settings (
  user_id uuid PRIMARY KEY REFERENCES profiles(id),
  daily_goal integer NOT NULL DEFAULT 2000,
  weight_unit text NOT NULL DEFAULT 'kg',
  height_unit text NOT NULL DEFAULT 'cm',
  activity_level text NOT NULL DEFAULT 'moderate',
  goal_type text NOT NULL DEFAULT 'maintain',
  weight_rate numeric NOT NULL DEFAULT 0.5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own settings"
  ON user_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger for updating timestamp
CREATE TRIGGER update_user_settings_timestamp
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create default settings for new users
CREATE OR REPLACE FUNCTION handle_new_user_settings()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ language plpgsql SECURITY DEFINER;

-- Create trigger for new user settings
CREATE TRIGGER on_auth_user_created_settings
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_settings();
