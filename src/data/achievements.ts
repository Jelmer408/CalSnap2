// ... (previous achievements remain the same, removing the specified ones)

// New achievements
export const achievements: Achievement[] = [
  // ... (previous achievements except removed ones)

  // New achievements
  {
    id: 'morning-person',
    name: 'Morning Person',
    description: 'Log breakfast before 8 AM for 5 consecutive days',
    icon: '🌅',
    points: 50,
    condition: (state) => {
      const today = new Date();
      const daysToCheck = Array.from({ length: 5 }, (_, i) => subDays(today, i));
      return daysToCheck.every(date => {
        const dayEntries = getEntriesForDay(state.entries, date);
        return dayEntries.some(entry => 
          entry.mealType === 'breakfast' && 
          new Date(entry.timestamp).getHours() < 8
        );
      });
    }
  },
  {
    id: 'protein-champion',
    name: 'Protein Champion',
    description: 'Log high-protein foods for all meals in a day',
    icon: '💪',
    points: 40,
    condition: (state) => {
      const todayEntries = getTodayEntries(state.entries);
      const highProteinFoods = ['chicken', 'fish', 'eggs', 'beef', 'protein', 'greek yogurt', 'tofu'];
      return todayEntries.length >= 3 && 
        todayEntries.every(entry => 
          highProteinFoods.some(food => 
            entry.name.toLowerCase().includes(food)
          )
        );
    }
  },
  {
    id: 'weekend-warrior',
    name: 'Weekend Warrior',
    description: 'Stay within calorie goal for an entire weekend',
    icon: '🎯',
    points: 60,
    condition: (state) => {
      const today = new Date();
      const isWeekend = today.getDay() === 0 || today.getDay() === 6;
      if (!isWeekend) return false;

      const yesterday = subDays(today, 1);
      const todayEntries = getEntriesForDay(state.entries, today);
      const yesterdayEntries = getEntriesForDay(state.entries, yesterday);

      const todayCalories = todayEntries.reduce((sum, e) => sum + e.calories, 0);
      const yesterdayCalories = yesterdayEntries.reduce((sum, e) => sum + e.calories, 0);

      return todayCalories <= state.dailyGoal && yesterdayCalories <= state.dailyGoal;
    }
  },
  {
    id: 'balanced-diet',
    name: 'Balance Master',
    description: 'Log a perfect mix of proteins, carbs, and vegetables in one meal',
    icon: '🥗',
    points: 30,
    condition: (state) => {
      const todayEntries = getTodayEntries(state.entries);
      const proteins = ['chicken', 'fish', 'meat', 'eggs', 'tofu'];
      const carbs = ['rice', 'pasta', 'bread', 'potato'];
      const veggies = ['salad', 'vegetable', 'broccoli', 'spinach', 'carrot'];

      return todayEntries.some(entry => {
        const name = entry.name.toLowerCase();
        return proteins.some(p => name.includes(p)) &&
               carbs.some(c => name.includes(c)) &&
               veggies.some(v => name.includes(v));
      });
    }
  },
  {
    id: 'global-taste',
    name: 'Global Foodie',
    description: 'Log meals from 5 different cuisines',
    icon: '🌎',
    points: 50,
    condition: (state) => {
      const cuisines = {
        italian: ['pasta', 'pizza', 'risotto'],
        mexican: ['taco', 'burrito', 'quesadilla'],
        japanese: ['sushi', 'ramen', 'miso'],
        indian: ['curry', 'tikka', 'masala'],
        chinese: ['stir fry', 'fried rice', 'dumpling'],
        thai: ['pad thai', 'curry', 'satay']
      };

      const loggedCuisines = new Set();
      state.entries.forEach(entry => {
        const name = entry.name.toLowerCase();
        Object.entries(cuisines).forEach(([cuisine, foods]) => {
          if (foods.some(food => name.includes(food))) {
            loggedCuisines.add(cuisine);
          }
        });
      });

      return loggedCuisines.size >= 5;
    }
  },
  {
    id: 'mindful-snacker',
    name: 'Mindful Snacker',
    description: 'Log only healthy snacks under 200 calories for a week',
    icon: '🍎',
    points: 70,
    condition: (state) => {
      const today = new Date();
      const daysToCheck = Array.from({ length: 7 }, (_, i) => subDays(today, i));
      const healthySnacks = ['fruit', 'nuts', 'yogurt', 'vegetables', 'hummus'];

      return daysToCheck.every(date => {
        const dayEntries = getEntriesForDay(state.entries, date);
        const snacks = dayEntries.filter(e => e.mealType === 'snack');
        return snacks.length > 0 && snacks.every(snack => 
          snack.calories <= 200 && 
          healthySnacks.some(healthy => snack.name.toLowerCase().includes(healthy))
        );
      });
    }
  },
  {
    id: 'meal-prep-pro',
    name: 'Meal Prep Pro',
    description: 'Log pre-planned meals for 5 consecutive days',
    icon: '📝',
    points: 45,
    condition: (state) => {
      const today = new Date();
      const daysToCheck = Array.from({ length: 5 }, (_, i) => subDays(today, i));
      return daysToCheck.every(date => {
        const dayEntries = getEntriesForDay(state.entries, date);
        return dayEntries.length >= 3;
      });
    }
  },
  {
    id: 'portion-master',
    name: 'Portion Master',
    description: 'Maintain consistent portion sizes for a week',
    icon: '⚖️',
    points: 55,
    condition: (state) => {
      const today = new Date();
      const daysToCheck = Array.from({ length: 7 }, (_, i) => subDays(today, i));
      const mealAverages = daysToCheck.map(date => {
        const dayEntries = getEntriesForDay(state.entries, date);
        return dayEntries.reduce((sum, e) => sum + e.calories, 0) / (dayEntries.length || 1);
      });

      const variance = Math.max(...mealAverages) - Math.min(...mealAverages);
      return variance < 100; // Less than 100 calorie variance in average meal size
    }
  },
  {
    id: 'seasonal-eater',
    name: 'Seasonal Eater',
    description: 'Log seasonal foods appropriate for the current month',
    icon: '🍂',
    points: 35,
    condition: (state) => {
      const month = new Date().getMonth();
      const seasonalFoods = {
        winter: ['squash', 'potato', 'citrus', 'kale'],
        spring: ['asparagus', 'peas', 'strawberry', 'spinach'],
        summer: ['tomato', 'corn', 'berry', 'peach'],
        fall: ['pumpkin', 'apple', 'sweet potato', 'brussels sprouts']
      };

      const season = 
        month <= 1 || month === 11 ? 'winter' :
        month <= 4 ? 'spring' :
        month <= 7 ? 'summer' : 'fall';

      const recentEntries = state.entries.slice(-30); // Last 30 entries
      return seasonalFoods[season].some(food =>
        recentEntries.some(entry => 
          entry.name.toLowerCase().includes(food)
        )
      );
    }
  },
  {
    id: 'social-diner',
    name: 'Social Diner',
    description: 'Log restaurant meals while staying within calorie goals',
    icon: '🍽️',
    points: 40,
    condition: (state) => {
      const todayEntries = getTodayEntries(state.entries);
      const restaurantKeywords = ['restaurant', 'café', 'bistro', 'diner'];
      const hasRestaurantMeal = todayEntries.some(entry =>
        restaurantKeywords.some(keyword => 
          entry.name.toLowerCase().includes(keyword)
        )
      );
      const totalCalories = todayEntries.reduce((sum, e) => sum + e.calories, 0);
      return hasRestaurantMeal && totalCalories <= state.dailyGoal;
    }
  }
];
