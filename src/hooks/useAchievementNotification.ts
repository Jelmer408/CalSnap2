import { useState, useEffect } from 'react';
import { useAchievementStore } from '../store/achievementStore';
import { Achievement } from '../types/achievements';

export function useAchievementNotification() {
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const { unlockedAchievements } = useAchievementStore();

  useEffect(() => {
    const lastAchievement = unlockedAchievements[unlockedAchievements.length - 1];
    if (lastAchievement?.unlockedAt) {
      const unlockTime = new Date(lastAchievement.unlockedAt).getTime();
      const now = Date.now();
      if (now - unlockTime < 1000) {
        setNewAchievement(lastAchievement);
      }
    }
  }, [unlockedAchievements]);

  return {
    newAchievement,
    clearAchievement: () => setNewAchievement(null)
  };
}
