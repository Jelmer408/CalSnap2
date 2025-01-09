export type ToastType = 'success' | 'error' | 'info';

export interface ToastData {
  id: string;
  message: string;
  type: ToastType;
}
