import { MealType } from '../../types/meals';
import { MealSuggestion } from '../../types/suggestions';

const DEFAULT_SUGGESTIONS: Record<MealType, MealSuggestion[]> = {
  breakfast: [
    { name: "Oatmeal with Banana", calories: 250, mealType: "breakfast", confidence: 0.8, emoji: "🥣" },
    { name: "Greek Yogurt with Berries", calories: 180, mealType: "breakfast", confidence: 0.8, emoji: "🫐" }
  ],
  lunch: [
    { name: "Chicken Salad", calories: 350, mealType: "lunch", confidence: 0.8, emoji: "🥗" },
    { name: "Turkey Sandwich", calories: 400, mealType: "lunch", confidence: 0.8, emoji: "🥪" }
  ],
  dinner: [
    { name: "Grilled Salmon", calories: 450, mealType: "dinner", confidence: 0.8, emoji: "🐟" },
    { name: "Chicken Breast with Rice", calories: 420, mealType: "dinner", confidence: 0.7, emoji: "🍗" }
  ],
  snack: [
    { name: "Apple with Almonds", calories: 150, mealType: "snack", confidence: 0.8, emoji: "🍎" },
    { name: "Protein Bar", calories: 200, mealType: "snack", confidence: 0.8, emoji: "🍫" }
  ]
};

export function getDefaultSuggestions(mealType: MealType): MealSuggestion[] {
  return DEFAULT_SUGGESTIONS[mealType] || [];
}
