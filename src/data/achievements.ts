import { Achievement } from '../types/achievements';
import { 
  isSameDay, 
  subDays, 
  differenceInDays,
  isToday
} from 'date-fns';

// Define the FoodEntry interface for type safety
export interface FoodEntry {
  id: string;
  date: string | Date;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  mealType?: string;
  imageUrl?: string;
}

// Helper functions to work with entries
function getTodayEntries(entries: FoodEntry[]): FoodEntry[] {
  return entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return isToday(entryDate);
  });
}

function getEntriesForDay(entries: FoodEntry[], day: Date): FoodEntry[] {
  return entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return isSameDay(entryDate, day);
  });
}

export function getConsecutiveDaysWithEntries(entries: FoodEntry[]): number {
  const today = new Date();
  let consecutiveDays = 0;
  
  for (let i = 0; i < 7; i++) {
    const day = subDays(today, i);
    const hasEntries = getEntriesForDay(entries, day).length > 0;
    
    if (hasEntries) {
      consecutiveDays++;
    } else {
      break;
    }
  }
  
  return consecutiveDays;
}

export function getUniqueEntryCount(entries: FoodEntry[], property: keyof FoodEntry): number {
  return new Set(entries.map(entry => {
    const value = entry[property];
    return typeof value === 'string' ? value.toLowerCase() : String(value);
  })).size;
}

// Achievement definitions
export const achievements: Achievement[] = [
  // First Steps
  {
    id: 'first-entry',
    name: 'First Bite',
    description: 'Log your first food entry',
    icon: '🍽️',
    points: 10,
    condition: (state) => state.entries.length > 0,
    category: 'beginner'
  },
  {
    id: 'calorie-goal',
    name: 'Goal Setter',
    description: 'Set a daily calorie goal',
    icon: '🎯',
    points: 15,
    condition: (state) => state.dailyGoal > 0,
    category: 'beginner'
  },
  {
    id: 'complete-day',
    name: 'Day Complete',
    description: 'Log all your meals for an entire day',
    icon: '📝',
    points: 20,
    condition: (state) => {
      const todayEntries = getTodayEntries(state.entries);
      const mealTypes = new Set(todayEntries.map(entry => entry.mealType));
      return mealTypes.has('breakfast') && mealTypes.has('lunch') && mealTypes.has('dinner');
    },
    category: 'beginner'
  },
  
  // Consistency Achievements
  {
    id: 'streak-3',
    name: 'Consistency Kickoff',
    description: 'Log food for 3 consecutive days',
    icon: '🔥',
    points: 25,
    condition: (state) => state.streak.current >= 3,
    category: 'consistency',
    progress: (state) => Math.min(100, (state.streak.current / 3) * 100)
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Log food for 7 consecutive days',
    icon: '📅',
    points: 50,
    condition: (state) => state.streak.current >= 7,
    category: 'consistency',
    progress: (state) => Math.min(100, (state.streak.current / 7) * 100)
  },
  {
    id: 'streak-14',
    name: 'Fortnight Foodie',
    description: 'Log food for 14 consecutive days',
    icon: '✨',
    points: 75,
    condition: (state) => state.streak.current >= 14,
    category: 'consistency',
    progress: (state) => Math.min(100, (state.streak.current / 14) * 100)
  },
  {
    id: 'streak-30',
    name: 'Month Master',
    description: 'Log food for 30 consecutive days',
    icon: '🏆',
    points: 100,
    condition: (state) => state.streak.current >= 30,
    category: 'consistency',
    progress: (state) => Math.min(100, (state.streak.current / 30) * 100)
  },
  
  // Goal Achievements
  {
    id: 'under-goal',
    name: 'Under Control',
    description: 'Stay under your calorie goal for a day',
    icon: '👍',
    points: 20,
    condition: (state) => {
      const todayEntries = getTodayEntries(state.entries);
      const todayCalories = todayEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
      return todayCalories <= state.dailyGoal && todayCalories > 0;
    },
    category: 'goals'
  },
  {
    id: 'perfect-week',
    name: 'Perfect Week',
    description: 'Stay within 100 calories of your goal every day for a week',
    icon: '🌟',
    points: 80,
    condition: (state) => {
      const today = new Date();
      const perfectDays = Array.from({ length: 7 }, (_, i) => {
        const day = subDays(today, i);
        const dayEntries = getEntriesForDay(state.entries, day);
        if (dayEntries.length === 0) return false;
        
        const dayCalories = dayEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
        return Math.abs(dayCalories - state.dailyGoal) <= 100;
      });
      
      return perfectDays.filter(Boolean).length >= 7;
    },
    category: 'goals',
    progress: (state) => {
      const today = new Date();
      let perfectDays = 0;
      
      for (let i = 0; i < 7; i++) {
        const day = subDays(today, i);
        const dayEntries = getEntriesForDay(state.entries, day);
        if (dayEntries.length === 0) continue;
        
        const dayCalories = dayEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
        if (Math.abs(dayCalories - state.dailyGoal) <= 100) {
          perfectDays++;
        }
      }
      
      return Math.min(100, (perfectDays / 7) * 100);
    }
  },
  {
    id: 'balanced-day',
    name: 'Balanced Day',
    description: 'Log balanced meals with protein, carbs, and vegetables',
    icon: '🥗',
    points: 30,
    condition: (state) => {
      const todayEntries = getTodayEntries(state.entries);
      const hasProtein = todayEntries.some(entry => 
        ['chicken', 'fish', 'beef', 'eggs', 'tofu', 'protein', 'meat'].some(keyword => 
          entry.name.toLowerCase().includes(keyword)
        )
      );
      
      const hasCarbs = todayEntries.some(entry => 
        ['rice', 'pasta', 'bread', 'potato', 'grain'].some(keyword => 
          entry.name.toLowerCase().includes(keyword)
        )
      );
      
      const hasVeggies = todayEntries.some(entry => 
        ['vegetable', 'salad', 'broccoli', 'spinach', 'greens'].some(keyword => 
          entry.name.toLowerCase().includes(keyword)
        )
      );
      
      return hasProtein && hasCarbs && hasVeggies;
    },
    category: 'goals'
  },
  {
    id: 'within-budget',
    name: 'Budget Maestro',
    description: 'Stay within your calorie budget 5 days in a row',
    icon: '💰',
    points: 60,
    condition: (state) => {
      const today = new Date();
      let streakDays = 0;
      
      for (let i = 0; i < 5; i++) {
        const day = subDays(today, i);
        const dayEntries = getEntriesForDay(state.entries, day);
        if (dayEntries.length === 0) break;
        
        const dayCalories = dayEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
        if (dayCalories <= state.dailyGoal) {
          streakDays++;
        } else {
          break;
        }
      }
      
      return streakDays >= 5;
    },
    category: 'goals',
    progress: (state) => {
      const today = new Date();
      let streakDays = 0;
      
      for (let i = 0; i < 5; i++) {
        const day = subDays(today, i);
        const dayEntries = getEntriesForDay(state.entries, day);
        if (dayEntries.length === 0) break;
        
        const dayCalories = dayEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
        if (dayCalories <= state.dailyGoal) {
          streakDays++;
        } else {
          break;
        }
      }
      
      return Math.min(100, (streakDays / 5) * 100);
    }
  },
  
  // Variety Achievements
  {
    id: 'variety-5',
    name: 'Variety Starter',
    description: 'Log 5 different foods',
    icon: '🍲',
    points: 20,
    condition: (state) => getUniqueEntryCount(state.entries, 'name') >= 5,
    category: 'variety',
    progress: (state) => Math.min(100, (getUniqueEntryCount(state.entries, 'name') / 5) * 100)
  },
  {
    id: 'variety-15',
    name: 'Diverse Diet',
    description: 'Log 15 different foods',
    icon: '🍱',
    points: 40,
    condition: (state) => getUniqueEntryCount(state.entries, 'name') >= 15,
    category: 'variety',
    progress: (state) => Math.min(100, (getUniqueEntryCount(state.entries, 'name') / 15) * 100)
  },
  {
    id: 'variety-30',
    name: 'Food Explorer',
    description: 'Log 30 different foods',
    icon: '🧭',
    points: 60,
    condition: (state) => getUniqueEntryCount(state.entries, 'name') >= 30,
    category: 'variety',
    progress: (state) => Math.min(100, (getUniqueEntryCount(state.entries, 'name') / 30) * 100)
  },
  {
    id: 'international',
    name: 'International Palate',
    description: 'Log foods from at least 3 different cuisines',
    icon: '🌍',
    points: 35,
    condition: (state) => {
      const cuisines = {
        italian: ['pasta', 'pizza', 'risotto'],
        mexican: ['taco', 'burrito', 'quesadilla'],
        asian: ['sushi', 'stir fry', 'curry', 'noodles'],
        mediterranean: ['hummus', 'falafel', 'pita', 'olive']
      };
      
      const foundCuisines = new Set<string>();
      state.entries.forEach((entry: FoodEntry) => {
        const name = entry.name.toLowerCase();
        Object.entries(cuisines).forEach(([cuisine, keywords]) => {
          if ((keywords as string[]).some((keyword: string) => name.includes(keyword))) {
            foundCuisines.add(cuisine);
          }
        });
      });
      
      return foundCuisines.size >= 3;
    },
    category: 'variety',
    progress: (state) => {
      const cuisines = {
        italian: ['pasta', 'pizza', 'risotto'],
        mexican: ['taco', 'burrito', 'quesadilla'],
        asian: ['sushi', 'stir fry', 'curry', 'noodles'],
        mediterranean: ['hummus', 'falafel', 'pita', 'olive']
      };
      
      let totalCuisinesFound = 0;
      const knownCuisines = new Set<string>();
      
      state.entries.forEach((entry: FoodEntry) => {
        const name = entry.name.toLowerCase();
        Object.entries(cuisines).forEach(([cuisine, keywords]) => {
          if ((keywords as string[]).some((keyword: string) => name.includes(keyword))) {
            if (!knownCuisines.has(cuisine)) {
              knownCuisines.add(cuisine);
              totalCuisinesFound++;
            }
          }
        });
      });
      
      return Math.min(100, (totalCuisinesFound / 3) * 100);
    }
  },
  
  // Special Achievements
  {
    id: 'weekend-warrior',
    name: 'Weekend Warrior',
    description: 'Log all meals during the weekend',
    icon: '🏄',
    points: 40,
    condition: (state) => {
      const today = new Date();
      const isWeekend = today.getDay() === 0 || today.getDay() === 6;
      if (!isWeekend) return false;
      
      const todayEntries = getTodayEntries(state.entries);
      const mealTypes = new Set(todayEntries.map(entry => entry.mealType));
      return mealTypes.has('breakfast') && mealTypes.has('lunch') && mealTypes.has('dinner');
    },
    category: 'special'
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Log breakfast before 8 AM',
    icon: '🌅',
    points: 25,
    condition: (state) => {
      const todayEntries = getTodayEntries(state.entries);
      return todayEntries.some(entry => 
        entry.mealType === 'breakfast' && 
        new Date(entry.date).getHours() < 8
      );
    },
    category: 'special'
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Log dinner after 8 PM',
    icon: '🦉',
    points: 25,
    condition: (state) => {
      const todayEntries = getTodayEntries(state.entries);
      return todayEntries.some(entry => 
        entry.mealType === 'dinner' && 
        new Date(entry.date).getHours() >= 20
      );
    },
    category: 'special'
  },
  {
    id: 'water-tracker',
    name: 'Hydration Hero',
    description: 'Log water consumption for 3 consecutive days',
    icon: '💧',
    points: 30,
    condition: (state) => {
      const today = new Date();
      let waterDays = 0;
      
      for (let i = 0; i < 3; i++) {
        const day = subDays(today, i);
        const dayEntries = getEntriesForDay(state.entries, day);
        const hasWater = dayEntries.some(entry => 
          ['water', 'h2o'].some(keyword => 
            entry.name.toLowerCase().includes(keyword)
          )
        );
        
        if (hasWater) {
          waterDays++;
        } else {
          break;
        }
      }
      
      return waterDays >= 3;
    },
    category: 'special',
    progress: (state) => {
      const today = new Date();
      let waterDays = 0;
      
      for (let i = 0; i < 3; i++) {
        const day = subDays(today, i);
        const dayEntries = getEntriesForDay(state.entries, day);
        const hasWater = dayEntries.some(entry => 
          ['water', 'h2o'].some(keyword => 
            entry.name.toLowerCase().includes(keyword)
          )
        );
        
        if (hasWater) {
          waterDays++;
        } else {
          break;
        }
      }
      
      return Math.min(100, (waterDays / 3) * 100);
    }
  },
  
  // Expert Level
  {
    id: 'calorie-master',
    name: 'Calorie Master',
    description: 'Track every day for 2 months',
    icon: '👑',
    points: 150,
    condition: (state) => {
      if (state.entries.length === 0) return false;
      
      // Sort entries by date
      const sortedEntries = [...state.entries].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      const firstEntryDate = new Date(sortedEntries[0].date);
      const today = new Date();
      const daysSinceFirstEntry = differenceInDays(today, firstEntryDate);
      
      return daysSinceFirstEntry >= 60 && state.streak.current >= 60;
    },
    category: 'expert',
    progress: (state) => {
      if (state.entries.length === 0) return 0;
      
      const sortedEntries = [...state.entries].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      const firstEntryDate = new Date(sortedEntries[0].date);
      const today = new Date();
      const daysSinceFirstEntry = differenceInDays(today, firstEntryDate);
      
      return Math.min(100, (daysSinceFirstEntry / 60) * 100);
    }
  },
  {
    id: 'nutrition-scholar',
    name: 'Nutrition Scholar',
    description: 'Log 100 different food items',
    icon: '🎓',
    points: 120,
    condition: (state) => getUniqueEntryCount(state.entries, 'name') >= 100,
    category: 'expert',
    progress: (state) => {
      let totalIngredientsFound = 0;
      const knownIngredients = new Set<string>();
      
      state.entries.forEach((entry: FoodEntry) => {
        const name = entry.name.toLowerCase();
        if (!knownIngredients.has(name)) {
          knownIngredients.add(name);
          totalIngredientsFound++;
        }
      });
      
      return Math.min(100, (totalIngredientsFound / 100) * 100);
    }
  }
];
