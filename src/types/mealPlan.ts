export type MealType = 'breakfast' | 'morning-snack' | 'lunch' | 'afternoon-snack' | 'dinner' | 'evening-snack';

export interface DietaryPreferences {
  dietType: 'bulk' | 'cut';
  cookingStyle: 'quick' | 'gourmet';
  foodPreferences: string[];
}

export interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface MealItem {
  name: string;
  timing: string;
  type: MealType;
  calories: number;
  macros: MacroNutrients;
  ingredients: Ingredient[];
  prepTime: number;
  emoji?: string;
}

export interface DailyMealPlan {
  id: string;
  date: string;
  totalCalories: number;
  totalMacros: MacroNutrients;
  meals: MealItem[];
}
