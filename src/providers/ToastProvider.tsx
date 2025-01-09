import { createContext, useContext, ReactNode } from 'react';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/toast/ToastContainer';

const ToastContext = createContext<ReturnType<typeof useToast> | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer 
        toasts={toast.toasts}
        removeToast={toast.removeToast}
      />
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}
