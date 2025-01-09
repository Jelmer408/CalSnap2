import { MealType } from '../../../types/meals';

interface ValidationConfig {
  maxCalories: number;
  mealType: MealType;
}

export function validateSuggestionResponse(suggestions: any[], config: ValidationConfig) {
  if (!Array.isArray(suggestions)) {
    console.error('Suggestions must be an array');
    return null;
  }

  const validSuggestions = suggestions.filter(suggestion => {
    // Basic structure check
    if (!suggestion?.name || !suggestion?.calories || !suggestion?.mealType) {
      console.error('Invalid suggestion structure:', suggestion);
      return false;
    }

    // Name validation
    if (typeof suggestion.name !== 'string' || suggestion.name.length < 3) {
      console.error('Invalid suggestion name:', suggestion.name);
      return false;
    }

    // Calories validation
    if (typeof suggestion.calories !== 'number' || 
        suggestion.calories < 100 || 
        suggestion.calories > config.maxCalories) {
      console.error('Invalid calories value:', suggestion.calories);
      return false;
    }

    // Meal type validation
    if (suggestion.mealType !== config.mealType) {
      console.error('Invalid meal type:', suggestion.mealType);
      return false;
    }

    return true;
  });

  return validSuggestions.length > 0 ? validSuggestions : null;
}
