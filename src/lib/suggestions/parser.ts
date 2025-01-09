import { ParsedMealSuggestion } from './types';

export function parseSuggestionsResponse(text: string): ParsedMealSuggestion[] {
  try {
    const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (!jsonMatch) return [];

    const suggestions = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(suggestions)) return [];

    return suggestions.filter(suggestion => 
      suggestion?.name && 
      typeof suggestion.calories === 'number' &&
      suggestion.mealType
    );
  } catch (error) {
    console.error('Failed to parse suggestions:', error);
    return [];
  }
}
