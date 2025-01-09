import { Mail } from 'lucide-react';

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function EmailInput({ value, onChange }: EmailInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-200">
        Email
      </label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="email"
          name="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white placeholder-gray-400 rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          placeholder="Enter your email"
          required
        />
      </div>
    </div>
  );
}
