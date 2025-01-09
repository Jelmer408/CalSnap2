import { motion } from 'framer-motion';
import { MacroSummary } from './MacroSummary';
import { MealCard } from './MealCard';
import { DailyMealPlan, MealItem } from '../../../types/mealPlan';
import { useMealPlanStore } from '../../../store/mealPlanStore';

interface MealPlanDisplayProps {
  plan: DailyMealPlan;
}

export function MealPlanDisplay({ plan }: MealPlanDisplayProps) {
  const { addPlan } = useMealPlanStore();

  const handleMealUpdate = (updatedMeal: MealItem) => {
    const updatedMeals = plan.meals.map(meal => 
      meal.type === updatedMeal.type ? updatedMeal : meal
    );

    const updatedPlan = {
      ...plan,
      meals: updatedMeals,
      totalMacros: updatedMeals.reduce(
        (total, meal) => ({
          protein: total.protein + meal.macros.protein,
          carbs: total.carbs + meal.macros.carbs,
          fat: total.fat + meal.macros.fat
        }),
        { protein: 0, carbs: 0, fat: 0 }
      )
    };

    addPlan(updatedPlan);
  };

  return (
    <div className="space-y-6">
      <MacroSummary 
        calories={plan.totalCalories}
        macros={plan.totalMacros}
      />
      
      <div className="space-y-4">
        {plan.meals.map((meal, index) => (
          <motion.div
            key={`${meal.type}-${meal.timing}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MealCard 
              meal={meal}
              onUpdate={handleMealUpdate}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
