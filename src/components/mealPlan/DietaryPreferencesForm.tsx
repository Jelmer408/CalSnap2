import { DietaryPreferences } from '../../types/mealPlan';
import { PreferenceSelect } from './PreferenceSelect';
import { TagInput } from './TagInput';

interface DietaryPreferencesFormProps {
  preferences: DietaryPreferences;
  onChange: (preferences: DietaryPreferences) => void;
  disabled?: boolean;
}

export function DietaryPreferencesForm({
  preferences,
  onChange,
  disabled
}: DietaryPreferencesFormProps) {
  return (
    <div className="space-y-4">
      <PreferenceSelect
        label="Diet Type"
        value={preferences.dietType}
        onChange={(value) => onChange({ ...preferences, dietType: value })}
        options={[
          { value: 'non-vegetarian', label: 'Non-Vegetarian' },
          { value: 'vegetarian', label: 'Vegetarian' },
          { value: 'vegan', label: 'Vegan' }
        ]}
        disabled={disabled}
      />

      <TagInput
        label="Allergies"
        value={preferences.allergies}
        onChange={(value) => onChange({ ...preferences, allergies: value })}
        placeholder="Add allergy (e.g., nuts, dairy)"
        disabled={disabled}
      />

      <TagInput
        label="Preferred Cuisines"
        value={preferences.cuisinePreferences}
        onChange={(value) => onChange({ ...preferences, cuisinePreferences: value })}
        placeholder="Add cuisine (e.g., Italian, Asian)"
        disabled={disabled}
      />

      <TagInput
        label="Foods to Avoid"
        value={preferences.excludedFoods}
        onChange={(value) => onChange({ ...preferences, excludedFoods: value })}
        placeholder="Add food to avoid"
        disabled={disabled}
      />
    </div>
  );
}
