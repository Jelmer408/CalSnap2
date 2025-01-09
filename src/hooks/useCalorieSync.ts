import { useEffect } from 'react';
import { useCalorieStore } from '../store/calorieStore';
import { useAuth } from '../providers/AuthProvider';

export function useCalorieSync() {
  const { user } = useAuth();
  const { loadEntries } = useCalorieStore();

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user, loadEntries]);
}
