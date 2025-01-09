import { motion } from 'framer-motion';
import { Loader2, RefreshCw, Plus, Minus } from 'lucide-react';

interface Props {
  calories: number;
  isCalculating: boolean;
  onCalculate: () => void;
  onAdjust: (amount: number) => void;
  onReset: () => void;
}

export function CalorieCalculator({ calories, isCalculating, onCalculate, onAdjust, onReset }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800/30 backdrop-blur-xl rounded-xl p-4 space-y-4">
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {calories} kcal
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Recommended Daily Calories
        </div>
      </div>

      <div className="flex items-center justify-center space-x-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onAdjust(-50)}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700"
        >
          <Minus className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onCalculate}
          disabled={isCalculating}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500 text-white disabled:opacity-50"
        >
          {isCalculating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <RefreshCw className="w-5 h-5" />
          )}
          <span>Recalculate</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onAdjust(50)}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      <button
        onClick={onReset}
        className="w-full text-sm text-blue-500 dark:text-blue-400"
      >
        Reset to Recommended
      </button>
    </div>
  );
}
