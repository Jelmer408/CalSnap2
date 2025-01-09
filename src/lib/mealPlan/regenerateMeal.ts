import { model } from '../gemini/config';
import { MealItem } from '../../types/mealPlan';
import { getMealEmoji } from './utils/mealEmojis';

export async function regenerateMeal(
  currentMeal: MealItem,
  preferences: string[] = []
): Promise<MealItem> {
  const prompt = `Generate a new meal to replace this one. CRITICAL: Follow these requirements EXACTLY:

Required Specifications:
- Type: ${currentMeal.type}
- Timing: ${currentMeal.timing}
- Calories: ${currentMeal.calories} (±20 calories)
${preferences.length ? `- MUST include ALL of these ingredients: ${preferences.join(', ')}` : ''}

Return ONLY a JSON object with this exact structure:
{
  "name": "meal name",
  "calories": number,
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
1. MUST include ALL specified ingredients in the ingredients list
2. Must be a different meal than "${currentMeal.name}"
3. Use realistic portions and common ingredients
4. Include 1-6 ingredients total
5. Keep prep time between 5-30 minutes
6. Maintain balanced macros (20-35% protein, 45-65% carbs, 20-35% fat)
7. Return ONLY the JSON object, no other text`;

  try {
    const result = await model.generateContent(prompt, {
      temperature: 0.7,
      topK: 40,
      maxOutputTokens: 1024,
    });

    if (!result.response?.text()) {
      throw new Error('Empty response from AI');
    }

    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    const newMeal = JSON.parse(jsonMatch[0]);

    // Validate that all preferred ingredients are included
    if (preferences.length > 0) {
      const ingredientNames = newMeal.ingredients.map((i: any) => 
        i.name.toLowerCase()
      );
      
      const missingIngredients = preferences.filter(pref => 
        !ingredientNames.some(name => name.includes(pref.toLowerCase()))
      );

      if (missingIngredients.length > 0) {
        throw new Error(`Generated meal missing required ingredients: ${missingIngredients.join(', ')}`);
      }
    }

    const emoji = await getMealEmoji(newMeal.name);

    return {
      ...currentMeal,
      ...newMeal,
      emoji,
      type: currentMeal.type,
      timing: currentMeal.timing
    };
  } catch (error) {
    console.error('Error regenerating meal:', error);
    throw new Error('Failed to regenerate meal. Please try again.');
  }
}
