/*
  # Fix Meal Type Column

  1. Changes
    - Rename meal_type column to mealType for consistency
    - Add check constraint for valid meal types
    - Migrate existing data

  2. Security
    - Maintains existing RLS policies
*/

-- Rename column with temp name first to avoid conflicts
ALTER TABLE calorie_entries 
RENAME COLUMN meal_type TO meal_type_old;

-- Add new column with correct name
ALTER TABLE calorie_entries 
ADD COLUMN "mealType" text NOT NULL DEFAULT 'snack'
CHECK ("mealType" IN ('breakfast', 'lunch', 'dinner', 'snack'));

-- Copy data from old column to new column
UPDATE calorie_entries 
SET "mealType" = meal_type_old;

-- Drop old column
ALTER TABLE calorie_entries 
DROP COLUMN meal_type_old;
