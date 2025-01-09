import { useMemo } from 'react';
import { useFitnessStore } from '../store/fitnessStore';
import { useMilestoneStore } from '../store/milestoneStore';
import { calculateWeeklyRate } from '../lib/fitness/weightAnalysis';
import { isFuture } from 'date-fns';

export function useFitnessProgress() {
  const { 
    entries, 
    targetWeight, 
    goalStartWeight, 
    goalType,
    targetDate 
  } = useFitnessStore();
  const { milestones } = useMilestoneStore();

  return useMemo(() => {
    // Get current weight from latest entry
    const currentWeight = entries[0]?.weight;
    if (!currentWeight || !targetWeight || !goalStartWeight) return null;

    // Calculate weekly rate from actual entries
    const weeklyRate = calculateWeeklyRate(entries);
    const hasEnoughData = entries.length >= 2;

    // Calculate progress percentage
    const totalChange = Math.abs(targetWeight - goalStartWeight);
    const currentChange = Math.abs(currentWeight - goalStartWeight);
    const progressPercentage = totalChange === 0 ? 100 : 
      Math.min(100, Math.round((currentChange / totalChange) * 100));

    // Get upcoming milestones
    const upcomingMilestones = milestones
      .filter(m => !m.achieved_date && isFuture(new Date(m.target_date)))
      .sort((a, b) => new Date(a.target_date).getTime() - new Date(b.target_date).getTime())
      .slice(0, 3);

    return {
      weightToChange: Math.abs(targetWeight - currentWeight),
      progressPercentage,
      isGain: goalType === 'gain',
      weeklyRate: hasEnoughData ? weeklyRate : null,
      estimatedGoalDate: targetDate ? new Date(targetDate) : null,
      startWeight: goalStartWeight,
      upcomingMilestones,
      hasEnoughData
    };
  }, [entries, targetWeight, goalStartWeight, goalType, targetDate, milestones]);
}
