import { create } from 'zustand';
import { MealSuggestion } from '../types/suggestions';
import { MealType } from '../types/meals';

interface SuggestionState {
  suggestions: Record<MealType, MealSuggestion[]>;
  lastUpdated: Record<MealType, number>;
  setSuggestions: (mealType: MealType, suggestions: MealSuggestion[]) => void;
  clearSuggestions: () => void;
}

export const useSuggestionStore = create<SuggestionState>((set) => ({
  suggestions: {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  },
  lastUpdated: {
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snack: 0
  },
  setSuggestions: (mealType, suggestions) => 
    set(state => ({
      suggestions: {
        ...state.suggestions,
        [mealType]: suggestions
      },
      lastUpdated: {
        ...state.lastUpdated,
        [mealType]: Date.now()
      }
    })),
  clearSuggestions: () => 
    set({
      suggestions: {
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: []
      },
      lastUpdated: {
        breakfast: 0,
        lunch: 0,
        dinner: 0,
        snack: 0
      }
    })
}));
