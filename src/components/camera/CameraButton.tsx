import { Camera } from 'lucide-react';
import { useCamera } from '../../hooks/useCamera';
import { cn } from '../../lib/utils';

interface CameraButtonProps {
  disabled?: boolean;
  onCapture: (imageData: string) => Promise<void>;
  className?: string;
}

export function CameraButton({ disabled, onCapture, className }: CameraButtonProps) {
  const { handleCapture, isProcessing } = useCamera();

  const handleInput = async () => {
    try {
      // Create file input element
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // Prefer rear camera on mobile
      
      // Handle file selection
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const imageData = await handleCapture(file);
          await onCapture(imageData);
        }
      };

      // Trigger file input
      input.click();
    } catch (error) {
      console.error('Error handling camera input:', error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleInput}
      disabled={disabled || isProcessing}
      className={cn(
        "absolute right-3 top-1/2 -translate-y-1/2 p-2",
        "bg-white/10 hover:bg-white/20 rounded-lg transition-colors",
        "disabled:opacity-50 disabled:hover:bg-white/10",
        "focus:outline-none focus:ring-2 focus:ring-white/20",
        className
      )}
      aria-label="Add food photo"
    >
      <Camera className={cn(
        "w-5 h-5 text-blue-200",
        isProcessing && "animate-pulse"
      )} />
    </button>
  );
}
