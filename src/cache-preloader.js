/**
 * Cache Preloader - Optimizes performance by preloading critical assets
 * Runs after service worker is registered and online
 */

(function initCachePreloader() {
  'use strict';

  const CRITICAL_IMAGES = [
    '/assets/logo_final.png',
    '/assets/hero.png',
    '/assets/lidar.webp',
    '/assets/drone.webp',
    '/assets/saraswathiac_web.webp',
    '/assets/about3.avif',
  ];

  const CRITICAL_VIDEOS = [
    '/assets/hero.mp4',
  ];

  /**
   * Start preloading critical assets
   */
  function preloadAssets() {
    if (!('serviceWorker' in navigator)) return;

    // Only preload on good connections
    if ('connection' in navigator) {
      const conn = navigator.connection;
      if (conn.saveData || conn.effectiveType === '4g' || conn.effectiveType === '3g') {
        // For slower connections, reduce preloading
        if (conn.effectiveType === '3g') return;
      }
    }

    // Preload images
    CRITICAL_IMAGES.forEach((url) => {
      const img = new Image();
      img.src = url;
      // This triggers a fetch request through the service worker
    });

    // Preload videos (use a less aggressive approach)
    if (!navigator.connection?.saveData) {
      CRITICAL_VIDEOS.forEach((url) => {
        const video = document.createElement('video');
        video.preload = 'metadata'; // Just metadata, not full video
        const source = document.createElement('source');
        source.src = url;
        source.type = 'video/mp4';
        video.appendChild(source);
      });
    }
  }

  /**
   * Report cache stats for debugging
   */
  function reportCacheStats() {
    if (!window.__DEBUG__) return;

    caches.keys().then((cacheNames) => {
      Promise.all(cacheNames.map((cacheName) => {
        return caches.open(cacheName).then((cache) => {
          return cache.keys().then((requests) => {
            const stats = requests.reduce((acc, req) => {
              const url = req.url;
              if (url.includes('image')) acc.images++;
              else if (url.includes('video')) acc.videos++;
              else if (url.includes('.js')) acc.scripts++;
              else if (url.includes('.css')) acc.styles++;
              else if (url.includes('.html')) acc.documents++;
              else acc.other++;
              return acc;
            }, { images: 0, videos: 0, scripts: 0, styles: 0, documents: 0, other: 0 });

            console.log(`[Cache] ${cacheName}:`, stats, `(${requests.length} items)`);
          });
        });
      }));
    });
  }

  // Preload on page load
  window.addEventListener('load', () => {
    setTimeout(preloadAssets, 2000); // Wait 2s to avoid blocking
    setTimeout(reportCacheStats, 3000);
  });

  // Also preload if online after being offline
  window.addEventListener('online', () => {
    console.log('[Cache] Online detected, preloading assets...');
    preloadAssets();
  });
})();
