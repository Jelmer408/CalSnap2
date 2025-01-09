import { motion, AnimatePresence } from 'framer-motion';
import { Toast } from './Toast';
import { ToastData } from '../../../types/toast';

interface ToastContainerProps {
  toasts: ToastData[];
  removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed bottom-28 left-0 right-0 flex flex-col items-center px-4 z-50 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast 
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
