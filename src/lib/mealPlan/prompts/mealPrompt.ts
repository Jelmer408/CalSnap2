export function createMealPrompt(
  mealType: string,
  calories: number,
  preferences: {
    dietType: string,
    allergies: string[],
    cuisinePreferences: string[],
    excludedFoods: string[]
  }
) {
  return `Generate a ${preferences.dietType} ${mealType} with ${calories} calories (±10%).

Requirements:
${preferences.allergies.length ? `- Avoid allergens: ${preferences.allergies.join(', ')}` : ''}
${preferences.excludedFoods.length ? `- Exclude: ${preferences.excludedFoods.join(', ')}` : ''}
${preferences.cuisinePreferences.length ? `- Preferred cuisines: ${preferences.cuisinePreferences.join(', ')}` : ''}

Return ONLY a JSON object:
{
  "name": "meal name",
  "calories": number,
  "macros": {
    "protein": number (grams),
    "carbs": number (grams),
    "fat": number (grams)
  },
  "ingredients": [
    {
      "name": "ingredient",
      "amount": number,
      "unit": "g|ml|tbsp|tsp|cup"
    }
  ],
  "prepTime": number (minutes)
}`;
}
