import { model, generationConfig } from './config';
import { ActivityLevel } from '../../components/settings/ActivityLevelSelector';
import { GoalType, WeightRate } from '../../components/settings/WeightGoalSection';
import { calculateBMR } from '../calculations/bmr';
import { calculateTDEE } from '../calculations/tdee';
import { adjustForGoal } from '../calculations/goalAdjustment';

interface UserMetrics {
  weight: number;
  weightUnit: 'kg' | 'lbs';
  height: number;
  heightUnit: 'cm' | 'ft';
  age: number;
  sex: 'male' | 'female' | 'other';
}

interface CalorieCalculationParams {
  metrics: UserMetrics;
  activityLevel: ActivityLevel;
  goalType: GoalType;
  rate?: WeightRate;
}

export async function calculateCalories({
  metrics,
  activityLevel,
  goalType,
  rate
}: CalorieCalculationParams): Promise<number> {
  try {
    // Calculate BMR using Mifflin-St Jeor Equation
    const bmr = calculateBMR(
      metrics.weight,
      metrics.weightUnit,
      metrics.height,
      metrics.heightUnit,
      metrics.age,
      metrics.sex
    );

    // Calculate TDEE based on activity level
    const tdee = calculateTDEE(bmr, activityLevel);

    // Adjust based on weight goal
    const recommendedCalories = adjustForGoal(tdee, goalType, rate);

    // Ensure minimum safe calories
    const minCalories = metrics.sex === 'female' ? 1200 : 1500;
    return Math.max(recommendedCalories, minCalories);
  } catch (error) {
    console.error('Error calculating calories:', error);
    return 2000; // Safe default
  }
}
