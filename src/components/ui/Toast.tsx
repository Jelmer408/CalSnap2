import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

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

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [onClose]);

  const { bg, icon } = toastStyles[type];

  return (
    <div className="fixed bottom-28 left-0 right-0 flex justify-center items-center px-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`${bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 max-w-md`}
      >
        {icon}
        <span className="flex-1">{message}</span>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
