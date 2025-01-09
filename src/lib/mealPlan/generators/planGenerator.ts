import { model } from '../../gemini/config';
import { DailyMealPlan } from '../../../types/mealPlan';

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export async function generatePlan(
  totalCalories: number,
  preferences: {
    dietType: string;
    cookingStyle: string;
    foodPreferences: string[];
  }
): Promise<DailyMealPlan> {
  const prompt = `Return a JSON array with exactly 6 meals. Each meal must follow this EXACT structure:
{
  "name": "Meal Name",
  "timing": "HH:MM AM/PM",
  "type": "breakfast|morning-snack|lunch|afternoon-snack|dinner|evening-snack",
  "calories": number,
  "emoji": "single emoji that best represents this specific meal",
  "macros": {
    "protein": number,
    "carbs": number,
    "fat": number
  },
  "ingredients": [
    {
      "name": "ingredient name",
      "amount": number,
      "unit": "g|ml|tbsp|tsp|cup"
    }
  ],
  "prepTime": number
}

CRITICAL RULES:
1. Return ONLY the JSON array - no other text
2. All numbers must be integers (no decimals)
3. All strings must be in double quotes
4. No trailing commas
5. Each meal must match its type's calories exactly
6. Each meal must include 3-6 ingredients
7. Prep times: 5-15 min for snacks, 15-45 min for meals
8. Use realistic portion sizes and common ingredients
9. Include protein source in main meals
10. Macros must be balanced (20-35% protein, 45-65% carbs, 20-35% fat)
11. Each meal must have a SINGLE emoji that specifically represents that meal (e.g., "🥣" for oatmeal, "🥗" for salad)

Diet Type: ${preferences.dietType === 'bulk' ? 'High-protein bulk diet' : 'Balanced cut diet'}
Cooking Style: ${preferences.cookingStyle === 'quick' ? 'Quick meals (under 30 min)' : 'Gourmet meals'}
${preferences.foodPreferences.length ? `Preferred Foods: ${preferences.foodPreferences.join(', ')}` : ''}

Total Calories: ${totalCalories}`;

  try {
    const result = await model.generateContent(prompt, generationConfig);
    if (!result.response?.text()) {
      throw new Error('Empty response from AI');
    }

    const text = result.response.text();
    const jsonMatch = text.match(/\[\s*{[\s\S]*}\s*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const meals = JSON.parse(jsonMatch[0]);

    // Calculate total macros
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
