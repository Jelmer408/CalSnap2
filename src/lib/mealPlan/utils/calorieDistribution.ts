export const MEAL_DISTRIBUTION = {
  breakfast: 0.25,      // 25%
  'morning-snack': 0.10, // 10%
  lunch: 0.25,          // 25%
  'afternoon-snack': 0.10, // 10%
  dinner: 0.25,         // 25%
  'evening-snack': 0.05  // 5%
} as const;

export function calculateMealCalories(totalCalories: number) {
  return Object.entries(MEAL_DISTRIBUTION).reduce((acc, [meal, percentage]) => ({
    ...acc,
    [meal]: Math.round(totalCalories * percentage)
  }), {} as Record<keyof typeof MEAL_DISTRIBUTION, number>);
}
