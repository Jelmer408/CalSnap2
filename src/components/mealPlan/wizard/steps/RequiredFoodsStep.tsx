import { TagInput } from '../../TagInput';

interface RequiredFoodsStepProps {
  preferences: any;
  onChange: (preferences: any) => void;
}

export function RequiredFoodsStep({ preferences, onChange }: RequiredFoodsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Required Foods</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Add any specific foods you want included in your meal plan
        </p>
      </div>

      <TagInput
        label="Foods to Include"
        value={preferences.requiredFoods}
        onChange={(foods) => onChange({ ...preferences, requiredFoods: foods })}
        placeholder="Add food (e.g., chicken, rice)"
      />

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p className="text-sm text-blue-600 dark:text-blue-400">
          Tip: Add foods you already have or want to use in your meals
        </p>
      </div>
    </div>
  );
}
