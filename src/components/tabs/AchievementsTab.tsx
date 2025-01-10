import { motion } from 'framer-motion';
import { useAchievementStore } from '../../store/achievementStore';
import { AchievementHeader } from '../achievements/AchievementHeader';
import { AchievementBadge } from '../achievements/AchievementBadge';
import { achievements } from '../../data/achievements';
import { WeightGoalSection } from '../fitness/WeightGoalSection';
import { WeightChart } from '../fitness/WeightChart';
import { FitnessInsights } from '../fitness/FitnessInsights';
import { MilestoneSection } from '../fitness/MilestoneSection';
import { DateRangeSelector } from '../fitness/DateRangeSelector';
import { useFitnessSync } from '../../hooks/useFitnessSync';
import { useState } from 'react';

export function AchievementsTab() {
  const { unlockedAchievements, points } = useAchievementStore();
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('week');
  
  // Sync fitness data
  useFitnessSync();

  const unlockedIds = new Set(unlockedAchievements.map(a => a.id));
  const totalAchievements = achievements.length;
  const progress = (unlockedAchievements.length / totalAchievements) * 100;

  return (
    <div className="space-y-6 pb-32">
      {/* Weight Goal Section */}
      <WeightGoalSection />
      
      {/* Weight Tracking Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-4">
        <DateRangeSelector 
          value={dateRange} 
          onChange={setDateRange}
        />
        <WeightChart dateRange={dateRange} />
      </div>

      {/* Progress Insights and Milestones */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 rounded-xl">
          <FitnessInsights />
        </div>
        <MilestoneSection />
      </div>

      {/* Achievements Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl">
        <AchievementHeader 
          points={points}
          progress={progress}
          unlockedCount={unlockedAchievements.length}
          totalCount={totalAchievements}
        />
      </div>

      {/* Achievement Categories */}
      <div className="space-y-4">
        {achievements.map((achievement) => (
          <AchievementBadge
            key={achievement.id}
            {...achievement}
            isLocked={!unlockedIds.has(achievement.id)}
            isNew={unlockedAchievements.find(a => a.id === achievement.id)?.unlockedAt && 
                   Date.now() - new Date(unlockedAchievements.find(a => a.id === achievement.id)!.unlockedAt!).getTime() < 60000}
          />
        ))}
      </div>
    </div>
  );
}
