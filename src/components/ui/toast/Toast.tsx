import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { ToastData } from '../../../types/toast';

const TOAST_DURATION = 3000;

const toastStyles = {
  success: {
    bg: 'bg-green-500',
    icon: <CheckCircle className="w-5 h-5" />,
  },
  error: {
    bg: 'bg-red-500',
    icon: <AlertCircle className="w-5 h-5" />,
  },
  info: {
    bg: 'bg-blue-500',
    icon: <Info className="w-5 h-5" />,
  },
};

interface ToastProps extends ToastData {
  onClose: () => void;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [onClose]);

  const { bg, icon } = toastStyles[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      className={`${bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 max-w-md mb-2 pointer-events-auto`}
    >
      {icon}
      <span className="flex-1">{message}</span>
      <button 
        onClick={onClose} 
        className="p-1 hover:bg-white/10 rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
