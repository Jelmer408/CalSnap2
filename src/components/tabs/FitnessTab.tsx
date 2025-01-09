import { useState } from 'react';
import { WeightGoalSection } from '../fitness/WeightGoalSection';
import { WeightChart } from '../fitness/WeightChart';
import { WeightEntryForm } from '../fitness/WeightEntryForm';
import { FitnessInsights } from '../fitness/FitnessInsights';
import { FitnessHeader } from '../fitness/FitnessHeader';
import { DateRangeSelector } from '../fitness/DateRangeSelector';
import { useFitnessStore } from '../../store/fitnessStore';

export function FitnessTab() {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('week');
  const { currentWeight, targetWeight, targetDate } = useFitnessStore();

  return (
    <div className="space-y-6 pb-24">
      <FitnessHeader />
      
      <WeightGoalSection />
      
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-4">
        <DateRangeSelector 
          value={dateRange} 
          onChange={setDateRange}
        />
        <WeightChart dateRange={dateRange} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <WeightEntryForm />
        <FitnessInsights />
      </div>
    </div>
  );
}
