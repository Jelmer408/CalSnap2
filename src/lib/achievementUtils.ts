import { Achievement } from '../types/achievements';
import { AchievementState } from '../store/achievementStore';
import { CalorieState } from '../store/calorieStore';
import { 
  isSameDay, 
  differenceInSeconds,
  startOfDay
} from 'date-fns';

export function isAchievementNew(achievement: Achievement, unlockedAt?: string): boolean {
  if (!unlockedAt) return false;
  const unlockTime = new Date(unlockedAt).getTime();
  return Date.now() - unlockTime < 60000; // Within last minute
}

export function getAchievementProgress(achievement: Achievement, state: AchievementState & CalorieState): number {
  // If achievement has a custom progress function, use it
  if (achievement.progress) {
    return achievement.progress(state);
  }
  
  // If achievement is unlocked, return 100%
  if (state.unlockedAchievements.some(a => a.id === achievement.id)) {
    return 100;
  }
  
  // Try to calculate progress based on achievement ID
  switch (achievement.id) {
    case 'streak-3':
      return Math.min(100, (state.streak.current / 3) * 100);
    case 'streak-7':
      return Math.min(100, (state.streak.current / 7) * 100);
    case 'streak-14':
      return Math.min(100, (state.streak.current / 14) * 100);
    case 'streak-30':
      return Math.min(100, (state.streak.current / 30) * 100);
    default:
      // Try to use condition function for binary progress (0% or 100%)
      try {
        if (achievement.condition(state)) {
          return 100;
        }
      } catch (e) {
        console.error('Error checking achievement condition:', e);
      }
      return 0;
  }
}

// Helper function to group achievements by category
export function groupAchievementsByCategory(achievements: Achievement[]): Record<string, Achievement[]> {
  return achievements.reduce((grouped, achievement) => {
    const category = achievement.category || 'uncategorized';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(achievement);
    return grouped;
  }, {} as Record<string, Achievement[]>);
}

// Sort achievements for display - locked after unlocked, then by points (highest first)
export function sortAchievementsForDisplay(achievements: Achievement[], unlockedIds: Set<string>): Achievement[] {
  return [...achievements].sort((a, b) => {
    // First sort by unlock status
    const aUnlocked = unlockedIds.has(a.id);
    const bUnlocked = unlockedIds.has(b.id);
    
    if (aUnlocked && !bUnlocked) return -1;
    if (!aUnlocked && bUnlocked) return 1;
    
    // Then sort by category
    const categoryOrder = {
      'beginner': 1,
      'consistency': 2,
      'goals': 3,
      'variety': 4,
      'special': 5,
      'expert': 6,
      'uncategorized': 7
    };
    
    const aOrder = categoryOrder[a.category || 'uncategorized'] || 999;
    const bOrder = categoryOrder[b.category || 'uncategorized'] || 999;
    
    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }
    
    // Finally sort by points (highest first)
    return b.points - a.points;
  });
}
