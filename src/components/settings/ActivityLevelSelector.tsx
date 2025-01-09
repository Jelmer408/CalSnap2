import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very' | 'extreme';

const ACTIVITY_LEVELS = {
  sedentary: { label: 'Sedentary', description: 'Little to no exercise' },
  light: { label: 'Lightly Active', description: '1-3 days/week' },
  moderate: { label: 'Moderately Active', description: '3-5 days/week' },
  very: { label: 'Very Active', description: '6-7 days/week' },
  extreme: { label: 'Extremely Active', description: 'Physical job + training' }
};

interface Props {
  value: ActivityLevel;
  onChange: (level: ActivityLevel) => void;
}

export function ActivityLevelSelector({ value, onChange }: Props) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
      <div className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-800">
        Activity Level
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {(Object.entries(ACTIVITY_LEVELS) as [ActivityLevel, typeof ACTIVITY_LEVELS[keyof typeof ACTIVITY_LEVELS]][]).map(([level, info]) => (
          <button
            key={level}
            onClick={() => onChange(level)}
            className="w-full flex items-center px-4 py-3 bg-white dark:bg-gray-800/30 backdrop-blur-xl"
          >
            <div className="flex-1">
              <div className="text-left text-gray-700 dark:text-gray-200">{info.label}</div>
              <div className="text-left text-sm text-gray-500 dark:text-gray-400">{info.description}</div>
            </div>
            {value === level && (
              <Check className="w-5 h-5 text-blue-500" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
