import { useEffect } from 'react';
import { useFitnessStore } from '../store/fitnessStore';
import { useAuth } from '../providers/AuthProvider';
import { supabase } from '../lib/supabase/client';

export function useGoalSync() {
  const { user } = useAuth();
  const { targetWeight, goalStartWeight, goalType } = useFitnessStore();

  useEffect(() => {
    if (!user || !targetWeight || !goalStartWeight || !goalType) return;

    const syncGoal = async () => {
      try {
        const { error } = await supabase
          .from('fitness_goals')
          .upsert({
            user_id: user.id,
            target_weight: targetWeight,
            start_weight: goalStartWeight,
            goal_type: goalType,
            start_date: new Date().toISOString(),
            target_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
          });

        if (error) throw error;
      } catch (error) {
        console.error('Error syncing goal:', error);
      }
    };

    syncGoal();
  }, [user, targetWeight, goalStartWeight, goalType]);
}
