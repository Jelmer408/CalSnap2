import { motion } from 'framer-motion';
import { Download, AlertCircle } from 'lucide-react';

interface InstallButtonProps {
  isCompatible: boolean;
  browser: 'chrome' | 'safari' | 'other';
  onClick: () => void;
}

export function InstallButton({ isCompatible, browser, onClick }: InstallButtonProps) {
  if (!isCompatible) {
    return (
      <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-500/50 backdrop-blur-sm text-white rounded-xl opacity-50 cursor-not-allowed">
        <AlertCircle className="w-5 h-5" />
        <span>Not Compatible</span>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="inline-flex items-center space-x-3 px-6 py-3 bg-white text-blue-600 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
    >
      <Download className="w-5 h-5" />
      <span>Install CalSnap</span>
      <span className="text-xs px-2 py-0.5 bg-blue-100 rounded-full">Free</span>
    </motion.button>
  );
}
