import { model } from './config';
import { MealItem, PlannedMeal } from '../../types/mealPlan';
import { getFoodEmoji } from './foodEmoji';
import { getMealTimeContext } from '../mealTimeUtils';
import { validateMealItems } from './validators';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export async function regenerateMeal(meal: PlannedMeal, retryCount = 0): Promise<MealItem[]> {
  try {
    const mealContext = getMealTimeContext(meal.type);
    
    const prompt = `Generate a single meal for ${mealContext.timeOfDay} with these exact requirements:
Total calories: ${meal.totalCalories} (±50 calories)
Meal type: ${mealContext.mealType}
Guidelines:
${mealContext.guidelines.map(g => `- ${g}`).join('\n')}

Return ONLY a JSON array with exactly one meal item:
[{
  "name": "Specific meal name",
  "calories": number (must be within ±50 of ${meal.totalCalories}),
  "protein": number (grams),
  "carbs": number (grams),
  "fat": number (grams),
  "prepTime": number (minutes),
  "ingredients": ["ingredient 1", "ingredient 2", ...],
  "instructions": ["step 1", "step 2", ...]
}]`;

    const result = await model.generateContent(prompt, {
      temperature: 0.7,
      topP: 0.8,
      maxOutputTokens: 1024
    });

    if (!result.response?.text()) {
      throw new Error('No response from AI');
    }

    const text = result.response.text().trim();
    const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    let items: MealItem[];
    try {
      items = JSON.parse(jsonMatch[0]);
    } catch (e) {
      throw new Error('Failed to parse response');
    }

    const validatedItems = await validateMealItems(items, {
      targetCalories: meal.totalCalories,
      mealContext,
      currentMealNames: meal.items.map(i => i.name.toLowerCase())
    });

    return validatedItems;

  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
      return regenerateMeal(meal, retryCount + 1);
    }

    // Return the original meal items as fallback
    return meal.items;
  }
}
