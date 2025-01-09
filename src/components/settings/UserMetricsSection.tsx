import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export interface UserMetrics {
  weight: number;
  weightUnit: 'kg' | 'lbs';
  height: number;
  heightUnit: 'cm' | 'ft';
  age: number;
  sex: 'male' | 'female' | 'other';
}

interface Props {
  metrics: UserMetrics;
  onChange: (metrics: UserMetrics) => void;
}

export function UserMetricsSection({ metrics, onChange }: Props) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
      <div className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-800">
        Personal Information
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {/* Weight Input */}
        <label className="flex items-center px-4 py-3 bg-white dark:bg-gray-800/30 backdrop-blur-xl">
          <span className="text-gray-700 dark:text-gray-200">Weight</span>
          <div className="ml-auto flex items-center space-x-2">
            <input
              type="number"
              value={metrics.weight}
              onChange={(e) => onChange({ ...metrics, weight: +e.target.value })}
              className="w-16 text-right bg-transparent"
            />
            <select
              value={metrics.weightUnit}
              onChange={(e) => onChange({ ...metrics, weightUnit: e.target.value as 'kg' | 'lbs' })}
              className="bg-transparent text-gray-500 dark:text-gray-400"
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </label>

        {/* Height Input */}
        <label className="flex items-center px-4 py-3 bg-white dark:bg-gray-800/30 backdrop-blur-xl">
          <span className="text-gray-700 dark:text-gray-200">Height</span>
          <div className="ml-auto flex items-center space-x-2">
            <input
              type="number"
              value={metrics.height}
              onChange={(e) => onChange({ ...metrics, height: +e.target.value })}
              className="w-16 text-right bg-transparent"
            />
            <select
              value={metrics.heightUnit}
              onChange={(e) => onChange({ ...metrics, heightUnit: e.target.value as 'cm' | 'ft' })}
              className="bg-transparent text-gray-500 dark:text-gray-400"
            >
              <option value="cm">cm</option>
              <option value="ft">ft</option>
            </select>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </label>

        {/* Age Input */}
        <label className="flex items-center px-4 py-3 bg-white dark:bg-gray-800/30 backdrop-blur-xl">
          <span className="text-gray-700 dark:text-gray-200">Age</span>
          <div className="ml-auto flex items-center space-x-2">
            <input
              type="number"
              value={metrics.age}
              onChange={(e) => onChange({ ...metrics, age: +e.target.value })}
              className="w-16 text-right bg-transparent"
            />
            <span className="text-gray-500 dark:text-gray-400">years</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </label>

        {/* Sex Selection */}
        <label className="flex items-center px-4 py-3 bg-white dark:bg-gray-800/30 backdrop-blur-xl">
          <span className="text-gray-700 dark:text-gray-200">Sex</span>
          <div className="ml-auto flex items-center space-x-2">
            <select
              value={metrics.sex}
              onChange={(e) => onChange({ ...metrics, sex: e.target.value as 'male' | 'female' | 'other' })}
              className="bg-transparent text-gray-500 dark:text-gray-400"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </label>
      </div>
    </div>
  );
}
