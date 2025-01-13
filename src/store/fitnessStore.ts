import { create } from 'zustand';
import { supabase } from '../lib/supabase/client';
import { calculateTargetDate, validateWeightGoal } from '../lib/fitness/goalCalculator';
import type { WeightEntry } from '../lib/supabase/types/fitness';
import { useToastContext } from '../providers/ToastProvider';
import { calculateBMR } from '../lib/calculations/bmr';
import { calculateTDEE } from '../lib/calculations/tdee';
import { adjustForGoal } from '../lib/calculations/goalAdjustment';
import { useSettingsStore } from './settingsStore';

interface FitnessState {
  entries: WeightEntry[];
  targetWeight: number | null;
  weightUnit: 'kg' | 'lbs';
  goalStartDate: string | null;
  goalStartWeight: number | null;
  goalType: 'gain' | 'lose' | 'maintain' | null;
  targetDate: string | null;
  loading: boolean;
  error: string | null;
  loadEntries: () => Promise<void>;
  addEntry: (entry: Omit<WeightEntry, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  setTargetWeight: (weight: number) => Promise<void>;
  setWeightUnit: (unit: 'kg' | 'lbs') => void;
  getCurrentWeight: () => number | null;
}

export const useFitnessStore = create<FitnessState>((set, get) => ({
  entries: [],
  targetWeight: null,
  weightUnit: 'kg',
  goalStartDate: null,
  goalStartWeight: null,
  goalType: null,
  targetDate: null,
  loading: false,
  error: null,

  loadEntries: async () => {
    try {
      set({ loading: true, error: null });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load weight entries
      const { data: entries, error: entriesError } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (entriesError) throw entriesError;

      // Load fitness goal
      const { data: goal, error: goalError } = await supabase
        .from('fitness_goals')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!goalError && goal) {
        set({
          targetWeight: goal.target_weight,
          goalStartWeight: goal.start_weight,
          goalStartDate: goal.start_date,
          goalType: goal.goal_type,
          targetDate: goal.target_date
        });
      }

      set({ entries: entries || [] });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load fitness data';
      set({ error: message });
      console.error('Error loading fitness data:', error);
    } finally {
      set({ loading: false });
    }
  },

  addEntry: async (entry) => {
    try {
      set({ error: null });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get user settings for calorie calculation
      const { data: settings, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (settingsError) throw settingsError;

      // Calculate new daily calorie goal based on updated weight
      const bmr = calculateBMR(
        entry.weight,
        settings.weight_unit,
        settings.height,
        settings.height_unit,
        settings.age,
        settings.sex
      );

      const tdee = calculateTDEE(bmr, settings.activity_level);
      const adjustedCalories = adjustForGoal(tdee, settings.goal_type, settings.weight_rate);

      // Insert weight entry
      const { data, error } = await supabase
        .from('weight_entries')
        .insert([{
          ...entry,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      // Update user's daily calorie goal
      const { error: updateError } = await supabase
        .from('user_settings')
        .update({ daily_goal: adjustedCalories })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      set(state => ({
        entries: [data, ...state.entries]
      }));

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add weight entry';
      set({ error: message });
      throw error;
    }
  },

  setTargetWeight: async (weight) => {
    try {
      set({ error: null });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const currentWeight = get().getCurrentWeight();
      if (!currentWeight) throw new Error('No current weight available');

      // Validate weights
      const validation = validateWeightGoal(currentWeight, weight);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Determine goal type
      const goalType = weight > currentWeight ? 'gain' : 
                      weight < currentWeight ? 'lose' : 
                      'maintain';

      const startDate = new Date();
      const targetDate = calculateTargetDate(currentWeight, weight);

      const { error } = await supabase
        .from('fitness_goals')
        .upsert({
          user_id: user.id,
          target_weight: weight,
          start_weight: currentWeight,
          start_date: startDate.toISOString(),
          target_date: targetDate.toISOString(),
          goal_type: goalType
        });

      if (error) throw error;

      set({
        targetWeight: weight,
        goalStartDate: startDate.toISOString(),
        goalStartWeight: currentWeight,
        goalType,
        targetDate: targetDate.toISOString()
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update target weight';
      set({ error: message });
      throw error;
    }
  },

  setWeightUnit: (unit) => {
    set({ weightUnit: unit });
  },

  getCurrentWeight: () => {
    const entries = get().entries;
    if (entries.length === 0) return null;
    return entries[0].weight;
  }
}));
