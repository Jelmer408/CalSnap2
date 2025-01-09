import { useState } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function TagInput({
  label,
  value = [], // Provide default empty array
  onChange,
  placeholder,
  disabled
}: TagInputProps) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (!value.includes(input.trim())) {
        onChange([...value, input.trim()]);
      }
      setInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      
      <div className="space-y-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-3 py-2 bg-gray-800/50 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-blue-900/20 text-blue-400"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                disabled={disabled}
                className="ml-1 p-0.5 hover:bg-blue-800/30 rounded-full disabled:opacity-50"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
