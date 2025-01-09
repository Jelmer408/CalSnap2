import { model } from '../gemini/config';
import { MealSuggestion } from '../../types/suggestions';
import { getFoodEmoji } from '../gemini/foodEmoji';
import { MealType, MEAL_TYPES } from '../../types/meals';
import { WeightGoal } from '../../types/fitness';

export async function generateAISuggestions(
  mealTypes: MealType[],
  weightGoal: WeightGoal,
  dietaryRestrictions: string[] = [],
  countPerType: number = 4
): Promise<MealSuggestion[]> {
  try {
    const calorieRange = getCalorieRange(weightGoal);
    const prompt = createPrompt(mealTypes, weightGoal, calorieRange, dietaryRestrictions, countPerType);

    const result = await model.generateContent(prompt, {
      temperature: 0.7,
      maxOutputTokens: 1024,
    });

    if (!result.response?.text()) return [];

    const text = result.response.text().trim();
    const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (!jsonMatch) return [];

    const suggestions = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(suggestions)) return [];

    return await Promise.all(
      suggestions
        .filter(s => s?.name && s?.calories && s?.mealType && s?.macros)
        .map(async s => ({
          ...s,
          confidence: 0.5,
          emoji: await getFoodEmoji(s.name)
        }))
    );
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    return [];
  }
}

function getCalorieRange(weightGoal: WeightGoal): { min: number; max: number } {
  switch (weightGoal) {
    case 'lose':
      return { min: 300, max: 500 };
    case 'maintain':
      return { min: 500, max: 700 };
    case 'gain':
      return { min: 700, max: 1000 };
    default:
      return { min: 300, max: 700 };
  }
}

function createPrompt(
  mealTypes: MealType[],
  weightGoal: WeightGoal,
  calorieRange: { min: number; max: number },
  dietaryRestrictions: string[],
  countPerType: number
): string {
  return `Generate meal suggestions for the following:
${mealTypes.map(type => `
- ${countPerType} ${type} meals between ${calorieRange.min}-${calorieRange.max} calories`).join('\n')}

Weight Goal: ${weightGoal}
${dietaryRestrictions.length > 0 ? `Dietary Restrictions: ${dietaryRestrictions.join(', ')}` : ''}

Return ONLY a JSON array with this structure:
[{
  "name": "Main Dish with Side Dish",
  "calories": number,
  "mealType": "${mealTypes[0]}",
  "macros": {
    "protein": number (grams),
    "carbs": number (grams),
    "fat": number (grams)
  }
}]

Rules:
- Each meal must be unique
- Use realistic portion sizes
- Include specific meal names with main and side dishes
- Keep calories within specified ranges
- Adhere to the weight goal: ${weightGoal === 'lose' ? 'low-calorie' : weightGoal === 'gain' ? 'high-calorie' : 'balanced'} meals
- Consider dietary restrictions if provided
- Return ONLY the JSON array`;
}
