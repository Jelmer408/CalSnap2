import { model } from '../../gemini/config';
import { MealItem } from '../../../types/mealPlan';
import { createMealPrompt } from '../prompts/mealPrompt';
import { parseMealResponse } from '../parsers/mealParser';

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

export async function generateMeal(
  type: string,
  calories: number,
  preferences: any,
  retryCount = 0
): Promise<MealItem | null> {
  try {
    const prompt = createMealPrompt(type, calories, preferences);
    
    const result = await model.generateContent(prompt, {
      temperature: 0.7,
      topK: 40,
      maxOutputTokens: 1024,
    });

    if (!result.response?.text()) {
      throw new Error('Empty AI response');
    }

    const meal = parseMealResponse(result.response.text());
    if (!meal) {
      throw new Error('Invalid meal data');
    }

    return meal;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return generateMeal(type, calories, preferences, retryCount + 1);
    }
    return null;
  }
}
