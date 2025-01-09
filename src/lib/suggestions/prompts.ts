import { BatchMealSuggestionRequest } from './types';

export function createBatchSuggestionPrompt(request: BatchMealSuggestionRequest): string {
  const suggestionsPrompt = request.suggestions
    .map(({ mealType, minCalories, maxCalories, count }) => (
      `${count} ${mealType} options between ${minCalories}-${maxCalories} calories`
    ))
    .join('\n');

  return `Generate meal suggestions with these requirements:

${suggestionsPrompt}

Return ONLY a JSON array with this structure:
[{
  "name": "Meal Name",
  "calories": number,
  "mealType": "breakfast|lunch|dinner|snack"
}]

Rules:
- Each meal must be unique
- Use realistic portion sizes
- Include specific meal names (not generic)
- Keep calories within specified ranges
- Return ONLY the JSON array`;
}
