export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealTypeInfo {
  label: string;
  icon: string;
  defaultTime: string;
  calorieRange: {
    min: number;
    max: number;
  };
}

export const MEAL_TYPES: Record<MealType, MealTypeInfo> = {
  breakfast: {
    label: 'Breakfast',
    icon: '🌅',
    defaultTime: '08:00',
    calorieRange: { min: 300, max: 500 }
  },
  lunch: {
    label: 'Lunch',
    icon: '🌞',
    defaultTime: '13:00',
    calorieRange: { min: 400, max: 600 }
  },
  dinner: {
    label: 'Dinner',
    icon: '🌙',
    defaultTime: '19:00',
    calorieRange: { min: 400, max: 700 }
  },
  snack: {
    label: 'Snack',
    icon: '🍎',
    defaultTime: '11:00',
    calorieRange: { min: 100, max: 300 }
  }
};
