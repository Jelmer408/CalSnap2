import { DailyMealPlan, MealItem, MacroNutrients } from '../../types/mealPlan';

// Calculate calories from macronutrients
function calculateCaloriesFromMacros(macros: MacroNutrients): number {
  return (
    (macros.protein * 4) + 
    (macros.carbs * 4) + 
    (macros.fat * 9)
  );
}

// Validate macronutrients with reasonable tolerance
function validateMacros(macros: MacroNutrients, targetCalories: number): boolean {
  const calculatedCalories = calculateCaloriesFromMacros(macros);
  const variance = Math.abs(calculatedCalories - targetCalories);
  // Allow 15% variance for macro calculations
  const maxVariance = targetCalories * 0.15;
  
  if (variance > maxVariance) {
    console.debug('Macro validation failed:', {
      calculated: calculatedCalories,
      target: targetCalories,
      variance,
      maxAllowed: maxVariance
    });
    return false;
  }
  
  // Validate macro ratios
  const totalGrams = macros.protein + macros.carbs + macros.fat;
  const proteinRatio = macros.protein / totalGrams;
  const carbsRatio = macros.carbs / totalGrams;
  const fatRatio = macros.fat / totalGrams;
  
  // Acceptable macro ranges
  return (
    proteinRatio >= 0.1 && proteinRatio <= 0.4 && // 10-40% protein
    carbsRatio >= 0.3 && carbsRatio <= 0.65 &&    // 30-65% carbs
    fatRatio >= 0.2 && fatRatio <= 0.4           // 20-40% fat
  );
}

// Validate individual meal
function validateMeal(meal: MealItem): boolean {
  if (!meal.name || !meal.timing || !meal.calories || !meal.macros || !meal.ingredients) {
    console.error('Missing required meal fields');
    return false;
  }

  if (meal.calories <= 0 || meal.prepTime <= 0) {
    console.error('Invalid meal numbers');
    return false;
  }

  if (!validateMacros(meal.macros, meal.calories)) {
    console.error('Meal macros do not match calories');
    return false;
  }

  return true;
}

// Validate complete meal plan
export function validateMealPlan(plan: DailyMealPlan): boolean {
  if (!plan || !Array.isArray(plan.meals) || plan.meals.length !== 3) {
    console.error('Invalid meal plan structure');
    return false;
  }

  // Validate total calories (allow ±10% variance)
  const totalCalories = plan.meals.reduce((sum, meal) => sum + meal.calories, 0);
  const calorieVariance = Math.abs(totalCalories - plan.totalCalories);
  const maxVariance = plan.totalCalories * 0.1;

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
  return plan.meals.every(validateMeal);
}
