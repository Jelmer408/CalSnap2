interface MealCalories {
  breakfast: number;
  lunch: number;
  dinner: number;
}

export function distributeMealCalories(totalCalories: number): MealCalories {
  // Distribution percentages for main meals
  const distribution = {
    breakfast: 0.3,  // 30%
    lunch: 0.4,      // 40%
    dinner: 0.3      // 30%
  };

  // Calculate calories for each meal and round to nearest integer
  const breakfast = Math.round(totalCalories * distribution.breakfast);
  const lunch = Math.round(totalCalories * distribution.lunch);
  // Ensure total adds up exactly by calculating dinner as remainder
  const dinner = totalCalories - breakfast - lunch;

  return {
    breakfast,
    lunch,
    dinner
  };
}
