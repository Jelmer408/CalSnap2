import { motion } from 'framer-motion';
import { Plus, Loader2, RefreshCw } from 'lucide-react';
import { useMealSuggestions } from '../../hooks/useMealSuggestions';
import { useCalorieStore } from '../../store/calorieStore';
import { MealSuggestion } from '../../types/suggestions';

export function MealSuggestions() {
  const { suggestions, isLoading, refresh } = useMealSuggestions();
  const { addEntry } = useCalorieStore();

  const handleAddSuggestion = async (suggestion: MealSuggestion) => {
    await addEntry({
      name: suggestion.name,
      calories: suggestion.calories,
      mealType: suggestion.mealType as any,
      timestamp: new Date().toISOString()
    });
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
              key={suggestion.name}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAddSuggestion(suggestion)}
              className="flex items-center space-x-2 shrink-0 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <span className="text-xl">{suggestion.emoji}</span>
              <div className="text-left">
                <div className="text-sm font-medium text-white truncate max-w-[150px]">
                  {suggestion.name}
                </div>
                <div className="text-xs text-blue-200">
                  {suggestion.calories} cal
                </div>
              </div>
              <Plus className="w-4 h-4 text-blue-200" />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
