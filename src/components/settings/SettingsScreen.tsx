import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { UserMetricsSection } from './UserMetricsSection';
import { ActivityLevelSelector } from './ActivityLevelSelector';
import { WeightGoalSection } from './WeightGoalSection';
import { CalorieCalculator } from './CalorieCalculator';
import { useCalorieStore } from '../../store/calorieStore';
import { useSettingsStore } from '../../store/settingsStore';
import { calculateCalories } from '../../lib/gemini/calculateCalories';
import { useToastContext } from '../../providers/ToastProvider';

export function SettingsScreen() {
  const { dailyGoal, setDailyGoal } = useCalorieStore();
  const {
    metrics,
    activityLevel,
    goalType,
    weightRate,
    updateMetrics,
    updateActivityLevel,
    updateGoalType,
    updateWeightRate,
    resetSettings
  } = useSettingsStore();
  
  const [isCalculating, setIsCalculating] = useState(false);
  const { showToast } = useToastContext();

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const calculatedCalories = await calculateCalories({
        metrics,
        activityLevel,
        goalType,
        rate: goalType !== 'maintain' ? weightRate : undefined
      });
      setDailyGoal(calculatedCalories);
      showToast('Calorie goal updated successfully');
    } catch (error) {
      showToast('Failed to calculate calories', 'error');
      console.error('Error calculating calories:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleAdjust = (amount: number) => {
    setDailyGoal(dailyGoal + amount);
  };

  const handleReset = () => {
    resetSettings();
    setDailyGoal(2000);
    showToast('Settings reset to defaults');
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800"
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>
      </div>

      <UserMetricsSection 
        metrics={metrics} 
        onChange={updateMetrics} 
      />
      
      <ActivityLevelSelector 
        value={activityLevel} 
        onChange={updateActivityLevel} 
      />
      
      <WeightGoalSection
        goalType={goalType}
        rate={weightRate}
        onGoalTypeChange={updateGoalType}
        onRateChange={updateWeightRate}
      />
      
      <CalorieCalculator
        calories={dailyGoal}
        isCalculating={isCalculating}
        onCalculate={handleCalculate}
        onAdjust={handleAdjust}
        onReset={handleReset}
      />
    </div>
  );
}
