import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { useCalorieStore } from '../store/calorieStore';
import { useAchievementStore } from '../store/achievementStore';
import { useDateStore } from '../store/dateStore';
import { MealType, MEAL_TYPES } from '../types/meals';
import { CameraButton } from './camera/CameraButton';
import { useAIAnalysis } from '../hooks/useAIAnalysis';
import { cn } from '../lib/utils';

export function CalorieInput() {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const { addEntry, recentItems } = useCalorieStore();
  const { updateStreak, checkAchievements } = useAchievementStore();
  const { selectedDate } = useDateStore();
  const { analyzeFood, isAnalyzing, error, clearError } = useAIAnalysis();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && calories) {
      await addEntry({
        name,
        calories: parseInt(calories, 10),
        mealType,
        timestamp: selectedDate.toISOString()
      });
      updateStreak();
      checkAchievements();
      setName('');
      setCalories('');
    }
  };

  const handleCapture = async (imageData: string) => {
    clearError();
    const analysis = await analyzeFood(imageData);
    if (analysis) {
      setName(analysis.name);
      setCalories(analysis.calories.toString());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(Object.entries(MEAL_TYPES) as [MealType, typeof MEAL_TYPES[MealType]][]).map(([type, info]) => (
          <button
            key={type}
            type="button"
            onClick={() => setMealType(type)}
            className={cn(
              "p-2 rounded-xl flex flex-col items-center justify-center space-y-1 transition-all",
              mealType === type
                ? `bg-gradient-to-br ${info.color} text-white shadow-lg scale-95`
                : "bg-white/10 hover:bg-white/20"
            )}
          >
            <span className="text-lg">{info.icon}</span>
            <span className="text-xs font-medium">{info.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-200" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={isAnalyzing ? "Analyzing food..." : "What did you eat?"}
            disabled={isAnalyzing}
            className={cn(
              "w-full pl-10 pr-12 py-3",
              "bg-white/10 placeholder-blue-200 text-white rounded-xl",
              "focus:ring-2 focus:ring-white/50 outline-none transition-all",
              "disabled:opacity-50"
            )}
            list="recent-items"
          />
          <CameraButton 
            disabled={isAnalyzing} 
            onCapture={handleCapture}
          />
          <datalist id="recent-items">
            {recentItems.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-200 bg-red-500/20 px-3 py-2 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="Cal"
            disabled={isAnalyzing}
            className={cn(
              "w-full px-3 py-3",
              "bg-white/10 placeholder-blue-200 text-white rounded-xl",
              "focus:ring-2 focus:ring-white/50 outline-none transition-all text-center",
              "disabled:opacity-50"
            )}
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isAnalyzing || !name || !calories}
            className={cn(
              "w-full px-4 py-3 bg-white text-blue-600 rounded-xl",
              "hover:bg-blue-50 transition-colors",
              "flex items-center justify-center space-x-2 font-medium shadow-lg",
              "disabled:opacity-50 disabled:hover:bg-white",
              "focus:outline-none focus:ring-2 focus:ring-white/50"
            )}
          >
            <Plus className="w-5 h-5" />
            <span>Add</span>
          </motion.button>
        </div>
      </div>
    </form>
  );
}
