import { MealSuggestion } from '../../types/suggestions';
import { CalorieEntry } from '../../store/calorieStore';
import { analyzePreviousMeals } from './mealPatternAnalyzer';
import { generateAISuggestions } from './aiSuggestionGenerator';
import { MealType } from '../../types/meals';

const MIN_AI_SUGGESTIONS = 4;
const TOTAL_SUGGESTIONS = 8;

export async function getSuggestions(
  entries: CalorieEntry[],
  mealType: MealType
): Promise<MealSuggestion[]> {
  // Get pattern-based suggestions from history
  const historicalSuggestions = analyzePreviousMeals(entries, mealType);
  
  // Always generate AI suggestions
  const aiSuggestions = await generateAISuggestions(mealType, MIN_AI_SUGGESTIONS);
  
  // Combine and deduplicate suggestions
  const allSuggestions = [...historicalSuggestions, ...aiSuggestions];
  const uniqueSuggestions = Array.from(
    new Map(allSuggestions.map(s => [s.name.toLowerCase(), s])).values()
  );
  
  // Sort by confidence and limit total
  return uniqueSuggestions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, TOTAL_SUGGESTIONS);
}
