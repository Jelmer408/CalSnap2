import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChefHat } from 'lucide-react';
import { MealPlanDisplay } from '../mealPlan/display/MealPlanDisplay';
import { MealPlanWizard } from '../mealPlan/wizard/MealPlanWizard';
import { useMealPlanStore } from '../../store/mealPlanStore';

export function MealPrepTab() {
  const [showWizard, setShowWizard] = useState(false);
  const { activePlan } = useMealPlanStore();

  return (
    <>
      <div className="space-y-8 pb-24">
        {/* Header Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl p-8">
          {/* Background Effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-16" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl transform -translate-x-16 translate-y-16" />
          
          <div className="relative">
            <div className="flex items-center space-x-3 mb-6">
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

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowWizard(true)}
              className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl py-4 font-medium transition-all duration-200 border border-white/20"
            >
              Create New Plan
            </motion.button>
          </div>
        </div>

        {activePlan ? (
          <MealPlanDisplay plan={activePlan} />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#1a1f2e]/95 backdrop-blur-sm rounded-2xl p-8 text-center"
          >
            <div className="bg-gray-800/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-8 h-8 text-gray-400" />
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
