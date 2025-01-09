import { motion } from 'framer-motion';

interface ProgressBarProps {
  steps: { id: string; title: string }[];
  currentStep: number;
}

export function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-blue-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}
