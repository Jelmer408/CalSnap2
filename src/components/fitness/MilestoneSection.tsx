import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Trash2, Calendar } from 'lucide-react';
import { useMilestoneStore } from '../../store/milestoneStore';
import { MILESTONE_CATEGORIES } from '../../lib/supabase/types/fitness';
import { format, isAfter } from 'date-fns';
import { useToastContext } from '../../providers/ToastProvider';
import { DatePicker } from '../date/DatePicker';

export function MilestoneSection() {
  const [isAdding, setIsAdding] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { milestones, addMilestone, deleteMilestone, markAchieved } = useMilestoneStore();
  const { showToast } = useToastContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await addMilestone({
        name: formData.get('name') as string,
        target_value: Number(formData.get('target_value')),
        unit: formData.get('unit') as string,
        target_date: selectedDate.toISOString(),
        category: formData.get('category') as any,
        notes: formData.get('notes') as string || undefined
      });
      setIsAdding(false);
      showToast('Milestone added successfully');
      form.reset();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to add milestone',
        'error'
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMilestone(id);
      showToast('Milestone deleted successfully');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to delete milestone',
        'error'
      );
    }
  };

  const handleAchieve = async (id: string) => {
    try {
      await markAchieved(id);
      showToast('Milestone marked as achieved!', 'success');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to mark milestone as achieved',
        'error'
      );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Fitness Milestones</h3>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Exercise/Goal</label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                placeholder="e.g., Bench Press"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Category</label>
              <select
                name="category"
                required
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
              >
                {Object.entries(MILESTONE_CATEGORIES).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Target Value</label>
              <input
                type="number"
                name="target_value"
                required
                step="0.1"
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Unit</label>
              <select
                name="unit"
                required
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
              >
                {MILESTONE_CATEGORIES.strength.units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Target Date</label>
              <button
                type="button"
                onClick={() => setIsDatePickerOpen(true)}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-left flex items-center justify-between"
              >
                <span>{format(selectedDate, 'MMM d, yyyy')}</span>
                <Calendar className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Notes (optional)</label>
              <input
                type="text"
                name="notes"
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                placeholder="Additional details"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Add Milestone
            </button>
          </div>
        </form>
      )}

      <DatePicker
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        selectedDate={selectedDate}
        onSelect={(date) => {
          setSelectedDate(date);
          setIsDatePickerOpen(false);
        }}
      />

      <div className="space-y-3">
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className={`p-4 rounded-xl border ${
              milestone.achieved_date
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : isAfter(new Date(), new Date(milestone.target_date))
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl">
                    {MILESTONE_CATEGORIES[milestone.category].icon}
                  </span>
                  <h4 className="font-medium">{milestone.name}</h4>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Target: {milestone.target_value} {milestone.unit} by{' '}
                  {format(new Date(milestone.target_date), 'MMM d, yyyy')}
                </div>
                {milestone.notes && (
                  <div className="text-sm text-gray-500 mt-1">{milestone.notes}</div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {!milestone.achieved_date && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAchieve(milestone.id)}
                    className="p-2 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg"
                  >
                    <Check className="w-4 h-4" />
                  </motion.button>
                )}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(milestone.id)}
                  className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        ))}

        {milestones.length === 0 && !isAdding && (
          <div className="text-center text-gray-500 py-4">
            No milestones set. Click the + button to add one.
          </div>
        )}
      </div>
    </div>
  );
}
