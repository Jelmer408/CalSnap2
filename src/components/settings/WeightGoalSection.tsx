import { motion } from 'framer-motion';

export type GoalType = 'lose' | 'maintain' | 'gain';
export type WeightRate = 0.25 | 0.5 | 1;

interface Props {
  goalType: GoalType;
  rate: WeightRate;
  onGoalTypeChange: (type: GoalType) => void;
  onRateChange: (rate: WeightRate) => void;
}

export function WeightGoalSection({ goalType, rate, onGoalTypeChange, onRateChange }: Props) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
      <div className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-800">
        Weight Goal
      </div>
      
      <div className="p-4 bg-white dark:bg-gray-800/30 backdrop-blur-xl">
        <div className="flex justify-between space-x-2 mb-6">
          {(['lose', 'maintain', 'gain'] as GoalType[]).map((type) => (
            <button
              key={type}
              onClick={() => onGoalTypeChange(type)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                goalType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {goalType !== 'maintain' && (
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Rate per week
            </div>
            <div className="space-y-2">
              {([0.25, 0.5, 1] as WeightRate[]).map((value) => (
                <button
                  key={value}
                  onClick={() => onRateChange(value)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg ${
                    rate === value
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <span>{value} kg/week</span>
                  {value === 0.5 && (
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
                      Recommended
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
