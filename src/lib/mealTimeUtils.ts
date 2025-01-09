type MealTimeContext = {
  mealType: string;
  timeOfDay: string;
  guidelines: string[];
  inappropriateTerms: string[];
  calorieRange: {
    min: number;
    max: number;
  };
};

export function getMealTimeContext(mealType: string): MealTimeContext {
  switch (mealType) {
    case 'breakfast':
      return {
        mealType: 'breakfast',
        timeOfDay: 'morning (6-10 AM)',
        guidelines: [
          'Must be breakfast-appropriate foods',
          'Include protein for sustained energy',
          'Avoid dinner-style meals',
          'Quick preparation time'
        ],
        inappropriateTerms: [
          'dinner', 'steak', 'curry', 'pasta', 'heavy', 'spicy',
          'burger', 'pizza', 'fried rice', 'casserole'
        ],
        calorieRange: { min: 300, max: 600 }
      };

    case 'morningSnack':
      return {
        mealType: 'morning snack',
        timeOfDay: 'mid-morning (10-11:30 AM)',
        guidelines: [
          'Light and energizing options only',
          'Easy to pack and eat',
          'No heavy meals or complex dishes',
          'Minimal preparation required'
        ],
        inappropriateTerms: [
          'dinner', 'lunch', 'heavy', 'meal', 'complex', 'hot',
          'cooked', 'roasted', 'baked', 'fried'
        ],
        calorieRange: { min: 100, max: 250 }
      };

    case 'lunch':
      return {
        mealType: 'lunch',
        timeOfDay: 'midday (12-2 PM)',
        guidelines: [
          'Appropriate for midday eating',
          'Portable or easy to pack',
          'No breakfast foods',
          'Balanced nutrition'
        ],
        inappropriateTerms: [
          'breakfast', 'cereal', 'pancakes', 'waffles',
          'overnight', 'dessert', 'heavy cream'
        ],
        calorieRange: { min: 400, max: 700 }
      };

    case 'afternoonSnack':
      return {
        mealType: 'afternoon snack',
        timeOfDay: 'afternoon (3-4:30 PM)',
        guidelines: [
          'Light and energizing options',
          'No full meals',
          'Easy to digest',
          'Quick to prepare'
        ],
        inappropriateTerms: [
          'breakfast', 'dinner', 'heavy', 'meal', 'complex',
          'roasted', 'baked', 'fried', 'casserole'
        ],
        calorieRange: { min: 100, max: 250 }
      };

    case 'dinner':
      return {
        mealType: 'dinner',
        timeOfDay: 'evening (6-8 PM)',
        guidelines: [
          'Appropriate dinner foods only',
          'No breakfast items',
          'Complete meal options',
          'Balanced portions'
        ],
        inappropriateTerms: [
          'breakfast', 'cereal', 'pancakes', 'waffles',
          'overnight oats', 'morning', 'brunch'
        ],
        calorieRange: { min: 500, max: 800 }
      };

    case 'eveningSnack':
      return {
        mealType: 'evening snack',
        timeOfDay: 'evening (8-9:30 PM)',
        guidelines: [
          'Light and easy to digest',
          'No heavy meals',
          'No spicy or complex foods',
          'Calming options preferred'
        ],
        inappropriateTerms: [
          'heavy', 'spicy', 'large', 'complex', 'fried',
          'roasted', 'baked', 'meal', 'dinner'
        ],
        calorieRange: { min: 100, max: 200 }
      };

    default:
      return {
        mealType: 'snack',
        timeOfDay: 'anytime',
        guidelines: [
          'Light and balanced options',
          'Easy to prepare',
          'No full meals'
        ],
        inappropriateTerms: [
          'heavy', 'complex', 'time-consuming', 'meal',
          'dinner', 'roasted', 'baked'
        ],
        calorieRange: { min: 100, max: 250 }
      };
  }
}
