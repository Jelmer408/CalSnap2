export interface MealSuggestionRequest {
  mealType: string;
  minCalories: number;
  maxCalories: number;
  count: number;
}

export interface BatchMealSuggestionRequest {
  suggestions: MealSuggestionRequest[];
}

export interface ParsedMealSuggestion {
  name: string;
  calories: number;
  mealType: string;
}
