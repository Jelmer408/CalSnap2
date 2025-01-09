import { MealItem, MealType } from '../../../types/mealPlan';

const VALID_MEAL_TYPES: MealType[] = [
  'breakfast',
  'morning-snack',
  'lunch',
  'afternoon-snack',
  'dinner',
  'evening-snack'
];

const VALID_UNITS = ['g', 'ml', 'tbsp', 'tsp', 'cup'];

interface ValidationError {
  message: string;
  path: string;
}

export function validateJsonStructure(jsonStr: string): boolean {
  try {
    // Step 1: Basic JSON parse
    const data = JSON.parse(jsonStr);

    // Step 2: Validate array structure
    if (!Array.isArray(data)) {
      console.error('Root structure must be an array');
      return false;
    }

    if (data.length !== 6) {
      console.error(`Expected 6 meals, got ${data.length}`);
      return false;
    }

    // Step 3: Validate each meal
    const errors: ValidationError[] = [];
    
    const isValid = data.every((meal: any, index: number) => {
      const mealErrors: ValidationError[] = [];

      // Basic structure checks
      if (typeof meal !== 'object' || meal === null) {
        mealErrors.push({
          message: 'Meal must be an object',
          path: `meals[${index}]`
        });
        return false;
      }

      // Required string fields
      ['name', 'timing', 'type'].forEach(field => {
        if (typeof meal[field] !== 'string' || !meal[field]) {
          mealErrors.push({
            message: `Missing or invalid ${field}`,
            path: `meals[${index}].${field}`
          });
        }
      });

      // Validate meal type
      if (!VALID_MEAL_TYPES.includes(meal.type as MealType)) {
        mealErrors.push({
          message: `Invalid meal type: ${meal.type}`,
          path: `meals[${index}].type`
        });
      }

      // Required number fields
      ['calories', 'prepTime'].forEach(field => {
        if (typeof meal[field] !== 'number' || meal[field] <= 0) {
          mealErrors.push({
            message: `Invalid ${field}`,
            path: `meals[${index}].${field}`
          });
        }
      });

      // Validate macros
      if (!meal.macros || typeof meal.macros !== 'object') {
        mealErrors.push({
          message: 'Missing or invalid macros',
          path: `meals[${index}].macros`
        });
      } else {
        ['protein', 'carbs', 'fat'].forEach(macro => {
          if (typeof meal.macros[macro] !== 'number' || meal.macros[macro] < 0) {
            mealErrors.push({
              message: `Invalid ${macro} in macros`,
              path: `meals[${index}].macros.${macro}`
            });
          }
        });
      }

      // Validate ingredients
      if (!Array.isArray(meal.ingredients) || meal.ingredients.length === 0) {
        mealErrors.push({
          message: 'Missing or invalid ingredients array',
          path: `meals[${index}].ingredients`
        });
      } else {
        meal.ingredients.forEach((ingredient: any, i: number) => {
          if (!ingredient.name || typeof ingredient.name !== 'string') {
            mealErrors.push({
              message: 'Invalid ingredient name',
              path: `meals[${index}].ingredients[${i}].name`
            });
          }
          if (typeof ingredient.amount !== 'number' || ingredient.amount <= 0) {
            mealErrors.push({
              message: 'Invalid ingredient amount',
              path: `meals[${index}].ingredients[${i}].amount`
            });
          }
          if (!VALID_UNITS.includes(ingredient.unit)) {
            mealErrors.push({
              message: 'Invalid ingredient unit',
              path: `meals[${index}].ingredients[${i}].unit`
            });
          }
        });
      }

      if (mealErrors.length > 0) {
        errors.push(...mealErrors);
        return false;
      }

      return true;
    });

    if (!isValid) {
      console.error('Validation errors:', errors);
    }

    return isValid;
  } catch (error) {
    console.error('JSON validation error:', error);
    return false;
  }
}
