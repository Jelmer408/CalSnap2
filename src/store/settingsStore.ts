import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase/client';
import { ActivityLevel } from '../components/settings/ActivityLevelSelector';
import { GoalType, WeightRate } from '../components/settings/WeightGoalSection';
import { calculateCalories } from '../lib/gemini/calculateCalories';

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
  updateMetrics: (metrics: Partial<UserMetrics>) => Promise<void>;
  updateActivityLevel: (level: ActivityLevel) => Promise<void>;
  updateGoalType: (type: GoalType) => Promise<void>;
  updateWeightRate: (rate: WeightRate) => Promise<void>;
  syncWithSupabase: () => Promise<void>;
  resetSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      metrics: {
        weight: 70,
        weightUnit: 'kg',
        height: 170,
        heightUnit: 'cm',
        age: 30,
        sex: 'other'
      },
      activityLevel: 'moderate',
      goalType: 'maintain',
      weightRate: 0.5,

      updateMetrics: async (newMetrics) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const updatedMetrics = { ...get().metrics, ...newMetrics };
        
        try {
          const { error } = await supabase
            .from('user_settings')
            .upsert({
              user_id: user.id,
              height: updatedMetrics.height,
              age: updatedMetrics.age,
              sex: updatedMetrics.sex,
              weight_unit: updatedMetrics.weightUnit,
              height_unit: updatedMetrics.heightUnit
            });

          if (error) throw error;

          // If weight changed, update weight entries
          if (newMetrics.weight) {
            await supabase
              .from('weight_entries')
              .insert({
                user_id: user.id,
                weight: newMetrics.weight,
                date: new Date().toISOString()
              });
          }

          set({ metrics: updatedMetrics });
        } catch (error) {
          console.error('Error updating metrics:', error);
          throw error;
        }
      },

      updateActivityLevel: async (level) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
          const { error } = await supabase
            .from('user_settings')
            .upsert({
              user_id: user.id,
              activity_level: level
            });

          if (error) throw error;
          set({ activityLevel: level });
        } catch (error) {
          console.error('Error updating activity level:', error);
          throw error;
        }
      },

      updateGoalType: async (type) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
          const { error } = await supabase
            .from('user_settings')
            .upsert({
              user_id: user.id,
              goal_type: type
            });

          if (error) throw error;
          set({ goalType: type });
        } catch (error) {
          console.error('Error updating goal type:', error);
          throw error;
        }
      },

      updateWeightRate: async (rate) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
          const { error } = await supabase
            .from('user_settings')
            .upsert({
              user_id: user.id,
              weight_rate: rate
            });

          if (error) throw error;
          set({ weightRate: rate });
        } catch (error) {
          console.error('Error updating weight rate:', error);
          throw error;
        }
      },

      syncWithSupabase: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
          // Get user settings
          const { data: settings, error: settingsError } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;

          // Get latest weight
          const { data: weightEntry, error: weightError } = await supabase
            .from('weight_entries')
            .select('weight')
            .eq('user_id', user.id)
            .order('date', { ascending: false })
            .limit(1)
            .single();

          if (weightError && weightError.code !== 'PGRST116') throw weightError;

          if (settings) {
            set(state => ({
              metrics: {
                ...state.metrics,
                weight: weightEntry?.weight || state.metrics.weight,
                weightUnit: settings.weight_unit || state.metrics.weightUnit,
                height: settings.height || state.metrics.height,
                heightUnit: settings.height_unit || state.metrics.heightUnit,
                age: settings.age || state.metrics.age,
                sex: settings.sex || state.metrics.sex
              },
              activityLevel: settings.activity_level || state.activityLevel,
              goalType: settings.goal_type || state.goalType,
              weightRate: settings.weight_rate || state.weightRate
            }));
          }
        } catch (error) {
          console.error('Error syncing with Supabase:', error);
          throw error;
        }
      },

      resetSettings: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const defaultSettings = {
          metrics: {
            weight: 70,
            weightUnit: 'kg',
            height: 170,
            heightUnit: 'cm',
            age: 30,
            sex: 'other'
          },
          activityLevel: 'moderate',
          goalType: 'maintain',
          weightRate: 0.5
        };

        try {
          const { error } = await supabase
            .from('user_settings')
            .upsert({
              user_id: user.id,
              ...defaultSettings
            });

          if (error) throw error;
          set(defaultSettings);
        } catch (error) {
          console.error('Error resetting settings:', error);
          throw error;
        }
      }
    }),
    {
      name: 'settings-storage'
    }
  )
);
