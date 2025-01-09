import { model } from '../gemini/config';
import { DailyMealPlan } from '../../types/mealPlan';

export async function generateMealPlan(
  totalCalories: number,
  preferences: {
    dietType: string,
    allergies: string[],
    cuisinePreferences: string[],
    excludedFoods: string[]
  }
): Promise<DailyMealPlan> {
  const prompt = `Generate a daily meal plan with EXACTLY ${totalCalories} total calories.

Requirements:
- Diet type: ${preferences.dietType}
${preferences.allergies.length ? `- Avoid allergens: ${preferences.allergies.join(', ')}` : ''}
${preferences.excludedFoods.length ? `- Exclude: ${preferences.excludedFoods.join(', ')}` : ''}
${preferences.cuisinePreferences.length ? `- Preferred cuisines: ${preferences.cuisinePreferences.join(', ')}` : ''}

Return ONLY a JSON array with exactly 6 meals that add up to ${totalCalories} calories:
[
  {
    "name": "meal name",
    "timing": "HH:MM AM/PM",
    "type": "breakfast|morning-snack|lunch|afternoon-snack|dinner|evening-snack",
    "calories": number,
    "macros": { "protein": number, "carbs": number, "fat": number },
    "ingredients": [{ "name": "ingredient", "amount": number, "unit": "g|ml|tbsp|tsp|cup" }],
    "prepTime": number
  }
]

IMPORTANT: The total calories of all meals MUST equal ${totalCalories}. Do not deviate from this number.`;

  try {
    const result = await model.generateContent(prompt, {
      temperature: 0.7,
      maxOutputTokens: 2048,
    });

    if (!result.response?.text()) {
      throw new Error('Empty response from AI');
    }

    const text = result.response.text();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Invalid response format');

    const meals = JSON.parse(jsonMatch[0]);
    const totalMacros = meals.reduce(
      (total: any, meal: any) => ({
        protein: total.protein + meal.macros.protein,
        carbs: total.carbs + meal.macros.carbs,
        fat: total.fat + meal.macros.fat
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );

    return {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      totalCalories,
      totalMacros,
      meals
    };
  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw new Error('Failed to generate meal plan');
  }
}
