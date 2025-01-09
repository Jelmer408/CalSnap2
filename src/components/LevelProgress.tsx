import { motion } from 'framer-motion';
import { useAchievementStore } from '../store/achievementStore';

export function LevelProgress() {
  const { points, level } = useAchievementStore();
  const progress = (points % 100) / 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Level {level}</span>
        <span className="text-sm text-gray-500">{points % 100}/100 XP</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
