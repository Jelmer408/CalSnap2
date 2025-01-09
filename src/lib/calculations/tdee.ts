import { ActivityLevel } from '../../components/settings/ActivityLevelSelector';

// Activity multipliers based on scientific research
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,    // Little to no exercise
  light: 1.375,      // Light exercise 1-3 days/week
  moderate: 1.55,    // Moderate exercise 3-5 days/week
  very: 1.725,       // Heavy exercise 6-7 days/week
  extreme: 1.9       // Very heavy exercise, physical job
};

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}
