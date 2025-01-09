import { addDays } from 'date-fns';

const SAFE_WEEKLY_RATES = {
  min: 0.25, // kg/week
  max: 1.0   // kg/week
};

/**
 * Calculates a realistic target date based on weight goals
 */
export function calculateTargetDate(
  currentWeight: number,
  targetWeight: number,
  preferredRate: number = 0.5 // Default to 0.5 kg/week
): Date {
  // If maintaining weight, set short timeframe
  if (currentWeight === targetWeight) {
    return addDays(new Date(), 14); // 2 weeks for maintenance
  }

  // Calculate total weight change needed
  const weightChange = Math.abs(targetWeight - currentWeight);
  
  // Ensure rate is within safe limits
  const safeRate = Math.min(
    Math.max(preferredRate, SAFE_WEEKLY_RATES.min),
    SAFE_WEEKLY_RATES.max
  );
  
  // Calculate weeks needed
  const weeksNeeded = weightChange / safeRate;
  
  // Add buffer for realistic progress (20% extra time)
  const bufferedWeeks = Math.ceil(weeksNeeded * 1.2);
  
  // Calculate target date (minimum 2 weeks, maximum 52 weeks)
  const weeks = Math.min(Math.max(bufferedWeeks, 2), 52);
  
  return addDays(new Date(), weeks * 7);
}

/**
 * Validates weight goal parameters
 */
export function validateWeightGoal(
  currentWeight: number,
  targetWeight: number
): { isValid: boolean; error?: string } {
  if (!currentWeight || currentWeight < 20 || currentWeight > 500) {
    return { 
      isValid: false, 
      error: 'Current weight must be between 20 and 500' 
    };
  }

  if (!targetWeight || targetWeight < 20 || targetWeight > 500) {
    return { 
      isValid: false, 
      error: 'Target weight must be between 20 and 500' 
    };
  }

  return { isValid: true };
}
