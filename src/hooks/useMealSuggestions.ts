import { useState, useEffect } from 'react';
import { useCalorieStore } from '../store/calorieStore';
import { getCurrentMealType } from '../lib/suggestions/getCurrentMealType';
import { generateAISuggestions } from '../lib/suggestions/aiSuggestionGenerator';
import { MealSuggestion } from '../types/suggestions';

export function useMealSuggestions() {
  const [suggestions, setSuggestions] = useState<MealSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { entries } = useCalorieStore();
  
  const loadSuggestions = async () => {
    setIsLoading(true);
    try {
      const currentMealType = getCurrentMealType(entries);
      const mealSuggestions = await generateAISuggestions([currentMealType]);
      setSuggestions(mealSuggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSuggestions();
  }, [entries]);

  return { 
    suggestions, 
    isLoading,
    refresh: loadSuggestions
  };
}
