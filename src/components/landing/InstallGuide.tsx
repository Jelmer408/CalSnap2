import { motion } from 'framer-motion';
import { Share, Plus, Menu } from 'lucide-react';

interface InstallGuideProps {
  browser: 'chrome' | 'safari' | 'other';
}

export function InstallGuide({ browser }: InstallGuideProps) {
  const iOSSteps = [
    {
      icon: <Share className="w-6 h-6" />,
      title: 'Tap Share',
      description: 'Tap the Share button in Safari'
    },
    {
      icon: <Plus className="w-6 h-6" />,
      title: 'Add to Home Screen',
      description: 'Select "Add to Home Screen" from the share menu'
    },
    {
      icon: <Menu className="w-6 h-6" />,
      title: 'Install',
      description: 'Tap "Add" to install CalSnap on your device'
    }
  ];

  const chromeSteps = [
    {
      icon: <Menu className="w-6 h-6" />,
      title: 'Open Menu',
      description: 'Click the three dots menu in Chrome'
    },
    {
      icon: <Plus className="w-6 h-6" />,
      title: 'Install App',
      description: 'Select "Install CalSnap" from the menu'
    },
    {
      icon: <Menu className="w-6 h-6" />,
      title: 'Confirm',
      description: 'Click "Install" in the popup dialog'
    }
  ];

  const steps = browser === 'safari' ? iOSSteps : chromeSteps;

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-500 mb-4">
            {step.icon}
          </div>
          <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
          <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
