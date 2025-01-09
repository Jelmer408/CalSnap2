import { MealSuggestion } from '../../types/suggestions';
import { CalorieEntry } from '../../store/calorieStore';
import { generateAISuggestions } from './aiSuggestionGenerator';
import { MealType } from '../../types/meals';
import { subDays, isToday, startOfDay, endOfDay } from 'date-fns';

const MIN_AI_SUGGESTIONS = 3;
const MAX_HISTORICAL_SUGGESTIONS = 3;
const TOTAL_SUGGESTIONS = 6;

function getRecentMeals(entries: CalorieEntry[], days: number): CalorieEntry[] {
  const today = new Date();
  const startDate = subDays(today, days);
  
  return entries.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    return entryDate >= startOfDay(startDate) && 
           entryDate <= endOfDay(today) &&
           !isToday(entryDate); // Exclude today's meals
  });
}

function getHistoricalSuggestions(
  entries: CalorieEntry[],
  mealType: MealType
): MealSuggestion[] {
  // Get meals from last 3 days
  const recentMeals = getRecentMeals(entries, 3);
  
  // Filter by meal type and create unique suggestions
  const historicalSuggestions = recentMeals
    .filter(entry => entry.mealType === mealType)
    .reduce((unique: MealSuggestion[], entry) => {
      // Check if meal already exists in suggestions
      if (!unique.some(suggestion => suggestion.name.toLowerCase() === entry.name.toLowerCase())) {
        unique.push({
          name: entry.name,
          calories: entry.calories,
          mealType: entry.mealType,
          confidence: 0.9, // High confidence for previously eaten meals
          emoji: entry.emoji || '🍽️',
          lastEaten: entry.timestamp,
          isHistorical: true // Mark as historical suggestion
        });
      }
      return unique;
    }, [])
    .slice(0, MAX_HISTORICAL_SUGGESTIONS);

  return historicalSuggestions;
}

export async function getSuggestions(
  entries: CalorieEntry[],
  mealType: MealType
): Promise<MealSuggestion[]> {
  // Get historical suggestions from recent entries
  const historicalSuggestions = getHistoricalSuggestions(entries, mealType);
  
  // Calculate how many AI suggestions we need
  const neededAiSuggestions = Math.max(
    MIN_AI_SUGGESTIONS,
    TOTAL_SUGGESTIONS - historicalSuggestions.length
  );
  
  // Get AI suggestions
  const aiSuggestions = await generateAISuggestions([mealType], neededAiSuggestions);
  
  // Combine suggestions, ensuring no duplicates
  const allSuggestions = [...historicalSuggestions];
  
  // Add AI suggestions that don't duplicate historical ones
  for (const aiSuggestion of aiSuggestions) {
    if (!allSuggestions.some(s => 
      s.name.toLowerCase() === aiSuggestion.name.toLowerCase()
    )) {
      allSuggestions.push(aiSuggestion);
    }
    
    if (allSuggestions.length >= TOTAL_SUGGESTIONS) break;
  }
  
  return allSuggestions;
}
