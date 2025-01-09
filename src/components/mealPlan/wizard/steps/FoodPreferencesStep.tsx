import { TagInput } from '../../TagInput';

interface FoodPreferencesStepProps {
  preferences: string[];
  onChange: (foods: string[]) => void;
}

export function FoodPreferencesStep({ preferences = [], onChange }: FoodPreferencesStepProps) {
  return (
    <div className="space-y-6">
      <TagInput
        label="Food Preferences"
        value={preferences}
        onChange={onChange}
        placeholder="Add food (e.g., chicken breast, protein shake)"
      />

      <div className="bg-gray-800/50 rounded-xl p-4">
        <p className="text-sm text-gray-400">
          Tip: Include specific foods or supplements that are part of your diet plan
        </p>
      </div>
    </div>
  );
}
