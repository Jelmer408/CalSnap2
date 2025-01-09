import { motion } from 'framer-motion';
import { MealCard } from './MealCard';
import { MealItem } from '../../../types/mealPlan';

interface MealListProps {
  meals: MealItem[];
}

export function MealList({ meals }: MealListProps) {
  return (
    <div className="space-y-4">
      {meals.map((meal, index) => (
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
  );
}
