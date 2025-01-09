import { MealType } from './meals';

export interface FixedMeal {
  id: string;
  name: string;
  calories: number;
  mealType: MealType;
  emoji?: string;
}

export interface MealPreferences {
  fixedMeals: FixedMeal[];
  includedFoods: string[];
  excludedFoods: string[];
}
