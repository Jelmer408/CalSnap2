import { DailyMealPlan, MealItem } from '../../types/mealPlan';

export function parseMealPlanResponse(text: string, totalCalories: number): DailyMealPlan | null {
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return null;

    const meals = JSON.parse(jsonMatch[0]) as MealItem[];
    if (!Array.isArray(meals) || meals.length !== 3) return null;

    const totalMacros = meals.reduce(
      (total, meal) => ({
        protein: total.protein + meal.macros.protein,
        carbs: total.carbs + meal.macros.carbs,
        fat: total.fat + meal.macros.fat
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );

    return {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      totalCalories,
      totalMacros,
      meals
    };
  } catch (error) {
    console.error('Error parsing meal plan response:', error);
    return null;
  }
}
