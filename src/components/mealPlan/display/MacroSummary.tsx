import { motion } from 'framer-motion';
import { Flame, Scale, Beef, Cookie } from 'lucide-react';
import { MacroNutrients } from '../../../types/mealPlan';

interface MacroSummaryProps {
  calories: number;
  macros: MacroNutrients;
}

export function MacroSummary({ calories, macros }: MacroSummaryProps) {
  const stats = [
    { label: 'Calories', value: calories, color: 'text-blue-400' },
    { label: 'Protein', value: `${macros.protein}g`, color: 'text-green-400' },
    { label: 'Carbs', value: `${macros.carbs}g`, color: 'text-yellow-400' },
    { label: 'Fat', value: `${macros.fat}g`, color: 'text-purple-400' }
  ];

  return (
    <div className="bg-gray-800/50 rounded-xl p-4">
      <h2 className="text-lg font-medium mb-4">Daily Nutrition</h2>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-gray-800/80 rounded-lg p-4">
            <div className="text-sm text-gray-400">{stat.label}</div>
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
