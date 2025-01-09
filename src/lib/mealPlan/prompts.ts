import { DietaryPreferences } from '../../types/mealPlan';

export function generateMealPlanPrompt(
  mealCalories: ReturnType<typeof import('./calorieDistributor').distributeMealCalories>,
  preferences: DietaryPreferences
): string {
  const dietaryRestrictions = [
    preferences.dietType !== 'non-vegetarian' && `Must be ${preferences.dietType}`,
    preferences.allergies.length > 0 && `Avoid allergens: ${preferences.allergies.join(', ')}`,
    preferences.excludedFoods.length > 0 && `Exclude: ${preferences.excludedFoods.join(', ')}`
  ].filter(Boolean).join('. ');

  const cuisinePreference = preferences.cuisinePreferences.length > 0
    ? `Preferred cuisines: ${preferences.cuisinePreferences.join(', ')}.`
    : '';

  return `Generate a daily meal plan with exactly 3 meals. Return ONLY a JSON array with this exact structure:
[
  {
    "name": "Breakfast meal name",
    "timing": "7:00 AM",
    "calories": ${mealCalories.breakfast},
    "macros": {
      "protein": number,
      "carbs": number,
      "fat": number
    },
    "ingredients": [
      {
        "name": "ingredient",
        "amount": number,
        "unit": "g|ml|tbsp|tsp|cup"
      }
    ],
    "prepTime": number
  },
  {
    "name": "Lunch meal name",
    "timing": "12:00 PM",
    "calories": ${mealCalories.lunch},
    "macros": {...},
    "ingredients": [...],
    "prepTime": number
  },
  {
    "name": "Dinner meal name",
    "timing": "6:00 PM", 
    "calories": ${mealCalories.dinner},
    "macros": {...},
    "ingredients": [...],
    "prepTime": number
  }
]

Requirements:
${dietaryRestrictions}
${cuisinePreference}

Rules:
- Use only common household ingredients and measurements
- Keep prep times between 10-45 minutes
- Use realistic portion sizes
- Include 3-6 ingredients per meal
- Keep macros within healthy ranges (10-40% protein, 25-65% carbs, 20-45% fat)

Return ONLY the JSON array, no additional text.`;
}
