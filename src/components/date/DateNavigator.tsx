import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { useDateStore } from '../../store/dateStore';
import { DatePicker } from './DatePicker';

export function DateNavigator() {
  const { selectedDate, setSelectedDate, goToNextDay, goToPreviousDay } = useDateStore();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between h-10"
    >
      <button
        onClick={goToPreviousDay}
        className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-md transition-colors"
        aria-label="Previous day"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        onClick={() => setIsPickerOpen(true)}
        className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <Calendar className="w-4 h-4" />
        <span className="text-sm font-medium">
          {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEE, MMM d')}
        </span>
      </button>

      <button
        onClick={goToNextDay}
        className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-md transition-colors"
        aria-label="Next day"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <DatePicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        selectedDate={selectedDate}
        onSelect={(date) => {
          setSelectedDate(date);
          setIsPickerOpen(false);
        }}
      />
    </motion.div>
  );
}
