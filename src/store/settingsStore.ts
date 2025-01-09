import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ActivityLevel } from '../components/settings/ActivityLevelSelector';
import { GoalType, WeightRate } from '../components/settings/WeightGoalSection';

export interface UserMetrics {
  weight: number;
  weightUnit: 'kg' | 'lbs';
  height: number;
  heightUnit: 'cm' | 'ft';
  age: number;
  sex: 'male' | 'female' | 'other';
}

interface SettingsState {
  metrics: UserMetrics;
  activityLevel: ActivityLevel;
  goalType: GoalType;
  weightRate: WeightRate;
  updateMetrics: (metrics: Partial<UserMetrics>) => void;
  updateActivityLevel: (level: ActivityLevel) => void;
  updateGoalType: (type: GoalType) => void;
  updateWeightRate: (rate: WeightRate) => void;
  resetSettings: () => void;
}

const DEFAULT_METRICS: UserMetrics = {
  weight: 70,
  weightUnit: 'kg',
  height: 170,
  heightUnit: 'cm',
  age: 30,
  sex: 'other'
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      metrics: DEFAULT_METRICS,
      activityLevel: 'moderate',
      goalType: 'maintain',
      weightRate: 0.5,

      updateMetrics: (newMetrics) =>
        set((state) => ({
          metrics: { ...state.metrics, ...newMetrics }
        })),

      updateActivityLevel: (level) =>
        set({ activityLevel: level }),

      updateGoalType: (type) =>
        set({ goalType: type }),

      updateWeightRate: (rate) =>
        set({ weightRate: rate }),

      resetSettings: () =>
        set({
          metrics: DEFAULT_METRICS,
          activityLevel: 'moderate',
          goalType: 'maintain',
          weightRate: 0.5
        })
    }),
    {
      name: 'settings-storage'
    }
  )
);
