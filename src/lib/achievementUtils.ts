import { Achievement } from '../types/achievements';

export function isAchievementNew(achievement: Achievement, unlockedAt?: string): boolean {
  if (!unlockedAt) return false;
  const unlockTime = new Date(unlockedAt).getTime();
  return Date.now() - unlockTime < 60000; // Within last minute
}

export function getAchievementProgress(achievement: Achievement, state: any): number {
  switch (achievement.id) {
    case 'streak-3':
      return (state.streak.current / 3) * 100;
    case 'streak-7':
      return (state.streak.current / 7) * 100;
    case 'variety-5':
      return (new Set(state.entries.map((e: any) => e.name.toLowerCase())).size / 5) * 100;
    case 'variety-10':
      return (new Set(state.entries.map((e: any) => e.name.toLowerCase())).size / 10) * 100;
    default:
      return 0;
  }
}
