import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { format, differenceInDays, subDays, subMonths, subYears, isAfter } from 'date-fns';
import { Calendar, Info, ChevronDown } from 'lucide-react';
import { DatePicker } from '../date/DatePicker';

interface Props {
  value: 'week' | 'month' | 'year' | 'custom';
  onChange: (range: 'week' | 'month' | 'year' | 'custom') => void;
  customStartDate?: Date;
  customEndDate?: Date;
  onCustomDateChange?: (startDate: Date, endDate: Date) => void;
}

export function DateRangeSelector({ 
  value, 
  onChange, 
  customStartDate, 
  customEndDate, 
  onCustomDateChange 
}: Props) {
  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);
  const [isPresetMenuOpen, setIsPresetMenuOpen] = useState(false);
  const presetMenuRef = useRef<HTMLDivElement>(null);

  // Format dates for display
  const formattedStartDate = customStartDate ? format(customStartDate, 'MMM d, yyyy') : '';
  const formattedEndDate = customEndDate ? format(customEndDate, 'MMM d, yyyy') : '';
  
  // Calculate days between dates for display
  const daysBetween = customStartDate && customEndDate 
    ? Math.abs(differenceInDays(customEndDate, customStartDate)) + 1 
    : 0;
  
  // Check if dates are in the wrong order
  const datesInWrongOrder = customStartDate && customEndDate && isAfter(customStartDate, customEndDate);
  
  // Handle clicks outside the preset menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (presetMenuRef.current && !presetMenuRef.current.contains(event.target as Node)) {
        setIsPresetMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle date selection
  const handleStartDateSelect = (date: Date) => {
    if (onCustomDateChange && customEndDate) {
      // If selected start date is after end date, adjust end date
      if (isAfter(date, customEndDate)) {
        onCustomDateChange(date, date);
      } else {
        onCustomDateChange(date, customEndDate);
      }
    }
    setIsStartDatePickerOpen(false);
  };
  
  const handleEndDateSelect = (date: Date) => {
    if (onCustomDateChange && customStartDate) {
      // If selected end date is before start date, adjust start date
      if (isAfter(customStartDate, date)) {
        onCustomDateChange(date, date);
      } else {
        onCustomDateChange(customStartDate, date);
      }
    }
    setIsEndDatePickerOpen(false);
  };
  
  // Preset date ranges
  const applyPreset = (preset: string) => {
    const today = new Date();
    let start: Date;
    let end = today;
    
    switch (preset) {
      case 'last7days':
        start = subDays(today, 6);
        break;
      case 'last30days':
        start = subDays(today, 29);
        break;
      case 'last90days':
        start = subDays(today, 89);
        break;
      case 'last6months':
        start = subMonths(today, 6);
        break;
      case 'last1year':
        start = subYears(today, 1);
        break;
      default:
        start = subDays(today, 6);
    }
    
    if (onCustomDateChange) {
      onCustomDateChange(start, end);
    }
    
    setIsPresetMenuOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(['week', 'month', 'year', 'custom'] as const).map((range) => (
          <motion.button
            key={range}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onChange(range);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              value === range
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            {range === 'custom' ? 'Custom' : range.charAt(0).toUpperCase() + range.slice(1)}
          </motion.button>
        ))}
      </div>
      
      {value === 'custom' && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsStartDatePickerOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm w-full"
              >
                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 truncate">
                  {formattedStartDate || 'Select start date'}
                </span>
              </button>
            </div>
            
            <span className="text-gray-500 dark:text-gray-400 hidden sm:inline">to</span>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsEndDatePickerOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm w-full"
              >
                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 truncate">
                  {formattedEndDate || 'Select end date'}
                </span>
              </button>
            </div>
            
            <div className="relative" ref={presetMenuRef}>
              <button
                onClick={() => setIsPresetMenuOpen(!isPresetMenuOpen)}
                className="flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm"
              >
                <span className="text-gray-700 dark:text-gray-300">Presets</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isPresetMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isPresetMenuOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 py-1">
                  <button 
                    onClick={() => applyPreset('last7days')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Last 7 days
                  </button>
                  <button 
                    onClick={() => applyPreset('last30days')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Last 30 days
                  </button>
                  <button 
                    onClick={() => applyPreset('last90days')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Last 90 days
                  </button>
                  <button 
                    onClick={() => applyPreset('last6months')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Last 6 months
                  </button>
                  <button 
                    onClick={() => applyPreset('last1year')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Last 1 year
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {customStartDate && customEndDate && (
            <div className={`flex items-center gap-2 text-sm p-2 rounded-lg ${
              datesInWrongOrder 
                ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400' 
                : 'bg-blue-50 dark:bg-blue-900/20 text-gray-500 dark:text-gray-400'
            }`}>
              <Info className={`w-4 h-4 flex-shrink-0 ${datesInWrongOrder ? 'text-red-500' : 'text-blue-500'}`} />
              {datesInWrongOrder ? (
                <span>
                  Warning: Start date is after end date. Please adjust your selection.
                </span>
              ) : (
                <span>
                  Showing data for <span className="font-medium text-gray-700 dark:text-gray-300">{daysBetween} days</span> from {formattedStartDate} to {formattedEndDate}
                </span>
              )}
            </div>
          )}
        </motion.div>
      )}
      
      {/* Date Pickers */}
      <DatePicker
        isOpen={isStartDatePickerOpen}
        onClose={() => setIsStartDatePickerOpen(false)}
        selectedDate={customStartDate || new Date()}
        onSelect={handleStartDateSelect}
      />
      
      <DatePicker
        isOpen={isEndDatePickerOpen}
        onClose={() => setIsEndDatePickerOpen(false)}
        selectedDate={customEndDate || new Date()}
        onSelect={handleEndDateSelect}
      />
    </div>
  );
}
