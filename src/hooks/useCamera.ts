import { useState } from 'react';

interface UseCameraResult {
  handleCapture: (file: File) => Promise<string>;
  isProcessing: boolean;
  error: string | null;
}

export function useCamera(): UseCameraResult {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = async (file: File): Promise<string> => {
    setIsProcessing(true);
    setError(null);

    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size should be less than 5MB');
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onloadend = () => {
          const result = reader.result;
          if (typeof result === 'string') {
            // Ensure we're getting a proper base64 string
            if (!result.startsWith('data:image/')) {
              resolve(`data:${file.type};base64,${result.split(',')[1] || result}`);
            } else {
              resolve(result);
            }
          } else {
            reject(new Error('Failed to read image file'));
          }
        };

        reader.onerror = () => {
          reject(new Error('Failed to read image file'));
        };

        reader.readAsDataURL(file);
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process image';
      setError(message);
      throw new Error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleCapture,
    isProcessing,
    error
  };
}
