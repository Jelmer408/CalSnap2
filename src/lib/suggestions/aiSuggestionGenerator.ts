import { model } from '../gemini/config';
import { MealSuggestion } from '../../types/suggestions';
import { getFoodEmoji } from '../gemini/foodEmoji';
import { MealType, MEAL_TYPES } from '../../types/meals';

export async function generateAISuggestions(
  mealTypes: MealType[],
  countPerType: number = 4
): Promise<MealSuggestion[]> {
  try {
    // Create a single prompt for all meal types
    const prompt = `Generate meal suggestions for the following:
${mealTypes.map(type => `
- ${countPerType} ${type} meals between ${MEAL_TYPES[type].calorieRange.min}-${MEAL_TYPES[type].calorieRange.max} calories`).join('\n')}

Return ONLY a JSON array with this structure:
[{
  "name": "Meal Name",
  "calories": number,
  "mealType": "${mealTypes[0]}"
}]

Rules:
- Each meal must be unique
- Use realistic portion sizes
- Include specific meal names
- Keep calories within specified ranges`;

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

    // Add emojis in parallel
    return await Promise.all(
      suggestions
        .filter(s => s?.name && s?.calories && s?.mealType)
        .map(async s => ({
          ...s,
          confidence: 0.5,
          emoji: await getFoodEmoji(s.name)
        }))
    );
  } catch (error) {
    return [];
  }
}
