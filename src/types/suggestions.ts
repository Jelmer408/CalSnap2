export interface MealPattern {
  timeOfDay: string;
  frequency: number;
  lastEaten: string;
  calories: number;
  recentOccurrences?: Array<{
    date: string;
    calories: number;
  }>;
}

export interface MealSuggestion {
  name: string;
  calories: number;
  mealType: string;
  confidence: number;
  emoji?: string;
  lastEaten?: string;
}

export interface SuggestionPreferences {
  maxCalories: number;
  minProtein: number;
  timeOfDay: string;
  recentlyEaten: boolean;
}
