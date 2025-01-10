import { useState, useEffect } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { useToastContext } from '../../providers/ToastProvider';

export function UserMetricsSection() {
  const { metrics, updateMetrics, syncWithSupabase } = useSettingsStore();
  const { showToast } = useToastContext();
  const [loading, setLoading] = useState(true);

  // Local state to handle input values
  const [localMetrics, setLocalMetrics] = useState({
    weight: metrics.weight ? metrics.weight.toString() : '',
    height: metrics.height ? metrics.height.toString() : '',
    age: metrics.age ? metrics.age.toString() : ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await syncWithSupabase();
        setLocalMetrics({
          weight: metrics.weight ? metrics.weight.toString() : '',
          height: metrics.height ? metrics.height.toString() : '',
          age: metrics.age ? metrics.age.toString() : ''
        });
      } catch (error) {
        showToast('Failed to fetch user metrics', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [syncWithSupabase, metrics, showToast]);

  // Handle input changes
  const handleInputChange = async (field: keyof typeof localMetrics, value: string) => {
    setLocalMetrics(prev => ({ ...prev, [field]: value }));
    
    // Only update the store if the value is valid
    if (value && !isNaN(Number(value))) {
      try {
        await updateMetrics({ [field]: Number(value) });
      } catch (error) {
        showToast('Failed to update metric', 'error');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
      <div className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-800">
        Personal Information
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {/* Weight Input */}
        <label className="flex items-center px-4 py-3 bg-white dark:bg-gray-800/30 backdrop-blur-xl">
          <span className="text-gray-700 dark:text-gray-200">Weight</span>
          <div className="ml-auto flex items-center space-x-2">
            <input
              type="number"
              inputMode="decimal"
              value={localMetrics.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              className="w-20 text-right bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1"
              placeholder="0"
            />
            <select
              value={metrics.weightUnit}
              onChange={(e) => updateMetrics({ weightUnit: e.target.value as 'kg' | 'lbs' })}
              className="bg-transparent text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </label>

        {/* Height Input */}
        <label className="flex items-center px-4 py-3 bg-white dark:bg-gray-800/30 backdrop-blur-xl">
          <span className="text-gray-700 dark:text-gray-200">Height</span>
          <div className="ml-auto flex items-center space-x-2">
            <input
              type="number"
              inputMode="decimal"
              value={localMetrics.height}
              onChange={(e) => handleInputChange('height', e.target.value)}
              className="w-20 text-right bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1"
              placeholder="0"
            />
            <select
              value={metrics.heightUnit}
              onChange={(e) => updateMetrics({ heightUnit: e.target.value as 'cm' | 'ft' })}
              className="bg-transparent text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
            >
              <option value="cm">cm</option>
              <option value="ft">ft</option>
            </select>
          </div>
        </label>

        {/* Age Input */}
        <label className="flex items-center px-4 py-3 bg-white dark:bg-gray-800/30 backdrop-blur-xl">
          <span className="text-gray-700 dark:text-gray-200">Age</span>
          <div className="ml-auto flex items-center space-x-2">
            <input
              type="number"
              inputMode="numeric"
              value={localMetrics.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              className="w-20 text-right bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1"
              placeholder="0"
            />
            <span className="text-gray-500 dark:text-gray-400">years</span>
          </div>
        </label>

        {/* Sex Selection */}
        <label className="flex items-center px-4 py-3 bg-white dark:bg-gray-800/30 backdrop-blur-xl">
          <span className="text-gray-700 dark:text-gray-200">Sex</span>
          <div className="ml-auto">
            <select
              value={metrics.sex}
              onChange={(e) => updateMetrics({ sex: e.target.value as 'male' | 'female' | 'other' })}
              className="bg-transparent text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </label>
      </div>
    </div>
  );
}
