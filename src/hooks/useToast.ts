import { useState, useCallback } from 'react';
import { ToastData, ToastType } from '../types/toast';

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const newToast: ToastData = {
      id: crypto.randomUUID(),
      message,
      type,
    };

    setToasts(current => [...current, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(current => current.filter(toast => toast.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
}
