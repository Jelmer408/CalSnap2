import { create } from 'zustand';
import { supabase } from '../lib/supabase/client';
import { achievements } from '../data/achievements';
import { Achievement, Streak } from '../types/achievements';
import { useCalorieStore } from './calorieStore';

export interface AchievementState {
  unlockedAchievements: Achievement[];
  streak: Streak;
  points: number;
  level: number;
  loading: boolean;
  error: string | null;
  loadAchievements: () => Promise<void>;
  checkAchievements: () => Promise<void>;
  updateStreak: () => Promise<void>;
}

export const useAchievementStore = create<AchievementState>((set, get) => ({
  unlockedAchievements: [],
  streak: {
    current: 0,
    longest: 0,
    lastLogDate: ''
  },
  points: 0,
  level: 1,
  loading: false,
  error: null,

  loadAchievements: async () => {
    try {
      set({ loading: true, error: null });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;

      const unlockedAchievements = data.map(record => ({
        ...achievements.find(a => a.id === record.achievement_id)!,
        unlockedAt: record.unlocked_at
      })).filter(Boolean);

      set({
        unlockedAchievements,
        points: data.reduce((sum, a) => sum + a.points, 0),
        level: Math.floor(data.reduce((sum, a) => sum + a.points, 0) / 100) + 1
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load achievements';
      set({ error: message });
      console.error('Error loading achievements:', error);
    } finally {
      set({ loading: false });
    }
  },
  
  checkAchievements: async () => {
    try {
      set({ error: null });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const state = get();
      const calorieStore = useCalorieStore.getState();
      const combinedState = {
        ...state,
        ...calorieStore,
        entries: calorieStore.entries,
        dailyGoal: calorieStore.dailyGoal,
        getTodayCalories: calorieStore.getTodayCalories,
      };
      
      const newAchievements = achievements.filter(
        achievement => 
          !state.unlockedAchievements.find(a => a.id === achievement.id) &&
          achievement.condition(combinedState)
      );
      
      if (newAchievements.length > 0) {
        const { error } = await supabase
          .from('user_achievements')
          .insert(
            newAchievements.map(achievement => ({
              user_id: user.id,
              achievement_id: achievement.id,
              points: achievement.points,
              unlocked_at: new Date().toISOString()
            }))
          );

        if (error) throw error;

        set(state => ({
          unlockedAchievements: [
            ...state.unlockedAchievements,
            ...newAchievements.map(a => ({
              ...a,
              unlockedAt: new Date().toISOString()
            }))
          ],
          points: state.points + newAchievements.reduce((sum, a) => sum + a.points, 0),
          level: Math.floor((state.points + newAchievements.reduce((sum, a) => sum + a.points, 0)) / 100) + 1
        }));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to check achievements';
      set({ error: message });
      console.error('Error checking achievements:', error);
    }
  },
  
  updateStreak: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toDateString();
      const lastLog = new Date(get().streak.lastLogDate).toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      let newStreak;
      if (today === lastLog) return;
      
      if (lastLog === yesterday) {
        const current = get().streak.current + 1;
        newStreak = {
          current,
          longest: Math.max(current, get().streak.longest),
          lastLogDate: today
        };
      } else {
        newStreak = {
          current: 1,
          longest: get().streak.longest,
          lastLogDate: today
        };
      }

      const { error } = await supabase
        .from('user_streaks')
        .upsert({
          user_id: user.id,
          current_streak: newStreak.current,
          longest_streak: newStreak.longest,
          last_log_date: new Date().toISOString()
        });

      if (error) throw error;
      set({ streak: newStreak });
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  }
}));

// Initialize data when auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session) {
    useAchievementStore.getState().loadAchievements();
  } else if (event === 'SIGNED_OUT') {
    useAchievementStore.setState({
      unlockedAchievements: [],
      streak: { current: 0, longest: 0, lastLogDate: '' },
      points: 0,
      level: 1
    });
  }
});
