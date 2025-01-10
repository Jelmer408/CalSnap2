import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useToastContext } from '../../providers/ToastProvider';
import { InstallButton } from './InstallButton';
import { ScreenshotGallery } from './ScreenshotGallery';
import { InstallDrawer } from '../../components/pwa/InstallDrawer';

export function LandingPage() {
  const [isCompatible, setIsCompatible] = useState(false);
  const [browser, setBrowser] = useState<'chrome' | 'safari' | 'other'>('other');
  const [showInstallDrawer, setShowInstallDrawer] = useState(false);
  const { showToast } = useToastContext();

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('chrome') > -1) {
      setBrowser('chrome');
      setIsCompatible(true);
    } else if (ua.indexOf('safari') > -1) {
      setBrowser('safari');
      setIsCompatible(true);
    }

    if (window.matchMedia('(display-mode: standalone)').matches) {
      showToast('CalSnap is already installed!', 'info');
    }
  }, [showToast]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:3rem_3rem]" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-700/50 to-transparent" />
        
        <div className="relative container mx-auto px-4 pt-16 pb-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mb-6"
            >
              <div className="w-20 h-20 rounded-[1.5rem] bg-white shadow-2xl flex items-center justify-center">
                <img src="/icon.png" alt="CalSnap Icon" className="w-16 h-16" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
            >
              CalSnap
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-3 text-lg text-blue-100 max-w-2xl mx-auto"
            >
              Track your calories effortlessly with AI-powered food recognition
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <InstallButton 
                isCompatible={isCompatible} 
                browser={browser} 
                onClick={() => setShowInstallDrawer(true)} 
              />
              <div className="flex items-center space-x-1 text-blue-100">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <span className="ml-2 text-sm">(2 Reviews)</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Screenshots Section */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <ScreenshotGallery />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <img src="/icon.png" alt="CalSnap" className="w-8 h-8" />
              <span className="text-gray-900 dark:text-white font-medium">CalSnap</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#privacy" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                Privacy Policy
              </a>
              <a href="#terms" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Install Drawer */}
      {showInstallDrawer && (
        <InstallDrawer 
          isVisible={showInstallDrawer} 
          onClose={() => setShowInstallDrawer(false)} 
        />
      )}
    </div>
  );
}
