import { useEffect } from 'react';
import { useFitnessStore } from '../store/fitnessStore';
import { useMilestoneStore } from '../store/milestoneStore';
import { useAuth } from '../providers/AuthProvider';

export function useFitnessSync() {
  const { user } = useAuth();
  const { loadEntries } = useFitnessStore();
  const { loadMilestones } = useMilestoneStore();

  useEffect(() => {
    if (user) {
      loadEntries();
      loadMilestones();
    }
  }, [user, loadEntries, loadMilestones]);
}
