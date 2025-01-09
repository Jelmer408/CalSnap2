import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Loader2, RefreshCw, History } from 'lucide-react';
import { useMealSuggestions } from '../../hooks/useMealSuggestions';
import { useCalorieStore } from '../../store/calorieStore';
import { MealSuggestion } from '../../types/suggestions';
import { cn } from '../../lib/utils';

export function MealSuggestions() {
  const { suggestions, isLoading, refresh } = useMealSuggestions();
  const { addEntry } = useCalorieStore();
  const [addingMeal, setAddingMeal] = useState<string | null>(null);

  const handleAddSuggestion = async (suggestion: MealSuggestion) => {
    try {
      setAddingMeal(suggestion.name);
      
      // Optimistically update UI first
      const timestamp = new Date().toISOString();
      await addEntry({
        name: suggestion.name,
        calories: suggestion.calories,
        mealType: suggestion.mealType as any,
        timestamp,
        emoji: suggestion.emoji
      });
    } catch (error) {
      console.error('Error adding suggestion:', error);
    } finally {
      setAddingMeal(null);
    }
  };

  if (suggestions.length === 0 && !isLoading) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-blue-100">
          Suggested Meals
        </h3>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={refresh}
          disabled={isLoading}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4 text-blue-200" />
        </motion.button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-blue-200" />
        </div>
      ) : (
        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 space-x-2">
          {suggestions.map((suggestion) => (
            <motion.button
              key={`${suggestion.name}-${suggestion.isHistorical ? 'hist' : 'ai'}`}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAddSuggestion(suggestion)}
              disabled={addingMeal === suggestion.name}
              className={cn(
                "flex items-center space-x-2 shrink-0 backdrop-blur-sm px-3 py-2 rounded-lg transition-colors relative",
                suggestion.isHistorical 
                  ? "bg-purple-500/20 hover:bg-purple-500/30" 
                  : "bg-white/10 hover:bg-white/20",
                addingMeal === suggestion.name && "opacity-50"
              )}
            >
              <span className="text-xl">{suggestion.emoji}</span>
              <div className="text-left">
                <div className="text-sm font-medium text-white truncate max-w-[150px]">
                  {suggestion.name}
                </div>
                <div className="text-xs text-blue-200 flex items-center space-x-1">
                  <span>{suggestion.calories} cal</span>
                  {suggestion.isHistorical && (
                    <>
                      <span>•</span>
                      <History className="w-3 h-3" />
                    </>
                  )}
                </div>
              </div>
              {addingMeal === suggestion.name ? (
                <Loader2 className="w-4 h-4 text-blue-200 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 text-blue-200" />
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
