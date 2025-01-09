import { motion } from 'framer-motion';
import { Trophy, Star, Crown } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { ProgressBar } from './ProgressBar';

interface AchievementHeaderProps {
  points: number;
  progress: number;
  unlockedCount: number;
  totalCount: number;
}

export function AchievementHeader({ points, progress, unlockedCount, totalCount }: AchievementHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden"
    >
      <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl p-6 shadow-lg">
        {/* Decorative background effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-16" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl transform -translate-x-16 translate-y-16" />
        
        <div className="relative text-white">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Achievements</h2>
              <p className="text-sm text-blue-100">Track your progress</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <StatsCard
              icon={<Star className="w-5 h-5 text-amber-300" />}
              label="Total Points"
              value={points}
            />
            <StatsCard
              icon={<Crown className="w-5 h-5 text-amber-300" />}
              label="Progress"
              value={`${Math.round(progress)}%`}
            />
          </div>

          <ProgressBar 
            progress={progress}
            label={`${unlockedCount} of ${totalCount} unlocked`}
          />
        </div>
      </div>
    </motion.div>
  );
}
