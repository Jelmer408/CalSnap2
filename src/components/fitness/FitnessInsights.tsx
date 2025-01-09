import { TrendingUp, TrendingDown, Calendar, Target, Trophy } from 'lucide-react';
import { useFitnessProgress } from '../../hooks/useFitnessProgress';
import { useFitnessStore } from '../../store/fitnessStore';
import { formatWeight } from '../../lib/utils';
import { format } from 'date-fns';

export function FitnessInsights() {
  const { weightUnit } = useFitnessStore();
  const insights = useFitnessProgress();
  
  if (!insights) {
    return (
      <div className="p-4">
        <h3 className="font-medium mb-2">Progress Insights</h3>
        <p className="text-sm text-gray-500">
          Set a weight goal and log your first entry to see insights
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-medium">Progress Insights</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {insights.isGain ? 'Weight to Gain' : 'Weight to Lose'}
          </div>
          <div className="flex items-center space-x-1">
            {insights.isGain ? (
              <TrendingUp className="w-4 h-4 text-blue-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-green-500" />
            )}
            <span className="font-medium">
              {formatWeight(insights.weightToChange, weightUnit)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">Weekly Rate</div>
          <div className="flex items-center space-x-1">
            <Target className="w-4 h-4 text-purple-500" />
            <span className="font-medium">
              {insights.hasEnoughData && insights.weeklyRate
                ? `${formatWeight(insights.weeklyRate, weightUnit)}/week`
                : 'No data'}
            </span>
          </div>
        </div>

        {insights.estimatedGoalDate && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Target Date</div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span className="font-medium">
                {format(insights.estimatedGoalDate, 'MMM d, yyyy')}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium">{insights.progressPercentage}%</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${insights.progressPercentage}%` }}
            />
          </div>
        </div>

        {insights.upcomingMilestones.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Trophy className="w-4 h-4" />
              <span>Upcoming Milestones</span>
            </div>
            {insights.upcomingMilestones.map(milestone => (
              <div key={milestone.id} className="text-sm flex justify-between">
                <span>{milestone.name}</span>
                <span className="text-gray-500">
                  {format(new Date(milestone.target_date), 'MMM d')}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="text-sm text-gray-500">
          Starting weight: {formatWeight(insights.startWeight, weightUnit)}
        </div>
      </div>
    </div>
  );
}
