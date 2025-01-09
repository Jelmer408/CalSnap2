import { MealItem } from '../../../types/mealPlan';

export function validateMeal(meal: MealItem): boolean {
  // Only validate required fields and basic numbers
  if (!meal.name || !meal.timing || !meal.calories || !meal.macros || !meal.ingredients) {
    console.error('Missing required meal fields');
    return false;
  }

  if (meal.calories <= 0 || meal.prepTime <= 0) {
    console.error('Invalid meal numbers');
    return false;
  }

  // Basic macro validation - just ensure they exist and are positive numbers
  const { protein, carbs, fat } = meal.macros;
  if (typeof protein !== 'number' || typeof carbs !== 'number' || typeof fat !== 'number' ||
      protein < 0 || carbs < 0 || fat < 0) {
    console.error('Invalid macro values');
    return false;
  }

  return true;
}
