import { useEffect } from 'react';
import { useToastContext } from '../providers/ToastProvider';

export function usePWAUpdater() {
  const { showToast } = useToastContext();

  useEffect(() => {
    let refreshing = false;

    const handleServiceWorkerUpdate = async () => {
      if ('serviceWorker' in navigator) {
        try {
          // Get the registration
          const registration = await navigator.serviceWorker.ready;

          // Add listener for new service worker installation
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  showToast('A new version is available! Updating...', 'info');
                  
                  // Automatically update after a short delay
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }
              });
            }
          });

          // Check for updates every minute
          const checkForUpdates = async () => {
            try {
              await registration.update();
              
              // Check version with service worker
              const messageChannel = new MessageChannel();
              registration.active?.postMessage(
                { type: 'CHECK_VERSION' },
                [messageChannel.port2]
              );

              messageChannel.port1.onmessage = (event) => {
                if (event.data.type === 'VERSION') {
                  const currentVersion = event.data.version;
                  // Compare with the version in the service worker file
                  fetch('/sw.js')
                    .then(response => response.text())
                    .then(text => {
                      const match = text.match(/SW_VERSION\s*=\s*['"]([^'"]*)['"]/);
                      if (match && match[1] !== currentVersion) {
                        showToast('Updating to the latest version...', 'info');
                        window.location.reload();
                      }
                    });
                }
              };
            } catch (error) {
              console.error('Error checking for updates:', error);
            }
          };

          // Initial check
          checkForUpdates();
          
          // Set up periodic checks
          setInterval(checkForUpdates, 60 * 1000); // Check every minute

          // Listen for the controlling service worker changing
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
              refreshing = true;
              window.location.reload();
            }
          });

          // Listen for messages from the service worker
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data.type === 'SW_ACTIVATED') {
              showToast(`Updated to version ${event.data.version}`, 'success');
            }
          });

        } catch (error) {
          console.error('Error setting up service worker:', error);
        }
      }
    };

    handleServiceWorkerUpdate();

    return () => {
      refreshing = false;
    };
  }, [showToast]);
}
