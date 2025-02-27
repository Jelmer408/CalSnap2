import { useState } from 'react';
import { WeightGoalSection } from '../fitness/WeightGoalSection';
// @ts-ignore
import { WeightChart } from '../fitness/WeightChart.jsx';
import { WeightEntryForm } from '../fitness/WeightEntryForm';
import { FitnessInsights } from '../fitness/FitnessInsights';
import { FitnessHeader } from '../fitness/FitnessHeader';
import { DateRangeSelector } from '../fitness/DateRangeSelector';
import { useFitnessStore } from '../../store/fitnessStore';
import { subDays } from 'date-fns';

export function FitnessTab() {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year' | 'custom'>('week');
  const [customStartDate, setCustomStartDate] = useState<Date>(subDays(new Date(), 30));
  const [customEndDate, setCustomEndDate] = useState<Date>(new Date());
  const { currentWeight, targetWeight, targetDate } = useFitnessStore();

  const handleCustomDateChange = (start: Date, end: Date) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
  };

  return (
    <div className="space-y-6 pb-24">
      <FitnessHeader />
      
      <WeightGoalSection />
      
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

      <div className="grid gap-4 sm:grid-cols-2">
        <WeightEntryForm />
        <FitnessInsights />
      </div>
    </div>
  );
}
