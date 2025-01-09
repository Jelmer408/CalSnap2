import { useState } from 'react';
import { Clock, Utensils, RefreshCw } from 'lucide-react';
import { MealItem } from '../../../types/mealPlan';
import { RegenerateMealModal } from '../regenerate/RegenerateMealModal';

interface MealCardProps {
  meal: MealItem;
  onUpdate?: (updatedMeal: MealItem) => void;
}

export function MealCard({ meal, onUpdate }: MealCardProps) {
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);

  return (
    <>
      <div className="bg-[#1a1f2e]/95 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{meal.emoji || '🍽️'}</span>
            <div className="flex flex-col">
              <span className="text-white text-lg">{meal.timing}</span>
              <span className="text-gray-400 text-sm font-light">{meal.calories} calories</span>
            </div>
          </div>
          {onUpdate && (
            <button 
              onClick={() => setShowRegenerateModal(true)}
              className="p-2 text-blue-400 hover:bg-gray-800/50 rounded-full transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-gray-800/80" />

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="text-white text-xl">{meal.name}</h3>

          {/* Time and Calories */}
          <div className="flex items-center space-x-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{meal.prepTime} min</span>
            <span className="text-gray-600 mx-1">•</span>
            <Utensils className="w-4 h-4" />
            <span>{meal.calories} cal</span>
          </div>

          {/* Ingredients */}
          <div className="flex flex-wrap gap-2">
            {meal.ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-[#2a2f3e]/80 rounded-full text-gray-300"
              >
                {ingredient.amount} {ingredient.unit} {ingredient.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <RegenerateMealModal
        isOpen={showRegenerateModal}
        onClose={() => setShowRegenerateModal(false)}
        meal={meal}
        onRegenerate={onUpdate}
      />
    </>
  );
}
