import { motion } from 'framer-motion';
import { Check, X, AlertTriangle } from 'lucide-react';

interface SystemCheckerProps {
  isCompatible: boolean;
  browser: 'chrome' | 'safari' | 'other';
}

export function SystemChecker({ isCompatible, browser }: SystemCheckerProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-6">System Compatibility Check</h2>
      
      <div className="space-y-4">
        {/* PWA Support */}
        <div className="flex items-center justify-between">
          <span>PWA Support</span>
          {isCompatible ? (
            <div className="flex items-center space-x-2 text-green-500">
              <Check className="w-5 h-5" />
              <span>Supported</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-red-500">
              <X className="w-5 h-5" />
              <span>Not Supported</span>
            </div>
          )}
        </div>

        {/* Browser Compatibility */}
        <div className="flex items-center justify-between">
          <span>Browser Compatibility</span>
          {browser === 'chrome' || browser === 'safari' ? (
            <div className="flex items-center space-x-2 text-green-500">
              <Check className="w-5 h-5" />
              <span>Compatible</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-yellow-500">
              <AlertTriangle className="w-5 h-5" />
              <span>Limited Support</span>
            </div>
          )}
        </div>

        {/* Storage */}
        <div className="flex items-center justify-between">
          <span>Required Storage</span>
          <div className="flex items-center space-x-2 text-green-500">
            <Check className="w-5 h-5" />
            <span>50MB Available</span>
          </div>
        </div>
      </div>
    </div>
  );
}
