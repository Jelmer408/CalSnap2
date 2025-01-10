import { useEffect } from 'react';
import { useToastContext } from '../providers/ToastProvider';

export function usePWAUpdater() {
  const { showToast } = useToastContext();

  useEffect(() => {
    const checkForUpdates = async () => {
      if ('serviceWorker' in navigator) {
        try {
          // Get the registration
          const registration = await navigator.serviceWorker.ready;

          // Check if there's an update
          const checkUpdate = async () => {
            try {
              await registration.update();
              
              // Check version with service worker
              const messageChannel = new MessageChannel();
              registration.active?.postMessage(
                { type: 'CHECK_VERSION' },
                [messageChannel.port2]
              );

              messageChannel.port1.onmessage = (event) => {
                if (event.data.type === 'VERSION' && event.data.version !== '1.0.1') {
                  showToast('A new version is available. Please refresh to update.', 'info');
                }
              };
            } catch (error) {
              console.error('Error checking for updates:', error);
            }
          };

          // Check for updates immediately and then every 30 minutes
          checkUpdate();
          setInterval(checkUpdate, 30 * 60 * 1000);

          // Listen for the controlling service worker changing
          let refreshing = false;
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
              refreshing = true;
              window.location.reload();
            }
          });
        } catch (error) {
          console.error('Error setting up service worker:', error);
        }
      }
    };

    checkForUpdates();
  }, [showToast]);
}
