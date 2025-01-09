import { WeightEntry } from '../supabase/types/fitness';
import { differenceInDays, differenceInWeeks, addDays } from 'date-fns';

export function calculateWeeklyRate(entries: WeightEntry[]): number {
  if (entries.length < 2) return 0;

  // Sort entries by date
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const firstEntry = sortedEntries[0];
  const lastEntry = sortedEntries[sortedEntries.length - 1];
  
  const weeks = Math.max(
    differenceInWeeks(new Date(lastEntry.date), new Date(firstEntry.date)),
    1
  );
  
  const weightChange = lastEntry.weight - firstEntry.weight;
  return Number((Math.abs(weightChange) / weeks).toFixed(2));
}

export function calculateRemainingWeeks(
  currentWeight: number,
  targetWeight: number,
  weeklyRate: number
): number {
  if (!weeklyRate) return 12; // Default to 12 weeks if no rate available
  const remainingChange = Math.abs(targetWeight - currentWeight);
  return Math.ceil(remainingChange / weeklyRate);
}

export function calculateProgress(
  startWeight: number,
  currentWeight: number,
  targetWeight: number
): number {
  const totalChange = Math.abs(targetWeight - startWeight);
  if (totalChange === 0) return 100;

  const currentChange = Math.abs(currentWeight - startWeight);
  return Math.min(100, Math.round((currentChange / totalChange) * 100));
}
