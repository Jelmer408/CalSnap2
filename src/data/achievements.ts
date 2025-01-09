import { Achievement } from '../types/achievements';
import { isWithinInterval, subDays, startOfDay, endOfDay } from 'date-fns';

// Helper functions
const getUniqueFoods = (entries: any[]) => new Set(entries.map(e => e.name.toLowerCase())).size;

const getTodayEntries = (entries: any[]) => 
  entries.filter(entry => new Date(entry.timestamp).toDateString() === new Date().toDateString());

const getEntriesForDay = (entries: any[], date: Date) => 
  entries.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    return isWithinInterval(entryDate, {
      start: startOfDay(date),
      end: endOfDay(date)
    });
  });

const hasConsecutiveDaysUnderGoal = (entries: any[], dailyGoal: number, days: number) => {
  const today = new Date();
  const daysToCheck = Array.from({ length: days }, (_, i) => subDays(today, i));
  
  let consecutiveDays = 0;
  for (const date of daysToCheck) {
    const dayEntries = getEntriesForDay(entries, date);
    if (dayEntries.length === 0) return false;
    
    const dayCalories = dayEntries.reduce((sum, e) => sum + e.calories, 0);
    if (dayCalories <= dailyGoal) {
      consecutiveDays++;
    } else {
      break;
    }
  }
  return consecutiveDays >= days;
};

export const achievements: Achievement[] = [
  // Beginner Milestones
  {
    id: 'first-entry',
    name: 'First Steps',
    description: 'Log your first meal',
    icon: '🌟',
    points: 10,
    condition: (state) => state.entries.length > 0
  },
  {
    id: 'streak-3',
    name: 'Consistency is Key',
    description: 'Maintain a 3-day logging streak',
    icon: '🔥',
    points: 20,
    condition: (state) => state.streak.current >= 3
  },
  {
    id: 'goal-master',
    name: 'Goal Master',
    description: 'Stay within 100 calories of your goal',
    icon: '🎯',
    points: 20,
    condition: (state) => {
      const todayCalories = state.getTodayCalories();
      return Math.abs(todayCalories - state.dailyGoal) <= 100;
    }
  },
  {
    id: 'variety-5',
    name: 'Variety Seeker',
    description: 'Log 5 different foods',
    icon: '🥗',
    points: 30,
    condition: (state) => getUniqueFoods(state.entries) >= 5
  },

  // Intermediate Achievements
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day logging streak',
    icon: '📅',
    points: 50,
    condition: (state) => state.streak.current >= 7
  },
  {
    id: 'variety-10',
    name: 'Variety King',
    description: 'Log 10 different foods',
    icon: '👑',
    points: 40,
    condition: (state) => getUniqueFoods(state.entries) >= 10
  },
  {
    id: 'perfect-day',
    name: 'Perfect Balance',
    description: 'Hit your calorie goal exactly',
    icon: '⚖️',
    points: 50,
    condition: (state) => {
      const todayCalories = state.getTodayCalories();
      return todayCalories === state.dailyGoal;
    }
  },

  // Advanced Achievements
  {
    id: 'streak-30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day logging streak',
    icon: '🏆',
    points: 100,
    condition: (state) => state.streak.current >= 30
  },
  {
    id: 'variety-20',
    name: 'Food Explorer',
    description: 'Log 20 different foods',
    icon: '🌎',
    points: 50,
    condition: (state) => getUniqueFoods(state.entries) >= 20
  },
  {
    id: 'under-goal-7',
    name: 'Health Champion',
    description: 'Stay under your calorie goal for 7 consecutive days',
    icon: '🏅',
    points: 80,
    condition: (state) => hasConsecutiveDaysUnderGoal(state.entries, state.dailyGoal, 7)
  },

  // Meal Planning Achievements
  {
    id: 'meal-plan-creator',
    name: 'Master Planner',
    description: 'Create your first meal plan',
    icon: '📋',
    points: 30,
    condition: (state) => state.plans?.length > 0
  },
  {
    id: 'meal-plan-saver',
    name: 'Plan Collector',
    description: 'Save 5 different meal plans',
    icon: '💾',
    points: 50,
    condition: (state) => state.plans?.length >= 5
  },

  // Daily Habits
  {
    id: 'breakfast-champion',
    name: 'Breakfast Champion',
    description: 'Log breakfast for 5 consecutive days',
    icon: '🌅',
    points: 40,
    condition: (state) => {
      const today = new Date();
      const daysToCheck = Array.from({ length: 5 }, (_, i) => subDays(today, i));
      return daysToCheck.every(date => {
        const dayEntries = getEntriesForDay(state.entries, date);
        return dayEntries.some(entry => entry.mealType === 'breakfast');
      });
    }
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Log breakfast before 9 AM',
    icon: '🌅',
    points: 30,
    condition: (state) => {
      const todayEntries = getTodayEntries(state.entries);
      return todayEntries.some(entry => {
        const entryHour = new Date(entry.timestamp).getHours();
        return entryHour < 9;
      });
    }
  },

  // Expert Level
  {
    id: 'calorie-master',
    name: 'Calorie Master',
    description: 'Stay within 50 calories of your goal for 5 days',
    icon: '🎯',
    points: 80,
    condition: (state) => {
      const today = new Date();
      const daysToCheck = Array.from({ length: 5 }, (_, i) => subDays(today, i));
      return daysToCheck.every(date => {
        const dayEntries = getEntriesForDay(state.entries, date);
        const totalCalories = dayEntries.reduce((sum, e) => sum + e.calories, 0);
        return Math.abs(totalCalories - state.dailyGoal) <= 50;
      });
    }
  },
  {
    id: 'nutrition-expert',
    name: 'Nutrition Expert',
    description: 'Log detailed nutritional info for 50 meals',
    icon: '🧪',
    points: 100,
    condition: (state) => {
      const detailedEntries = state.entries.filter(e => 
        e.protein && e.carbs && e.fat && 
        e.protein > 0 && e.carbs > 0 && e.fat > 0
      );
      return detailedEntries.length >= 50;
    }
  }
];
