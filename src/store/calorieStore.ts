import { create } from 'zustand';
import { supabase } from '../lib/supabase/client';
import { MealType } from '../types/meals';
import { getFoodEmoji } from '../lib/gemini/foodEmoji';

export interface CalorieEntry {
  id: string;
  name: string;
  calories: number;
  timestamp: string;
  mealType: MealType;
  emoji?: string;
}

interface CalorieState {
  entries: CalorieEntry[];
  dailyGoal: number;
  recentItems: string[];
  loadEntries: () => Promise<void>;
  addEntry: (entry: Omit<CalorieEntry, 'id' | 'emoji'>) => Promise<void>;
  setDailyGoal: (goal: number) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  getTodayCalories: () => number;
}

export const useCalorieStore = create<CalorieState>((set, get) => ({
  entries: [],
  dailyGoal: 2000,
  recentItems: [],

  loadEntries: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load entries
      const { data: entries, error: entriesError } = await supabase
        .from('calorie_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (entriesError) throw entriesError;

      // Load daily goal
      const { data: settings, error: settingsError } = await supabase
        .from('user_settings')
        .select('daily_goal')
        .eq('user_id', user.id)
        .single();

      if (!settingsError && settings?.daily_goal) {
        set({ dailyGoal: settings.daily_goal });
      }

      set({ entries: entries || [] });
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  },

  addEntry: async (entry) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const emoji = await getFoodEmoji(entry.name);
      
      const { data, error } = await supabase
        .from('calorie_entries')
        .insert([{
          ...entry,
          user_id: user.id,
          emoji
        }])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        entries: [data, ...state.entries],
        recentItems: [
          entry.name,
          ...state.recentItems.filter(item => item !== entry.name)
        ].slice(0, 5)
      }));
    } catch (error) {
      console.error('Error adding entry:', error);
      throw error;
    }
  },

  setDailyGoal: async (goal) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          daily_goal: goal
        });

      if (error) throw error;
      set({ dailyGoal: goal });
    } catch (error) {
      console.error('Error updating daily goal:', error);
      throw error;
    }
  },

  removeEntry: async (id) => {
    try {
      const { error } = await supabase
        .from('calorie_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set(state => ({
        entries: state.entries.filter(entry => entry.id !== id)
      }));
    } catch (error) {
      console.error('Error removing entry:', error);
      throw error;
    }
  },

  getTodayCalories: () => {
    const todayEntries = get().entries.filter(
      entry => new Date(entry.timestamp).toDateString() === new Date().toDateString()
    );
    return todayEntries.reduce((sum, entry) => sum + entry.calories, 0);
  }
}));
