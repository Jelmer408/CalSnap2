import { GoalType, WeightRate } from '../../components/settings/WeightGoalSection';

// 1kg of fat = 7700 calories
const CALORIES_PER_KG = 7700;

export function adjustForGoal(
  tdee: number, 
  goalType: GoalType, 
  rate?: WeightRate
): number {
  if (goalType === 'maintain') {
    return tdee;
  }

  const weeklyCalorieAdjustment = (rate || 0.5) * CALORIES_PER_KG;
  const dailyAdjustment = Math.round(weeklyCalorieAdjustment / 7);

  return goalType === 'lose' 
    ? tdee - dailyAdjustment
    : tdee + dailyAdjustment;
}
