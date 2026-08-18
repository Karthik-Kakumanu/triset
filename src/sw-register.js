/**
 * Service Worker Registration & Update Manager
 * Handles SW registration, updates, and offline notifications
 */

(function initServiceWorker() {
  // Only register in production or HTTPS
  if (!('serviceWorker' in navigator)) {
    console.log('[SW] Service Workers not supported');
    return;
  }

  // Register service worker
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('[SW] Registration successful:', registration.scope);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute

        // Handle new service worker
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New SW ready, notify user
              showUpdateNotification(registration);
            }
          });
        });
      })
      .catch((error) => {
        console.warn('[SW] Registration failed:', error);
      });
  });

  // Handle offline/online status
  window.addEventListener('online', () => {
    console.log('[APP] Back online');
    showOnlineNotification();
  });

  window.addEventListener('offline', () => {
    console.log('[APP] Now offline - using cached data');
    showOfflineNotification();
  });

  /**
   * Show update notification
   */
  function showUpdateNotification(registration) {
    const notification = document.createElement('div');
    notification.className = 'sw-update-notification';
    notification.innerHTML = `
      <div class="sw-notification-content">
        <p>New version available!</p>
        <button class="btn btn-sm btn-primary" id="sw-update-btn">Update</button>
        <button class="btn btn-sm btn-quiet" id="sw-dismiss-btn">Dismiss</button>
      </div>
    `;

    document.body.appendChild(notification);

    document.getElementById('sw-update-btn').addEventListener('click', () => {
      registration.installing.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    });

    document.getElementById('sw-dismiss-btn').addEventListener('click', () => {
      notification.remove();
    });

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) notification.remove();
    }, 10000);
  }

  /**
   * Show offline notification
   */
  function showOfflineNotification() {
    const notification = document.createElement('div');
    notification.className = 'sw-offline-notification';
    notification.textContent = '📡 You are offline - using cached data';
    notification.setAttribute('role', 'status');
    notification.setAttribute('aria-live', 'polite');
    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) notification.remove();
    }, 5000);
  }

  /**
   * Show online notification
   */
  function showOnlineNotification() {
    const notification = document.createElement('div');
    notification.className = 'sw-online-notification';
    notification.textContent = '✓ Back online!';
    notification.setAttribute('role', 'status');
    notification.setAttribute('aria-live', 'polite');
    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) notification.remove();
    }, 3000);
  }
})();
