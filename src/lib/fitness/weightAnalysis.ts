import { WeightEntry } from '../supabase/types/fitness';
import { differenceInDays, subDays, startOfDay, endOfDay } from 'date-fns';

/**
 * Gets the most recent entries within a specified number of days
 */
export function getRecentEntries(entries: WeightEntry[], days: number): WeightEntry[] {
  const today = new Date();
  const startDate = subDays(today, days);
  
  return entries
    .filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startOfDay(startDate) && entryDate <= endOfDay(today);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Calculates the weekly rate of weight change
 */
export function calculateWeeklyRate(entries: WeightEntry[]): number {
  // Get entries from the last 14 days for more accurate recent trend
  const recentEntries = getRecentEntries(entries, 14);
  
  if (recentEntries.length < 2) return 0;

  // Use first and last entries for rate calculation
  const firstEntry = recentEntries[recentEntries.length - 1];
  const lastEntry = recentEntries[0];
  
  const daysDiff = differenceInDays(new Date(lastEntry.date), new Date(firstEntry.date));
  if (daysDiff === 0) return 0;

  const weightDiff = lastEntry.weight - firstEntry.weight;
  const dailyRate = weightDiff / daysDiff;
  
  // Convert to weekly rate
  const weeklyRate = dailyRate * 7;

  // Return absolute value with 2 decimal precision
  return Math.abs(Number(weeklyRate.toFixed(2)));
}

/**
 * Calculates the total weight change
 */
export function calculateTotalChange(entries: WeightEntry[]): number {
  if (entries.length < 2) return 0;
  
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return Math.abs(sortedEntries[0].weight - sortedEntries[sortedEntries.length - 1].weight);
}
