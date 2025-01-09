import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { useFitnessStore } from '../../store/fitnessStore';
import { formatWeight } from '../../lib/utils';
import { useToastContext } from '../../providers/ToastProvider';
import { format } from 'date-fns';

export function WeightGoalSection() {
  const { 
    targetWeight,
    weightUnit,
    getCurrentWeight,
    setTargetWeight,
    addEntry,
    targetDate
  } = useFitnessStore();

  const { showToast } = useToastContext();
  const currentWeight = getCurrentWeight();

  // Local state for input handling
  const [weightInput, setWeightInput] = useState(currentWeight?.toString() || '');
  const [targetInput, setTargetInput] = useState(targetWeight?.toString() || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update local state when store values change
  useEffect(() => {
    if (currentWeight) {
      setWeightInput(currentWeight.toString());
    }
  }, [currentWeight]);

  useEffect(() => {
    if (targetWeight) {
      setTargetInput(targetWeight.toString());
    }
  }, [targetWeight]);

  const handleWeightSubmit = async () => {
    const weight = Number(weightInput);
    if (!weight || weight < 20 || weight > 500) {
      showToast('Please enter a valid weight between 20 and 500', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await addEntry({
        weight,
        date: new Date().toISOString()
      });
      showToast('Weight logged successfully');
    } catch (error) {
      showToast(
        error instanceof Error 
          ? error.message 
          : 'Failed to log weight',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTargetSubmit = async () => {
    const weight = Number(targetInput);
    if (!weight || weight < 20 || weight > 500) {
      showToast('Please enter a valid target weight between 20 and 500', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await setTargetWeight(weight);
      showToast('Weight goal updated successfully');
    } catch (error) {
      showToast(
        error instanceof Error 
          ? error.message 
          : 'Failed to update weight goal',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl p-6 text-white">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-white/10 rounded-xl">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Weight Tracking</h2>
          <p className="text-sm text-blue-100">Log your progress</p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-sm text-blue-100 mb-1">Today's Weight</div>
            <div className="flex items-baseline space-x-2">
              <input
                type="number"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                onBlur={handleWeightSubmit}
                className="w-full bg-transparent text-2xl font-bold focus:outline-none"
                placeholder="0.0"
                min="20"
                max="500"
                step="0.1"
                disabled={isSubmitting}
              />
              <span className="text-sm font-medium">{weightUnit}</span>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-sm text-blue-100 mb-1">Target Weight</div>
            <div className="flex items-baseline space-x-2">
              <input
                type="number"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                onBlur={handleTargetSubmit}
                className="w-full bg-transparent text-2xl font-bold focus:outline-none"
                placeholder="0.0"
                min="20"
                max="500"
                step="0.1"
                disabled={isSubmitting}
              />
              <span className="text-sm font-medium">{weightUnit}</span>
            </div>
          </div>
        </div>

        {targetDate && (
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-sm text-blue-100 mb-1">Target Date</div>
            <div className="text-lg font-medium">
              {format(new Date(targetDate), 'MMM d, yyyy')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
