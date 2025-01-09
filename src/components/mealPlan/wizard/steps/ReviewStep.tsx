import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Clock, Loader2 } from 'lucide-react';
import { generatePlan } from '../../../../lib/mealPlan/generators/planGenerator';
import { useCalorieStore } from '../../../../store/calorieStore';
import { useMealPlanStore } from '../../../../store/mealPlanStore';
import { useToastContext } from '../../../../providers/ToastProvider';

interface ReviewStepProps {
  preferences: {
    dietType: string;
    cookingStyle: string;
    foodPreferences: string[];
  };
  onComplete: () => void;
}

export function ReviewStep({ preferences, onComplete }: ReviewStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { dailyGoal } = useCalorieStore();
  const { addPlan } = useMealPlanStore();
  const { showToast } = useToastContext();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const plan = await generatePlan(dailyGoal, preferences);
      addPlan(plan);
      showToast('Meal plan generated successfully!');
      onComplete();
    } catch (error) {
      showToast('Failed to generate meal plan', 'error');
      console.error('Error generating meal plan:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gray-800 rounded-lg">
              <ChefHat className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Diet Type</div>
              <div className="text-white font-medium capitalize">{preferences.dietType}</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gray-800 rounded-lg">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Cooking Style</div>
              <div className="text-white font-medium capitalize">
                {preferences.cookingStyle === 'quick' ? 'Quick & Easy' : 'Gourmet'}
              </div>
            </div>
          </div>
        </div>

        {preferences.foodPreferences.length > 0 && (
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-2">Food Preferences</div>
            <div className="flex flex-wrap gap-2">
              {preferences.foodPreferences.map((food) => (
                <span
                  key={food}
                  className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
                >
                  {food}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full bg-blue-500 text-white rounded-xl py-4 font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating Plan...</span>
          </>
        ) : (
          <>
            <ChefHat className="w-5 h-5" />
            <span>Generate Meal Plan</span>
          </>
        )}
      </button>
    </div>
  );
}
