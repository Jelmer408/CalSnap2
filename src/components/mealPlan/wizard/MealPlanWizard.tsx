import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DietTypeStep } from './steps/DietTypeStep';
import { CookingStyleStep } from './steps/CookingStyleStep';
import { FoodPreferencesStep } from './steps/FoodPreferencesStep';
import { ReviewStep } from './steps/ReviewStep';
import { ProgressBar } from './ProgressBar';

interface MealPlanWizardProps {
  onClose: () => void;
  onComplete: () => void;
}

const STEPS = [
  { 
    id: 'diet', 
    title: 'Diet Type',
    description: 'Choose your preferred diet type'
  },
  { 
    id: 'cooking', 
    title: 'Cooking Style',
    description: 'Select how you prefer to cook'
  },
  { 
    id: 'preferences', 
    title: 'Food Preferences',
    description: 'Add your preferred foods'
  },
  { 
    id: 'review', 
    title: 'Review',
    description: 'Review your preferences'
  }
];

export function MealPlanWizard({ onClose, onComplete }: MealPlanWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    dietType: 'bulk',
    cookingStyle: 'quick',
    foodPreferences: [] as string[]
  });

  const handleBack = () => {
    if (currentStep === 0) {
      onClose();
    } else {
      setCurrentStep(step => step - 1);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" 
        onClick={onClose} 
      />
      <div className="fixed inset-x-0 bottom-0 top-0 z-50 bg-gray-900 sm:bg-transparent sm:inset-auto sm:top-[10vh] sm:left-1/2 sm:-translate-x-1/2 sm:max-w-xl sm:w-full sm:rounded-2xl sm:shadow-xl overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex-shrink-0 p-4 sm:p-6">
            <div className="flex items-center mb-6">
              <button
                onClick={handleBack}
                className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 text-center text-sm text-gray-400">
                Step {currentStep + 1} of {STEPS.length}
              </div>
              <div className="w-9" /> {/* Spacer for alignment */}
            </div>

            <ProgressBar 
              steps={STEPS} 
              currentStep={currentStep} 
            />
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {STEPS[currentStep].title}
              </h2>
              <p className="text-gray-400">
                {STEPS[currentStep].description}
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {currentStep === 0 && (
                  <DietTypeStep
                    value={preferences.dietType}
                    onChange={(type) => setPreferences({ ...preferences, dietType: type })}
                  />
                )}
                {currentStep === 1 && (
                  <CookingStyleStep
                    value={preferences.cookingStyle}
                    onChange={(style) => setPreferences({ ...preferences, cookingStyle: style })}
                  />
                )}
                {currentStep === 2 && (
                  <FoodPreferencesStep
                    preferences={preferences.foodPreferences}
                    onChange={(foods) => setPreferences({ ...preferences, foodPreferences: foods })}
                  />
                )}
                {currentStep === 3 && (
                  <ReviewStep
                    preferences={preferences}
                    onComplete={onComplete}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {currentStep < STEPS.length - 1 && (
            <div className="flex-shrink-0 p-4 pb-20 sm:p-6 sm:pb-6">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentStep(step => step + 1)}
                className="w-full bg-blue-500 text-white rounded-xl py-3 font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Continue</span>
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
