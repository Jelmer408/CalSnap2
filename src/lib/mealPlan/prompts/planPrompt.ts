import { MEAL_DISTRIBUTION, calculateMealCalories } from '../utils/calorieDistribution';

export function createPlanPrompt(
  totalCalories: number,
  preferences: {
    dietType: string,
    foodPreferences: string[],
    allergies: string[],
    cuisinePreferences: string[],
    excludedFoods: string[]
  }
) {
  const mealCalories = calculateMealCalories(totalCalories);
  const mealTimes = {
    breakfast: '7:00 AM',
    'morning-snack': '10:00 AM',
    lunch: '12:30 PM',
    'afternoon-snack': '3:30 PM',
    dinner: '6:30 PM',
    'evening-snack': '8:30 PM'
  };

  return `Generate a daily meal plan with exactly ${totalCalories} total calories distributed as follows:

Meal Distribution:
${Object.entries(mealCalories).map(([meal, calories]) => 
  `- ${meal}: ${calories} calories (${MEAL_DISTRIBUTION[meal as keyof typeof MEAL_DISTRIBUTION] * 100}%) at ${mealTimes[meal as keyof typeof mealTimes]}`
).join('\n')}

Requirements:
- Diet type: ${preferences.dietType}
${preferences.foodPreferences.length ? `- Include these foods: ${preferences.foodPreferences.join(', ')}` : ''}
${preferences.allergies.length ? `- Avoid allergens: ${preferences.allergies.join(', ')}` : ''}
${preferences.excludedFoods.length ? `- Exclude: ${preferences.excludedFoods.join(', ')}` : ''}
${preferences.cuisinePreferences.length ? `- Preferred cuisines: ${preferences.cuisinePreferences.join(', ')}` : ''}

Return ONLY a JSON array with exactly 6 meals:
[
  {
    "name": "meal name",
    "timing": "HH:MM AM/PM",
    "type": "breakfast|morning-snack|lunch|afternoon-snack|dinner|evening-snack",
    "calories": number (must match distribution),
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
  }
]

Rules:
- Each meal's calories MUST match the specified distribution
- Each meal must include 3-6 ingredients
- Keep prep times realistic (5-30 minutes)
- Use common ingredients
- Include protein in main meals
- Keep macros balanced (20-35% protein, 45-65% carbs, 20-35% fat)
${preferences.foodPreferences.length ? `- Try to incorporate the preferred foods across different meals` : ''}`;
}
