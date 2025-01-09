import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, ArrowDown } from 'lucide-react';
import { MealItem } from '../../../types/mealPlan';
import { TagInput } from '../TagInput';
import { regenerateMeal } from '../../../lib/mealPlan/regenerateMeal';

interface RegenerateMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: MealItem;
  onRegenerate: (newMeal: MealItem) => void;
}

export function RegenerateMealModal({ 
  isOpen, 
  onClose, 
  meal,
  onRegenerate 
}: RegenerateMealModalProps) {
  const [preferences, setPreferences] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegenerate = async () => {
    setIsLoading(true);
    try {
      const newMeal = await regenerateMeal(meal, preferences);
      onRegenerate(newMeal);
      onClose();
    } catch (error) {
      console.error('Failed to regenerate meal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 overflow-y-auto z-50">
            <div className="min-h-full flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-[#1a1f2e] rounded-2xl overflow-hidden shadow-xl">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-white">Regenerate Meal</h2>
                      <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-white font-medium mb-2">Current Meal</h3>
                        <div className="bg-gray-800/50 rounded-xl p-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{meal.emoji}</span>
                            <div>
                              <div className="text-white">{meal.name}</div>
                              <div className="text-sm text-gray-400">{meal.calories} calories</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <TagInput
                          label="Required Ingredients"
                          value={preferences}
                          onChange={setPreferences}
                          placeholder="Type ingredient and press Enter"
                        />
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-400 bg-gray-800/30 rounded-lg py-2">
                          <ArrowDown className="w-4 h-4 animate-bounce" />
                          <span>Press Enter to add each ingredient</span>
                        </div>
                      </div>

                      <button
                        onClick={handleRegenerate}
                        disabled={isLoading}
                        className="w-full bg-blue-500 text-white rounded-xl py-3 font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Generating...</span>
                          </>
                        ) : (
                          <span>Generate New Meal</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
