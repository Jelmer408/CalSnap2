import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { CalorieInput } from '../CalorieInput';
import { MealSection } from '../MealSection';
import { DateNavigator } from '../date/DateNavigator';
import { MealSuggestions } from '../suggestions/MealSuggestions';
import { useCalorieStore } from '../../store/calorieStore';
import { useDateStore } from '../../store/dateStore';
import { useSwipeNavigation } from '../../hooks/useSwipeNavigation';
import { useCalorieSync } from '../../hooks/useCalorieSync';
import { formatCalories } from '../../lib/utils';
import { MealType, MEAL_TYPES } from '../../types/meals';
import { isSameDay } from 'date-fns';

export function HomeTab() {
  const { entries, dailyGoal, removeEntry } = useCalorieStore();
  const { selectedDate, goToNextDay, goToPreviousDay } = useDateStore();
  useCalorieSync(); // Add this line to sync calories
  
  const { handleTouchStart, handleTouchEnd } = useSwipeNavigation({
    onSwipeLeft: goToNextDay,
    onSwipeRight: goToPreviousDay,
    threshold: 50
  });
  
  const dateEntries = entries.filter(
    (entry) => isSameDay(new Date(entry.timestamp), selectedDate)
  );
  
  const totalCalories = dateEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const remainingCalories = dailyGoal - totalCalories;
  const progress = Math.min(Math.round((totalCalories / dailyGoal) * 100), 100);

  const mealTypeEntries = Object.keys(MEAL_TYPES).reduce((acc, type) => ({
    ...acc,
    [type]: dateEntries.filter(entry => entry.mealType === type)
  }), {} as Record<MealType, typeof dateEntries>);

  return (
    <div 
      className="space-y-6 pb-24 pt-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <DateNavigator />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl p-4 sm:p-6 shadow-xl"
      >
        <div className="relative">
          <div className="mb-6">
            <div className="flex items-center justify-between text-white mb-2">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span className="font-medium">Daily Goal</span>
              </div>
              <span className="text-sm">{progress}%</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-white rounded-full"
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="mt-3 flex justify-between items-end">
              <div>
                <p className="text-xs text-blue-100">Consumed</p>
                <p className="text-xl font-bold text-white">{formatCalories(totalCalories)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-100">Remaining</p>
                <p className="text-xl font-bold text-white">{formatCalories(Math.max(remainingCalories, 0))}</p>
              </div>
            </div>
          </div>

          <CalorieInput />
          
          <div className="mt-4 pt-4 border-t border-white/10">
            <MealSuggestions />
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        {(Object.keys(MEAL_TYPES) as MealType[]).map((type) => (
          <MealSection
            key={type}
            mealType={type}
            entries={mealTypeEntries[type]}
            onDelete={removeEntry}
          />
        ))}
      </div>
    </div>
  );
}
