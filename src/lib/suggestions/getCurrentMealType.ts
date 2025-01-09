import { MealType } from '../../types/meals';
import { CalorieEntry } from '../../store/calorieStore';
import { isToday } from 'date-fns';

interface TimeSlot {
  type: MealType;
  start: number;
  end: number;
}

const TIME_SLOTS: TimeSlot[] = [
  { type: 'breakfast', start: 0, end: 11 },
  { type: 'lunch', start: 11, end: 16 },
  { type: 'dinner', start: 16, end: 20 },
  { type: 'snack', start: 20, end: 24 }
];

export function getCurrentMealType(entries: CalorieEntry[]): MealType {
  const hour = new Date().getHours();
  const todayEntries = entries.filter(entry => isToday(new Date(entry.timestamp)));
  
  // Find current time slot
  const currentSlot = TIME_SLOTS.find(slot => hour >= slot.start && hour < slot.end);
  if (!currentSlot) return 'snack';

  // Check if current meal type is already logged
  const hasLoggedCurrentMeal = todayEntries.some(
    entry => entry.mealType === currentSlot.type
  );

  // If current meal is logged, suggest snack until next meal time
  if (hasLoggedCurrentMeal) {
    return 'snack';
  }

  // If previous meals weren't logged when they should have been, suggest snack
  const previousSlots = TIME_SLOTS.filter(slot => slot.end <= hour);
  const missedMainMeals = previousSlots.filter(slot => 
    slot.type !== 'snack' && 
    !todayEntries.some(entry => entry.mealType === slot.type)
  );

  // If we've missed too many main meals, default to snacks
  if (missedMainMeals.length >= 2) {
    return 'snack';
  }

  return currentSlot.type;
}
