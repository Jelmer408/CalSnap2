import { ChefHat, Clock } from 'lucide-react';

interface DietaryPreferencesStepProps {
  preferences: any;
  onChange: (preferences: any) => void;
}

export function DietaryPreferencesStep({ preferences, onChange }: DietaryPreferencesStepProps) {
  const dietTypes = [
    { id: 'bulk', label: 'Bulk Diet', icon: <ChefHat className="w-5 h-5 text-blue-400" /> },
    { id: 'cut', label: 'Cut Diet', icon: <ChefHat className="w-5 h-5 text-purple-400" /> }
  ];

  const cookingStyles = [
    { id: 'quick', label: 'Quick & Easy', icon: <Clock className="w-5 h-5 text-blue-400" /> },
    { id: 'gourmet', label: 'Gourmet', icon: <ChefHat className="w-5 h-5 text-purple-400" /> }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Diet Type</h2>
        <p className="text-gray-400">Choose your preferred diet type</p>
      </div>

      <div className="grid gap-4">
        {dietTypes.map((diet) => (
          <button
            key={diet.id}
            onClick={() => onChange({ ...preferences, dietType: diet.id })}
            className={`flex items-center space-x-4 p-4 rounded-xl transition-colors ${
              preferences.dietType === diet.id
                ? 'bg-blue-500/20 border-2 border-blue-500'
                : 'bg-gray-800/50 border-2 border-transparent hover:border-gray-700'
            }`}
          >
            <div className="p-2 bg-gray-800 rounded-lg">{diet.icon}</div>
            <div className="flex-1 text-left">
              <div className="font-medium text-white">{diet.label}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-2">Cooking Style</h2>
        <p className="text-gray-400">Select your cooking preference</p>
      </div>

      <div className="grid gap-4">
        {cookingStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => onChange({ ...preferences, cookingStyle: style.id })}
            className={`flex items-center space-x-4 p-4 rounded-xl transition-colors ${
              preferences.cookingStyle === style.id
                ? 'bg-blue-500/20 border-2 border-blue-500'
                : 'bg-gray-800/50 border-2 border-transparent hover:border-gray-700'
            }`}
          >
            <div className="p-2 bg-gray-800 rounded-lg">{style.icon}</div>
            <div className="flex-1 text-left">
              <div className="font-medium text-white">{style.label}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
