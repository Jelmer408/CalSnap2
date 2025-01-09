import { DailyMealPlan } from '../../../types/mealPlan';

const CALORIE_VARIANCE_PERCENTAGE = 0.1; // 10% variance allowed
const MACRO_RANGES = {
  protein: { min: 0.2, max: 0.35 }, // 20-35%
  carbs: { min: 0.45, max: 0.65 },  // 45-65%
  fat: { min: 0.2, max: 0.35 }      // 20-35%
};

function validateMacroRatios(macros: { protein: number; carbs: number; fat: number }): boolean {
  const total = macros.protein + macros.carbs + macros.fat;
  if (total === 0) return false;

  const ratios = {
    protein: macros.protein / total,
    carbs: macros.carbs / total,
    fat: macros.fat / total
  };

  return (
    ratios.protein >= MACRO_RANGES.protein.min &&
    ratios.protein <= MACRO_RANGES.protein.max &&
    ratios.carbs >= MACRO_RANGES.carbs.min &&
    ratios.carbs <= MACRO_RANGES.carbs.max &&
    ratios.fat >= MACRO_RANGES.fat.min &&
    ratios.fat <= MACRO_RANGES.fat.max
  );
}

export function validatePlan(plan: DailyMealPlan): boolean {
  try {
    // Validate basic structure
    if (!plan.meals || !Array.isArray(plan.meals) || plan.meals.length !== 6) { // Updated to expect 6 meals
      console.error('Invalid meal plan structure - expected 6 meals');
      return false;
    }

    // Validate total calories
    const totalCalories = plan.meals.reduce((sum, meal) => sum + meal.calories, 0);
    const calorieVariance = Math.abs(totalCalories - plan.totalCalories);
    const maxVariance = plan.totalCalories * CALORIE_VARIANCE_PERCENTAGE;

    if (calorieVariance > maxVariance) {
      console.error('Total calories validation failed', {
        expected: plan.totalCalories,
        actual: totalCalories,
        variance: calorieVariance,
        maxAllowed: maxVariance
      });
      return false;
    }

    // Validate each meal
    for (const meal of plan.meals) {
      // Check required fields
      if (!meal.name || !meal.timing || !meal.type || !meal.calories || !meal.macros || !meal.ingredients) {
        console.error('Missing required meal fields:', {
          name: !meal.name,
          timing: !meal.timing,
          type: !meal.type,
          calories: !meal.calories,
          macros: !meal.macros,
          ingredients: !meal.ingredients
        });
        return false;
      }

      // Validate macro ratios for main meals only (not snacks)
      if (!meal.type.includes('snack') && !validateMacroRatios(meal.macros)) {
        console.error('Invalid macro ratios for meal:', meal.name);
        return false;
      }

      // Validate prep time
      if (typeof meal.prepTime !== 'number' || meal.prepTime <= 0 || meal.prepTime > 120) {
        console.error('Invalid prep time for meal:', meal.name);
        return false;
      }

      // Validate ingredients
      if (!Array.isArray(meal.ingredients) || meal.ingredients.length === 0) {
        console.error('Invalid ingredients for meal:', meal.name);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error validating plan:', error);
    return false;
  }
}
