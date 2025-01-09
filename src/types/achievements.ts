import { CalorieState } from '../store/calorieStore';
import { AchievementState } from '../store/achievementStore';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (state: CalorieState & AchievementState) => boolean;
  points: number;
  unlockedAt?: string;
}

export interface Streak {
  current: number;
  longest: number;
  lastLogDate: string;
}
