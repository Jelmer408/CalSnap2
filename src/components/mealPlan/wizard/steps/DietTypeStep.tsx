interface DietTypeStepProps {
  value: string;
  onChange: (type: string) => void;
}

export function DietTypeStep({ value, onChange }: DietTypeStepProps) {
  const dietTypes = [
    {
      id: 'bulk',
      label: 'Bulk Diet',
      description: 'High-calorie diet focused on muscle gain and weight gain'
    },
    {
      id: 'cut',
      label: 'Cut Diet',
      description: 'Calorie-deficit diet focused on fat loss while preserving muscle'
    }
  ];

  return (
    <div className="grid gap-4">
      {dietTypes.map((diet) => (
        <button
          key={diet.id}
          onClick={() => onChange(diet.id)}
          className={`w-full p-4 rounded-xl text-left transition-colors ${
            value === diet.id
              ? 'bg-blue-500/20 border-2 border-blue-500'
              : 'bg-gray-800/50 border-2 border-transparent hover:border-gray-700'
          }`}
        >
          <div className="font-medium text-white mb-1">{diet.label}</div>
          <div className="text-sm text-gray-400">{diet.description}</div>
        </button>
      ))}
    </div>
  );
}
