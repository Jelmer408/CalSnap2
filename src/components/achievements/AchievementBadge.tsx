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
  category,
  isLocked, 
  isNew,
  condition,
  progress: progressFn
}: AchievementBadgeProps) {
  const calorieStore = useCalorieStore();
  const achievementStore = useAchievementStore();
  
  const combineState = { ...calorieStore, ...achievementStore };
  const progressValue = getAchievementProgress(
    { id, icon, name, description, points, category, condition, progress: progressFn }, 
    combineState
  );
  
  // Determine category-specific background styles
  const getCategoryStyles = () => {
    if (isLocked) {
      return 'from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800';
    }
    
    switch (category) {
      case 'beginner':
        return 'from-green-400 to-green-500';
      case 'consistency':
        return 'from-blue-400 to-blue-500';
      case 'goals':
        return 'from-purple-400 to-purple-500';
      case 'variety':
        return 'from-yellow-400 to-yellow-500';
      case 'special':
        return 'from-pink-400 to-pink-500';
      case 'expert':
        return 'from-red-400 to-red-500';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };
  
  // Category badge label
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <motion.div
      initial={isNew ? { scale: 0.8, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg transition-all duration-300",
        isLocked ? "opacity-80 hover:opacity-100" : "hover:shadow-xl hover:-translate-y-1",
        isNew && "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900"
      )}
    >
      <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
        <div className="relative shrink-0 mt-1 sm:mt-0">
          <div className={cn(
            "w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-2xl sm:text-3xl bg-gradient-to-br rounded-xl sm:rounded-2xl",
            getCategoryStyles(),
            !isLocked && "text-white"
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
          <div className="flex flex-wrap items-center justify-between mb-1">
            <h3 className="font-semibold truncate text-sm sm:text-base mr-2">{name}</h3>
            <div className={cn(
              "px-2 sm:px-3 py-0.5 rounded-full text-xs font-medium shrink-0",
              isLocked 
                ? "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400" 
                : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            )}>
              +{points}
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{description}</p>
          
          {isLocked && progressValue > 0 && progressValue < 100 && (
            <div className="mt-2">
              <div className="h-1 sm:h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  className={cn(
                    "h-full rounded-full",
                    progressValue < 25 ? "bg-red-400" :
                    progressValue < 50 ? "bg-orange-400" :
                    progressValue < 75 ? "bg-yellow-400" :
                    "bg-green-400"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressValue}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{Math.round(progressValue)}% complete</p>
            </div>
          )}
          
          <div className="mt-2">
            <span className={cn(
              "inline-block px-2 py-0.5 text-xs rounded-full",
              isLocked ? "bg-gray-100 dark:bg-gray-700 text-gray-500" :
                category === 'beginner' ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300" :
                category === 'consistency' ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" :
                category === 'goals' ? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300" :
                category === 'variety' ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300" :
                category === 'special' ? "bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300" :
                "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300"
            )}>
              {categoryName}
            </span>
          </div>
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
