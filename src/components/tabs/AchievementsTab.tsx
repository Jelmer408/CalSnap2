import { useAchievementStore } from '../../store/achievementStore';
import { AchievementHeader } from '../achievements/AchievementHeader';
import { AchievementBadge } from '../achievements/AchievementBadge';
import { achievements } from '../../data/achievements';
import { WeightGoalSection } from '../fitness/WeightGoalSection';
// @ts-ignore
import { WeightChart } from '../fitness/WeightChart.jsx';
import { FitnessInsights } from '../fitness/FitnessInsights';
import { MilestoneSection } from '../fitness/MilestoneSection';
import { DateRangeSelector } from '../fitness/DateRangeSelector';
import { useFitnessSync } from '../../hooks/useFitnessSync';
import { useState } from 'react';
import { subDays } from 'date-fns';
import { groupAchievementsByCategory, sortAchievementsForDisplay } from '../../lib/achievementUtils';
import { AchievementCategory } from '../../types/achievements';


export function AchievementsTab() {
  const { unlockedAchievements, points } = useAchievementStore();
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year' | 'custom'>('week');
  const [customStartDate, setCustomStartDate] = useState<Date>(subDays(new Date(), 30));
  const [customEndDate, setCustomEndDate] = useState<Date>(new Date());
  const [expandedCategories, setExpandedCategories] = useState<Record<AchievementCategory, boolean>>({
    beginner: true,
    consistency: true,
    goals: true,
    variety: true,
    special: true,
    expert: true
  });
  
  // Sync fitness data
  useFitnessSync();

  const handleCustomDateChange = (start: Date, end: Date) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
  };

  const unlockedIds = new Set(unlockedAchievements.map(a => a.id));
  const totalAchievements = achievements.length;
  const progress = (unlockedAchievements.length / totalAchievements) * 100;
  
  // Group achievements by category
  const achievementsByCategory = groupAchievementsByCategory(
    sortAchievementsForDisplay(achievements, unlockedIds)
  );
  
  // Category display order and titles
  const categoryOrder: AchievementCategory[] = ['beginner', 'consistency', 'goals', 'variety', 'special', 'expert'];
  const categoryTitles: Record<AchievementCategory, string> = {
    beginner: 'Getting Started',
    consistency: 'Consistency',
    goals: 'Goal Achievements',
    variety: 'Food Variety',
    special: 'Special Achievements',
    expert: 'Expert Level'
  };
  
  // Toggle category expansion
  const toggleCategory = (category: AchievementCategory) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className="space-y-6 pb-32">
      {/* Weight Goal Section */}
      <WeightGoalSection />
      
      {/* Weight Tracking Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 pb-0">
          <DateRangeSelector 
            value={dateRange} 
            onChange={setDateRange}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
            onCustomDateChange={handleCustomDateChange}
          />
        </div>
        <WeightChart 
          dateRange={dateRange} 
          customStartDate={customStartDate}
          customEndDate={customEndDate}
        />
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
      <div className="space-y-6">
        {categoryOrder.map(category => (
          <div key={category} className="space-y-3">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleCategory(category)}
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {categoryTitles[category]}
              </h3>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {achievementsByCategory[category]?.filter(a => unlockedIds.has(a.id)).length || 0} / {achievementsByCategory[category]?.length || 0}
                <span className="ml-2">{expandedCategories[category] ? '▼' : '►'}</span>
              </div>
            </div>
            
            {expandedCategories[category] && (
              <div className="space-y-3">
                {achievementsByCategory[category]?.map(achievement => (
                  <AchievementBadge
                    key={achievement.id}
                    {...achievement}
                    isLocked={!unlockedIds.has(achievement.id)}
                    isNew={!!unlockedAchievements.find(a => a.id === achievement.id)?.unlockedAt && 
                           Date.now() - new Date(unlockedAchievements.find(a => a.id === achievement.id)!.unlockedAt!).getTime() < 60000}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
