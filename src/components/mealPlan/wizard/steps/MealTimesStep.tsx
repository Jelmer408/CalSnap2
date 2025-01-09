interface MealTimesStepProps {
  preferences: any;
  onChange: (preferences: any) => void;
}

export function MealTimesStep({ preferences, onChange }: MealTimesStepProps) {
  const handleTimeChange = (meal: string, time: string) => {
    onChange({
      ...preferences,
      mealTimes: {
        ...preferences.mealTimes,
        [meal]: time
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Meal Times</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Set your preferred meal times
        </p>
      </div>

      <div className="grid gap-4">
        {Object.entries(preferences.mealTimes).map(([meal, time]) => (
          <div key={meal} className="space-y-2">
            <label className="block text-sm font-medium capitalize">
              {meal} Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => handleTimeChange(meal, e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
