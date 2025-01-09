-- Add dietary_restrictions column to user_settings table
ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS dietary_restrictions TEXT[];

-- Update the handle_new_user_settings function to include dietary_restrictions
CREATE OR REPLACE FUNCTION handle_new_user_settings()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_settings (user_id, dietary_restrictions)
  VALUES (NEW.id, ARRAY[]::TEXT[]);
  RETURN NEW;
END;
$$ language plpgsql SECURITY DEFINER;
