import { motion } from 'framer-motion';
import { MacroSummary } from './display/MacroSummary';
import { MealCard } from './display/MealCard';
import { DailyMealPlan } from '../../types/mealPlan';

interface MealPlanDisplayProps {
  plan: DailyMealPlan;
}

export function MealPlanDisplay({ plan }: MealPlanDisplayProps) {
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
            <MealCard meal={meal} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
