import { motion } from 'framer-motion';
import { Check, X, AlertTriangle, Smartphone, Globe, Shield } from 'lucide-react';

interface SystemCheckerProps {
  isCompatible: boolean;
  browser: 'chrome' | 'safari' | 'other';
}

export function SystemChecker({ isCompatible, browser }: SystemCheckerProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Smartphone className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Device Support</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Works on all modern devices</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Globe className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Browser Support</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Chrome and Safari supported</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg md:col-span-2"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <Shield className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Privacy & Security</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your data is securely stored and never shared</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
