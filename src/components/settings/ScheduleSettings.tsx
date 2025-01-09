import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useScheduleStore } from '../../store/scheduleStore';

export function ScheduleSettings() {
  const { schedule, updateWeekdaySchedule, updateWeekendSchedule } = useScheduleStore();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
      <div className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-800">
        Daily Schedule
      </div>
      
      <div className="p-4 space-y-6">
        {/* Weekday Schedule */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Weekday Schedule</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Start Time</label>
              <input
                type="time"
                value={schedule.weekday.startTime}
                onChange={(e) => updateWeekdaySchedule(e.target.value, schedule.weekday.endTime)}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">End Time</label>
              <input
                type="time"
                value={schedule.weekday.endTime}
                onChange={(e) => updateWeekdaySchedule(schedule.weekday.startTime, e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Weekend Schedule */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Weekend Schedule</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Start Time</label>
              <input
                type="time"
                value={schedule.weekend.startTime}
                onChange={(e) => updateWeekendSchedule(e.target.value, schedule.weekend.endTime)}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">End Time</label>
              <input
                type="time"
                value={schedule.weekend.endTime}
                onChange={(e) => updateWeekendSchedule(schedule.weekend.startTime, e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
