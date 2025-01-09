import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, FolderOpen } from 'lucide-react';
import { MealPlanDisplay } from './display/MealPlanDisplay';
import { MealPlanWizard } from './wizard/MealPlanWizard';
import { useMealPlanStore } from '../../store/mealPlanStore';

export function MealPlanTab() {
  const [showWizard, setShowWizard] = useState(false);
  const { activePlan } = useMealPlanStore();

  return (
    <>
      <div className="space-y-6 pb-24">
        {/* Header Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Meal Prep</h2>
                <p className="text-sm text-blue-100">
                  Create personalized meal plans tailored to your goals
                </p>
              </div>
            </div>
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
          </div>

          <button
            onClick={() => setShowWizard(true)}
            className="w-full bg-white text-blue-600 rounded-xl py-3 font-medium hover:bg-blue-50 transition-colors"
          >
            Create New Plan
          </button>
        </div>

        {activePlan ? (
          <MealPlanDisplay plan={activePlan} />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center"
          >
            <div className="bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">No Active Meal Plan</h3>
            <p className="text-gray-400">Create your first meal plan to get started</p>
          </motion.div>
        )}
      </div>

      {showWizard && (
        <MealPlanWizard 
          onClose={() => setShowWizard(false)}
          onComplete={() => setShowWizard(false)}
        />
      )}
    </>
  );
}
