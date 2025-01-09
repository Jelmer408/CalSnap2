import { DailyMealPlan } from '../../../types/mealPlan';

export function parsePlanResponse(text: string, totalCalories: number): Omit<DailyMealPlan, 'id' | 'date'> | null {
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return null;

    const meals = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(meals) || meals.length !== 6) return null;

    const totalMacros = meals.reduce(
      (total, meal) => ({
        protein: total.protein + meal.macros.protein,
        carbs: total.carbs + meal.macros.carbs,
        fat: total.fat + meal.macros.fat
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );

    return {
      totalCalories,
      totalMacros,
      meals
    };
  } catch (error) {
    console.error('Error parsing plan:', error);
    return null;
  }
}
