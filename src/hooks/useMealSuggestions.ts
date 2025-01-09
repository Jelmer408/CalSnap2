import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { getCurrentMealType } from '../lib/suggestions/getCurrentMealType';
import { generateAISuggestions } from '../lib/suggestions/aiSuggestionGenerator';
import { MealSuggestion } from '../types/suggestions';
import { useCalorieStore } from '../store/calorieStore';
import { useSuggestionStore } from '../store/suggestionStore';
import { MealType } from '../types/meals';
import { WeightGoal } from '../types/fitness';
import { subDays, isToday } from 'date-fns';

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const MAX_HISTORICAL_SUGGESTIONS = 3;
const MAX_AI_SUGGESTIONS = 3;

export function useMealSuggestions() {
  const [isLoading, setIsLoading] = useState(false);
  const [weightGoal, setWeightGoal] = useState<WeightGoal>('maintain');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const { entries } = useCalorieStore();
  const { suggestions, lastUpdated, setSuggestions } = useSuggestionStore();
  
  useEffect(() => {
    fetchUserPreferences();
  }, []);

  const fetchUserPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userSettings, error } = await supabase
        .from('user_settings')
        .select('goal_type, dietary_restrictions')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (userSettings) {
        setWeightGoal(userSettings.goal_type as WeightGoal);
        setDietaryRestrictions(userSettings.dietary_restrictions || []);
      }
    } catch (error) {
      console.error('Error fetching user preferences:', error);
    }
  };

  const loadSuggestions = async () => {
    const currentMealType = getCurrentMealType(entries);
    const lastUpdate = lastUpdated[currentMealType];
    
    if (
      suggestions[currentMealType].length > 0 && 
      Date.now() - lastUpdate < CACHE_DURATION
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const historicalSuggestions = await getHistoricalSuggestions(currentMealType);
      
      const aiSuggestions = await generateAISuggestions(
        [currentMealType],
        weightGoal,
        dietaryRestrictions,
        MAX_AI_SUGGESTIONS
      );

      const combinedSuggestions = [...historicalSuggestions, ...aiSuggestions];
      setSuggestions(currentMealType, combinedSuggestions);

    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHistoricalSuggestions = async (currentMealType: MealType): Promise<MealSuggestion[]> => {
    const threeDaysAgo = subDays(new Date(), 3).toISOString();
    const { data: historicalEntries } = await supabase
      .from('calorie_entries')
      .select('*')
      .eq('mealType', currentMealType)
      .gte('timestamp', threeDaysAgo)
      .order('timestamp', { ascending: false });

    return (historicalEntries || [])
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
            confidence: 0.9,
            emoji: entry.emoji || '🍽️',
            lastEaten: entry.timestamp,
            isHistorical: true
          });
        }
        return unique;
      }, []);
  };

  useEffect(() => {
    loadSuggestions();
  }, [entries, weightGoal, dietaryRestrictions]);

  return { 
    suggestions: suggestions[getCurrentMealType(entries)], 
    isLoading,
    refresh: loadSuggestions
  };
}
