export class MealPlanError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'MealPlanError';
  }
}

export class ValidationError extends MealPlanError {
  constructor(message: string, details?: any) {
    super(message, details);
    this.name = 'ValidationError';
  }
}

export class GenerationError extends MealPlanError {
  constructor(message: string, details?: any) {
    super(message, details);
    this.name = 'GenerationError';
  }
}
