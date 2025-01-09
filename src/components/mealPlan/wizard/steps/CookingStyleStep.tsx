import { Clock, ChefHat } from 'lucide-react';

interface CookingStyleStepProps {
  value: string;
  onChange: (style: string) => void;
}

export function CookingStyleStep({ value, onChange }: CookingStyleStepProps) {
  const styles = [
    {
      id: 'quick',
      label: 'Quick & Easy',
      description: 'Simple recipes under 30 minutes',
      icon: <Clock className="w-5 h-5 text-blue-400" />
    },
    {
      id: 'gourmet',
      label: 'Gourmet',
      description: 'More complex, restaurant-style meals',
      icon: <ChefHat className="w-5 h-5 text-purple-400" />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => onChange(style.id)}
            className={`flex items-center space-x-4 p-4 rounded-xl transition-colors ${
              value === style.id
                ? 'bg-blue-500/20 border-2 border-blue-500'
                : 'bg-gray-800/50 border-2 border-transparent hover:border-gray-700'
            }`}
          >
            <div className="p-2 bg-gray-800 rounded-lg">{style.icon}</div>
            <div className="flex-1 text-left">
              <div className="font-medium text-white">{style.label}</div>
              <div className="text-sm text-gray-400">{style.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
