import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { CalorieEntry } from '../store/calorieStore';
import { MealType, MEAL_TYPES } from '../types/meals';
import { formatCalories } from '../lib/utils';
import { useToastContext } from '../providers/ToastProvider';

interface MealSectionProps {
  mealType: MealType;
  entries: CalorieEntry[];
  onDelete: (id: string) => void;
}

export function MealSection({ mealType, entries, onDelete }: MealSectionProps) {
  const { label, icon } = MEAL_TYPES[mealType];
  const { showToast } = useToastContext();
  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);

  if (entries.length === 0) return null;

  const handleDelete = (id: string, name: string) => {
    try {
      onDelete(id);
      showToast(`Deleted ${name}`, 'success');
    } catch (error) {
      showToast('Failed to delete entry', 'error');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <span className="text-xl">{icon}</span>
          <h3 className="font-medium">{label}</h3>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatCalories(totalCalories)} cal
        </span>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              className="relative"
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12">
                    <span className="text-2xl">{entry.emoji || '🍽️'}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1 truncate">
                      {entry.name}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <div className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          {formatCalories(entry.calories)} cal
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(entry.created_at).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(entry.id, entry.name);
                    }}
                    className="relative z-10 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label={`Delete ${entry.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
