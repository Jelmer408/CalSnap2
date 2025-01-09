import { motion } from 'framer-motion';

interface Props {
  value: 'week' | 'month' | 'year';
  onChange: (range: 'week' | 'month' | 'year') => void;
}

export function DateRangeSelector({ value, onChange }: Props) {
  return (
    <div className="flex space-x-2">
      {(['week', 'month', 'year'] as const).map((range) => (
        <motion.button
          key={range}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(range)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            value === range
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          {range.charAt(0).toUpperCase() + range.slice(1)}
        </motion.button>
      ))}
    </div>
  );
}
