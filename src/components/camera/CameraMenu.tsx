import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload } from 'lucide-react';
import { useCamera } from '../../hooks/useCamera';

interface CameraMenuProps {
  isOpen: boolean;
  onClose: () => void;
  disabled?: boolean;
  onCapture: (imageData: string) => Promise<void>;
}

export function CameraMenu({ isOpen, onClose, disabled, onCapture }: CameraMenuProps) {
  const { startCamera, handleFileUpload } = useCamera();

  const handleCameraClick = () => {
    if (disabled) return;
    onClose();
    startCamera();
  };

  const handleUploadClick = async () => {
    if (disabled) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const imageData = await handleFileUpload(file);
          await onCapture(imageData);
          onClose();
        } catch (error) {
          console.error('Error handling file:', error);
        }
      }
    };
    input.click();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute right-2 top-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50 overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <div className="p-1">
              <button
                onClick={handleCameraClick}
                disabled={disabled}
                className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <Camera className="w-4 h-4" />
                <span>Take Photo</span>
              </button>
              <button
                onClick={handleUploadClick}
                disabled={disabled}
                className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Photo</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
