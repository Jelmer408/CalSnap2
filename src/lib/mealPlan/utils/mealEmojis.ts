import { MealType } from '../../../types/mealPlan';

// Mapping of meal types to default emojis
export const DEFAULT_MEAL_EMOJIS: Record<MealType, string> = {
  breakfast: '🍳',
  'morning-snack': '🥪',
  lunch: '🍱',
  'afternoon-snack': '🍎',
  dinner: '🍽️',
  'evening-snack': '🥛'
};

// Common food keywords to emoji mappings
export const FOOD_EMOJI_MAP: Record<string, string> = {
  'oatmeal': '🥣',
  'eggs': '🍳',
  'toast': '🍞',
  'pancakes': '🥞',
  'yogurt': '🥛',
  'chicken': '🍗',
  'salad': '🥗',
  'sandwich': '🥪',
  'rice': '🍚',
  'pasta': '🍝',
  'fish': '🐟',
  'fruit': '🍎',
  'nuts': '🥜',
  'protein': '💪',
  'shake': '🥤'
};

export function getMealEmoji(mealName: string): string {
  const lowerName = mealName.toLowerCase();
  
  // Check for exact matches in food map
  for (const [keyword, emoji] of Object.entries(FOOD_EMOJI_MAP)) {
    if (lowerName.includes(keyword)) {
      return emoji;
    }
  }
  
  // Fallback to default meal type emoji
  return '🍽️';
}
