import { useState, useEffect } from 'react';
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
import { useFitnessStore } from '../../store/fitnessStore';

export function SettingsScreen() {
  const { dailyGoal, setDailyGoal } = useCalorieStore();
  const { getCurrentWeight } = useFitnessStore();
  const {
    metrics,
    activityLevel,
    goalType,
    weightRate,
    updateMetrics,
    updateActivityLevel,
    updateGoalType,
    updateWeightRate,
    resetSettings,
    syncWithSupabase
  } = useSettingsStore();
  
  const [isCalculating, setIsCalculating] = useState(false);
  const { showToast } = useToastContext();

  // Sync with Supabase on mount
  useEffect(() => {
    syncWithSupabase().catch(error => {
      console.error('Error syncing settings:', error);
      showToast('Failed to load settings', 'error');
    });
  }, []);

  // Update weight when current weight changes
  useEffect(() => {
    const currentWeight = getCurrentWeight();
    if (currentWeight && currentWeight !== metrics.weight) {
      updateMetrics({ weight: currentWeight }).catch(error => {
        console.error('Error updating weight:', error);
        showToast('Failed to update weight', 'error');
      });
    }
  }, [getCurrentWeight, metrics.weight]);

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

  const handleReset = async () => {
    try {
      await resetSettings();
      setDailyGoal(2000);
      showToast('Settings reset to defaults');
    } catch (error) {
      showToast('Failed to reset settings', 'error');
      console.error('Error resetting settings:', error);
    }
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
