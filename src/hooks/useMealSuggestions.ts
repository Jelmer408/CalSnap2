import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { getCurrentMealType } from '../lib/suggestions/getCurrentMealType';
import { generateAISuggestions } from '../lib/suggestions/aiSuggestionGenerator';
import { MealSuggestion } from '../types/suggestions';
import { useCalorieStore } from '../store/calorieStore';
import { useSuggestionStore } from '../store/suggestionStore';
import { MealType } from '../types/meals';
import { subDays, isToday } from 'date-fns';

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const MAX_HISTORICAL_SUGGESTIONS = 3;
const MAX_AI_SUGGESTIONS = 3;

export function useMealSuggestions() {
  const [isLoading, setIsLoading] = useState(false);
  const { entries } = useCalorieStore();
  const { suggestions, lastUpdated, setSuggestions } = useSuggestionStore();
  
  const loadSuggestions = async () => {
    const currentMealType = getCurrentMealType(entries);
    const lastUpdate = lastUpdated[currentMealType];
    
    // Check if we have cached suggestions that aren't expired
    if (
      suggestions[currentMealType].length > 0 && 
      Date.now() - lastUpdate < CACHE_DURATION
    ) {
      return;
    }

    setIsLoading(true);
    try {
      // Get historical suggestions from Supabase
      const threeDaysAgo = subDays(new Date(), 3).toISOString();
      const { data: historicalEntries } = await supabase
        .from('calorie_entries')
        .select('*')
        .eq('mealType', currentMealType)
        .gte('timestamp', threeDaysAgo)
        .order('timestamp', { ascending: false });

      // Filter out today's meals and create historical suggestions
      const historicalSuggestions: MealSuggestion[] = (historicalEntries || [])
        .filter(entry => !isToday(new Date(entry.timestamp)))
        .reduce((unique: MealSuggestion[], entry) => {
          if (
            !unique.some(suggestion => 
              suggestion.name.toLowerCase() === entry.name.toLowerCase()
            ) && 
            unique.length < MAX_HISTORICAL_SUGGESTIONS
          ) {
            unique.push({
              name: entry.name,
              calories: entry.calories,
              mealType: entry.mealType as MealType,
              confidence: 0.9, // High confidence for previously eaten meals
              emoji: entry.emoji || '🍽️',
              lastEaten: entry.timestamp,
              isHistorical: true
            });
          }
          return unique;
        }, []);

      // Generate AI suggestions
      const aiSuggestions = await generateAISuggestions(
        [currentMealType],
        MAX_AI_SUGGESTIONS
      );

      // Combine and store suggestions
      const combinedSuggestions = [...historicalSuggestions, ...aiSuggestions];
      setSuggestions(currentMealType, combinedSuggestions);

    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load suggestions when entries change (new meal logged)
  useEffect(() => {
    loadSuggestions();
  }, [entries]);

  return { 
    suggestions: suggestions[getCurrentMealType(entries)], 
    isLoading,
    refresh: loadSuggestions
  };
}
