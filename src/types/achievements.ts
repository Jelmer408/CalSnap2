import { CalorieState } from '../store/calorieStore';
import { AchievementState } from '../store/achievementStore';

export type AchievementCategory = 'beginner' | 'consistency' | 'goals' | 'variety' | 'special' | 'expert';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (state: CalorieState & AchievementState) => boolean;
  points: number;
  unlockedAt?: string;
  category: AchievementCategory;
  progress?: (state: CalorieState & AchievementState) => number;
}

export interface Streak {
  current: number;
  longest: number;
  lastLogDate: string;
}
