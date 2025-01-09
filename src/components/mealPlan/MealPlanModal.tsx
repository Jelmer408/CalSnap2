import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft } from 'lucide-react';
import { MealPlanWizard } from './wizard/MealPlanWizard';

interface MealPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MealPlanModal({ isOpen, onClose }: MealPlanModalProps) {
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
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 sm:inset-auto sm:top-[10vh] sm:left-1/2 sm:-translate-x-1/2 sm:max-w-xl w-full bg-gray-900 rounded-2xl shadow-xl z-50 overflow-y-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-white">Create Meal Plan</h2>
              </div>
              
              <MealPlanWizard onComplete={onClose} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
