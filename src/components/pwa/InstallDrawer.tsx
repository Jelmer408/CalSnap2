import { motion, AnimatePresence } from 'framer-motion';
import { X, Share, Plus, Globe } from 'lucide-react';

interface InstallDrawerProps {
  isVisible: boolean;
  onClose: () => void;
}

export function InstallDrawer({ isVisible, onClose }: InstallDrawerProps) {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom,24px)]"
      >
        <div className="mx-4 mb-4">
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Install CalSnap</h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {isIOS ? (
                isSafari ? (
                  <div className="space-y-4">
                    <p className="text-gray-300">
                      Install CalSnap on your device for the best experience:
                    </p>
                    <ol className="space-y-3">
                      <li className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-900/30 rounded-full flex items-center justify-center text-blue-400">
                          <Share className="w-5 h-5" />
                        </div>
                        <span className="text-gray-300">Tap the Share button in Safari</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-900/30 rounded-full flex items-center justify-center text-blue-400">
                          <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-gray-300">Select "Add to Home Screen"</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-900/30 rounded-full flex items-center justify-center text-blue-400">
                          <div className="w-5 h-5 flex items-center justify-center font-bold">✓</div>
                        </div>
                        <span className="text-gray-300">Tap "Add" to install CalSnap</span>
                      </li>
                    </ol>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-amber-400">
                      <Globe className="w-5 h-5" />
                      <p>Please open this page in Safari to install the app</p>
                    </div>
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-300">
                    For the best experience on iOS, please visit this page in Safari to install the app.
                  </p>
                  <p className="text-gray-300">
                    On other devices, use Chrome or your default browser's "Add to Home Screen" option.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={onClose}
                className="w-full py-2 text-gray-400 hover:text-gray-200"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
