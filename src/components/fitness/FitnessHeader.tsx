import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

export function FitnessHeader() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl p-6 shadow-lg">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-16" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl transform -translate-x-16 translate-y-16" />
      
      <div className="relative text-white">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Fitness Goals</h2>
            <p className="text-sm text-blue-100">Track your progress</p>
          </div>
        </div>
      </div>
    </div>
  );
}
