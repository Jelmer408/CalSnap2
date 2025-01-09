import { useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Loader2 } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageData: string) => void;
  isAnalyzing: boolean;
}

export function CameraModal({ isOpen, onClose, onCapture, isAnalyzing }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  }, []);

  const handleCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        onCapture(imageData);
        stopCamera();
        onClose();
      }
    }
  }, [onCapture, onClose, stopCamera]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        >
          <div className="relative w-full max-w-lg">
            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="absolute -top-12 right-0 text-white p-2"
              disabled={isAnalyzing}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative aspect-[4/3] bg-black rounded-2xl overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                onLoadedMetadata={() => startCamera()}
              />
              <canvas ref={canvasRef} className="hidden" />
              
              <button
                onClick={handleCapture}
                disabled={isAnalyzing}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full p-4 shadow-lg disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-blue-500" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
