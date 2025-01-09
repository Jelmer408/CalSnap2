import { motion } from 'framer-motion';
import { Lock, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { getAchievementProgress } from '../lib/achievementUtils';
import { Achievement } from '../types/achievements';
import { useCalorieStore } from '../store/calorieStore';
import { useAchievementStore } from '../store/achievementStore';

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
        "relative bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg transition-all duration-200",
        isLocked ? "opacity-75" : "hover:shadow-xl hover:-translate-y-0.5",
        isNew && "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900"
      )}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className={cn(
            "text-4xl transition-all duration-200",
            isLocked ? "filter grayscale" : ""
          )}>
            {icon}
          </div>
          {isLocked ? (
            <div className="absolute inset-0 bg-gray-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Lock size={16} className="text-gray-500" />
            </div>
          ) : (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5">
              <CheckCircle2 size={14} className="text-white" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          {isLocked && progress > 0 && progress < 100 && (
            <div className="mt-2">
              <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}% complete</p>
            </div>
          )}
        </div>
        <div className={cn(
          "font-semibold transition-colors",
          isLocked ? "text-gray-400" : "text-blue-500"
        )}>
          +{points}pts
        </div>
      </div>
      {isNew && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
          New!
        </div>
      )}
    </motion.div>
  );
}
