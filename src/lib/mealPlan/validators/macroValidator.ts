import { MacroNutrients } from '../../../types/mealPlan';

// Constants for macro validation
const CALORIE_PER_GRAM = {
  protein: 4,
  carbs: 4,
  fat: 9
};

const MACRO_RATIOS = {
  protein: { min: 0.1, max: 0.4 },   // 10-40%
  carbs: { min: 0.25, max: 0.65 },   // 25-65%
  fat: { min: 0.2, max: 0.45 }       // 20-45%
};

export function calculateCaloriesFromMacros(macros: MacroNutrients): number {
  return (
    (macros.protein * CALORIE_PER_GRAM.protein) +
    (macros.carbs * CALORIE_PER_GRAM.carbs) +
    (macros.fat * CALORIE_PER_GRAM.fat)
  );
}

export function validateMacroCalories(
  macros: MacroNutrients, 
  targetCalories: number
): boolean {
  const calculatedCalories = calculateCaloriesFromMacros(macros);
  const variance = Math.abs(calculatedCalories - targetCalories);
  // Allow 20% variance for macro calculations
  const maxVariance = targetCalories * 0.2;
  
  return variance <= maxVariance;
}

export function validateMacroRatios(macros: MacroNutrients): boolean {
  const totalGrams = macros.protein + macros.carbs + macros.fat;
  if (totalGrams === 0) return false;

  const ratios = {
    protein: macros.protein / totalGrams,
    carbs: macros.carbs / totalGrams,
    fat: macros.fat / totalGrams
  };

  return (
    ratios.protein >= MACRO_RATIOS.protein.min &&
    ratios.protein <= MACRO_RATIOS.protein.max &&
    ratios.carbs >= MACRO_RATIOS.carbs.min &&
    ratios.carbs <= MACRO_RATIOS.carbs.max &&
    ratios.fat >= MACRO_RATIOS.fat.min &&
    ratios.fat <= MACRO_RATIOS.fat.max
  );
}
