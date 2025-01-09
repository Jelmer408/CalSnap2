import { motion } from 'framer-motion';
import { Lock, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getAchievementProgress } from '../../lib/achievementUtils';
import { Achievement } from '../../types/achievements';
import { useCalorieStore } from '../../store/calorieStore';
import { useAchievementStore } from '../../store/achievementStore';

interface AchievementBadgeProps extends Achievement {
  isLocked?: boolean;
  isNew?: boolean;
}

export function AchievementBadge({ 
  id,
  icon, 
  name, 
  description, 
  points, 
  isLocked, 
  isNew,
  condition
}: AchievementBadgeProps) {
  const calorieStore = useCalorieStore();
  const achievementStore = useAchievementStore();
  const progress = getAchievementProgress({ id, icon, name, description, points, condition }, 
    { ...calorieStore, ...achievementStore });

  return (
    <motion.div
      initial={isNew ? { scale: 0.8, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg transition-all duration-300",
        isLocked ? "opacity-75" : "hover:shadow-xl hover:-translate-y-1",
        isNew && "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900"
      )}
    >
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="relative shrink-0">
          <div className={cn(
            "w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-2xl sm:text-3xl bg-gradient-to-br rounded-xl sm:rounded-2xl",
            isLocked 
              ? "from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800" 
              : "from-blue-500 to-blue-600 text-white"
          )}>
            {icon}
          </div>
          {isLocked ? (
            <div className="absolute -bottom-1 -right-1 bg-gray-500/90 rounded-full p-1 sm:p-1.5 backdrop-blur-sm">
              <Lock size={10} className="text-white sm:hidden" />
              <Lock size={12} className="text-white hidden sm:block" />
            </div>
          ) : (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 sm:p-1.5">
              <CheckCircle2 size={10} className="text-white sm:hidden" />
              <CheckCircle2 size={12} className="text-white hidden sm:block" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate text-sm sm:text-base">{name}</h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 sm:line-clamp-1">{description}</p>
          {isLocked && progress > 0 && progress < 100 && (
            <div className="mt-2">
              <div className="h-1 sm:h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-500" 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}% complete</p>
            </div>
          )}
        </div>
        <div className={cn(
          "px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shrink-0",
          isLocked 
            ? "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400" 
            : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
        )}>
          +{points}
        </div>
      </div>
      {isNew && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-0.5 sm:py-1 rounded-full animate-pulse">
          New!
        </div>
      )}
    </motion.div>
  );
}
