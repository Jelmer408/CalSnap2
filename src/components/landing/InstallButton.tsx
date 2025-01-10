import { motion } from 'framer-motion';
import { Download, AlertCircle } from 'lucide-react';

interface InstallButtonProps {
  isCompatible: boolean;
  browser: 'chrome' | 'safari' | 'other';
}

export function InstallButton({ isCompatible, browser }: InstallButtonProps) {
  if (!isCompatible) {
    return (
      <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-xl opacity-50 cursor-not-allowed">
        <AlertCircle className="w-5 h-5" />
        <span>Not Compatible</span>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-medium shadow-lg hover:bg-blue-50 transition-colors"
    >
      <Download className="w-5 h-5" />
      <span>Install CalSnap</span>
    </motion.button>
  );
}
