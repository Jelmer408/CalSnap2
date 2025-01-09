import { MealPlanError } from './errors';

export function handleMealPlanError(error: unknown): Error {
  if (error instanceof MealPlanError) {
    return error;
  }

  if (error instanceof Error) {
    return new MealPlanError(error.message);
  }

  return new MealPlanError('An unexpected error occurred while generating the meal plan');
}
