interface PreferenceSelectProps {
  label: string;
  value: string;
  onChange: (value: any) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}

export function PreferenceSelect({
  label,
  value,
  onChange,
  options,
  disabled
}: PreferenceSelectProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
