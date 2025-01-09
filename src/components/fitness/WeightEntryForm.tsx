import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useFitnessStore } from '../../store/fitnessStore';
import { useToastContext } from '../../providers/ToastProvider';

export function WeightEntryForm() {
  const [weight, setWeight] = useState('');
  const [note, setNote] = useState('');
  const { addEntry, weightUnit } = useFitnessStore();
  const { showToast } = useToastContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weight) return;

    try {
      addEntry({
        weight: Number(weight),
        date: new Date().toISOString(),
        note: note.trim() || undefined
      });
      
      setWeight('');
      setNote('');
      showToast('Weight entry added successfully');
    } catch (error) {
      showToast('Failed to add weight entry', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-4">
      <h3 className="font-medium">Add Weight Entry</h3>
      
      <div className="space-y-2">
        <label className="block text-sm text-gray-500">
          Weight ({weightUnit})
        </label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          step="0.1"
          className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
          placeholder="Enter your weight"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm text-gray-500">
          Note (optional)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg resize-none"
          placeholder="Add a note about your weight"
          rows={2}
        />
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        type="submit"
        disabled={!weight}
        className="w-full py-2 bg-blue-500 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
      >
        <Plus className="w-4 h-4" />
        <span>Add Entry</span>
      </motion.button>
    </form>
  );
}
