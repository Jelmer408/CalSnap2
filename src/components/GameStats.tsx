import { Trophy, Zap } from 'lucide-react';
import { useAchievementStore } from '../store/achievementStore';
import { LevelProgress } from './LevelProgress';
import { motion } from 'framer-motion';

export function GameStats() {
  const { streak, points, level } = useAchievementStore();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6"
    >
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
            <Zap className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Current Streak</div>
            <div className="font-semibold">
              {streak.current} day{streak.current !== 1 ? 's' : ''}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500">
              Best: {streak.longest} day{streak.longest !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <Trophy className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Points</div>
            <div className="font-semibold">{points}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500">
              Level {level}
            </div>
          </div>
        </div>
      </div>
      
      <LevelProgress />
    </motion.div>
  );
}
