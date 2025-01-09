import { CalorieEntry } from '../../store/calorieStore';
import { MealSuggestion } from '../../types/suggestions';
import { isToday, subDays, isWithinInterval, startOfDay } from 'date-fns';

interface MealFrequency {
  name: string;
  count: number;
  lastEaten: string;
  calories: number;
  emoji?: string;
}

function getRecentMeals(entries: CalorieEntry[], days: number) {
  const today = new Date();
  const startDate = subDays(today, days);
  
  return entries.filter(entry => 
    isWithinInterval(new Date(entry.timestamp), {
      start: startOfDay(startDate),
      end: today
    })
  );
}

function calculateMealFrequencies(meals: CalorieEntry[]): MealFrequency[] {
  const frequencies = new Map<string, MealFrequency>();

  meals.forEach(meal => {
    const key = meal.name.toLowerCase();
    const existing = frequencies.get(key);

    if (existing) {
      frequencies.set(key, {
        ...existing,
        count: existing.count + 1,
        lastEaten: new Date(meal.timestamp) > new Date(existing.lastEaten) 
          ? meal.timestamp 
          : existing.lastEaten
      });
    } else {
      frequencies.set(key, {
        name: meal.name,
        count: 1,
        lastEaten: meal.timestamp,
        calories: meal.calories,
        emoji: meal.emoji
      });
    }
  });

  return Array.from(frequencies.values());
}

export function analyzePreviousMeals(entries: CalorieEntry[], currentMealType: string): MealSuggestion[] {
  // Get meals from the last 7 days
  const recentMeals = getRecentMeals(entries, 7);
  
  // Get meals of the current type
  const typedMeals = recentMeals.filter(meal => meal.mealType === currentMealType);
  
  // Calculate frequencies
  const frequencies = calculateMealFrequencies(typedMeals);
  
  // Don't suggest meals already eaten today
  const todayMeals = new Set(
    entries
      .filter(entry => isToday(new Date(entry.timestamp)))
      .map(entry => entry.name.toLowerCase())
  );

  // Convert frequencies to suggestions
  return frequencies
    .filter(freq => !todayMeals.has(freq.name.toLowerCase()))
    .map(freq => ({
      name: freq.name,
      calories: freq.calories,
      mealType: currentMealType,
      // Higher confidence for more frequent meals
      confidence: Math.min(0.5 + (freq.count * 0.1), 0.9),
      emoji: freq.emoji || '🍽️',
      lastEaten: freq.lastEaten
    }))
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);
}
