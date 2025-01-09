import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Achievement } from '../types/achievements';

interface AchievementModalProps {
  achievement: Achievement;
  onClose: () => void;
}

export function AchievementModal({ achievement, onClose }: AchievementModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full relative"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
          
          <div className="text-center">
            <div className="text-6xl mb-4">{achievement.icon}</div>
            <h2 className="text-xl font-bold mb-2">{achievement.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{achievement.description}</p>
            <div className="text-blue-500 font-bold text-lg">+{achievement.points} points</div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
