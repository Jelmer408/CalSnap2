import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  label: string;
}

export function ProgressBar({ progress, label }: ProgressBarProps) {
  return (
    <div className="space-y-2">
      <div className="h-2.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-blue-200 to-white rounded-full"
        />
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-blue-100">{label}</span>
        <span className="font-medium text-white">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
