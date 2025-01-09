import { create } from 'zustand';
import { supabase } from '../lib/supabase/client';
import type { FitnessMilestone } from '../lib/supabase/types/fitness';

interface MilestoneState {
  milestones: FitnessMilestone[];
  loading: boolean;
  error: string | null;
  loadMilestones: () => Promise<void>;
  addMilestone: (milestone: Omit<FitnessMilestone, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateMilestone: (id: string, milestone: Partial<FitnessMilestone>) => Promise<void>;
  deleteMilestone: (id: string) => Promise<void>;
  markAchieved: (id: string) => Promise<void>;
}

export const useMilestoneStore = create<MilestoneState>((set) => ({
  milestones: [],
  loading: false,
  error: null,

  loadMilestones: async () => {
    try {
      set({ loading: true, error: null });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('fitness_milestones')
        .select('*')
        .eq('user_id', user.id)
        .order('target_date', { ascending: true });

      if (error) throw error;
      set({ milestones: data || [] });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load milestones';
      set({ error: message });
      console.error('Error loading milestones:', error);
    } finally {
      set({ loading: false });
    }
  },

  addMilestone: async (milestone) => {
    try {
      set({ error: null });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('fitness_milestones')
        .insert([{
          ...milestone,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        milestones: [...state.milestones, data]
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add milestone';
      set({ error: message });
      throw error;
    }
  },

  updateMilestone: async (id, milestone) => {
    try {
      set({ error: null });
      const { error } = await supabase
        .from('fitness_milestones')
        .update(milestone)
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        milestones: state.milestones.map(m =>
          m.id === id ? { ...m, ...milestone } : m
        )
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update milestone';
      set({ error: message });
      throw error;
    }
  },

  deleteMilestone: async (id) => {
    try {
      set({ error: null });
      const { error } = await supabase
        .from('fitness_milestones')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        milestones: state.milestones.filter(m => m.id !== id)
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete milestone';
      set({ error: message });
      throw error;
    }
  },

  markAchieved: async (id) => {
    try {
      set({ error: null });
      const achievedDate = new Date().toISOString();
      const { error } = await supabase
        .from('fitness_milestones')
        .update({ achieved_date: achievedDate })
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        milestones: state.milestones.map(m =>
          m.id === id ? { ...m, achieved_date: achievedDate } : m
        )
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to mark milestone as achieved';
      set({ error: message });
      throw error;
    }
  }
}));
