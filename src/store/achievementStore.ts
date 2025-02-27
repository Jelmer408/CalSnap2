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

      // Load achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (achievementsError) throw achievementsError;

      // Load streak data
      const { data: streakData, error: streakError } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (streakError && streakError.code !== 'PGRST116') throw streakError;

      const unlockedAchievements = achievementsData.map(record => ({
        ...achievements.find(a => a.id === record.achievement_id)!,
        unlockedAt: record.unlocked_at
      })).filter(Boolean);
      
      // Calculate total points based on the predefined achievements data
      const totalPoints = unlockedAchievements.reduce(
        (sum, achievement) => sum + achievement.points, 
        0
      );

      set({
        unlockedAchievements,
        points: totalPoints,
        level: Math.floor(totalPoints / 100) + 1,
        streak: streakData ? {
          current: streakData.current_streak,
          longest: streakData.longest_streak,
          lastLogDate: streakData.last_log_date
        } : {
          current: 0,
          longest: 0,
          lastLogDate: ''
        }
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

      // Get latest streak data
      const { data: streakData, error: streakError } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (streakError && streakError.code !== 'PGRST116') throw streakError;

      if (streakData) {
        set({
          streak: {
            current: streakData.current_streak,
            longest: streakData.longest_streak,
            lastLogDate: streakData.last_log_date
          }
        });
      }
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
