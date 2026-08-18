/**
 * TRISET Service Worker
 * Provides offline functionality, fast caching, and performance optimization
 */

const CACHE_VERSION = 'v1';
const CACHE_NAMES = {
  static: `triset-static-${CACHE_VERSION}`,
  dynamic: `triset-dynamic-${CACHE_VERSION}`,
  images: `triset-images-${CACHE_VERSION}`,
  videos: `triset-videos-${CACHE_VERSION}`,
};

// Core assets to cache immediately
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/services.html',
  '/solutions.html',
  '/projects.html',
  '/careers.html',
  '/contact.html',
  '/styles.css',
  '/premium-system.css',
  '/src/app.js',
  '/src/content.js',
  '/src/sw-register.js',
  '/src/cache-preloader.js',
  '/robots.txt',
  '/sitemap.xml',
];

// Images to preload for better offline UX
const PRELOAD_IMAGES = [
  '/assets/logo_final.png',
  '/assets/hero.png',
];

/**
 * INSTALL EVENT - Pre-cache critical assets
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    Promise.all([
      // Cache critical assets
      caches.open(CACHE_NAMES.static).then((cache) => {
        console.log('[SW] Caching critical assets...');
        return cache.addAll(CRITICAL_ASSETS).catch((error) => {
          console.warn('[SW] Some critical assets failed to cache:', error);
          return Promise.resolve();
        });
      }),
      // Preload common images
      caches.open(CACHE_NAMES.images).then((cache) => {
        console.log('[SW] Preloading images...');
        return Promise.all(
          PRELOAD_IMAGES.map((url) =>
            fetch(url).then((response) => {
              if (response && response.status === 200) {
                cache.put(url, response);
              }
            }).catch(() => {
              // Image fetch failed, continue anyway
            })
          )
        );
      }),
    ]).then(() => {
      console.log('[SW] Installation complete');
      return self.skipWaiting();
    })
  );
});

/**
 * ACTIVATE EVENT - Clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete caches that don't match current version
          if (!Object.values(CACHE_NAMES).includes(cacheName)) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Activation complete');
      return self.clients.claim();
    })
  );
});

/**
 * FETCH EVENT - Smart caching strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Strategy selection based on resource type
  if (isImage(url.pathname)) {
    event.respondWith(cacheImageStrategy(request));
  } else if (isVideo(url.pathname)) {
    event.respondWith(cacheVideoStrategy(request));
  } else if (isDocument(url.pathname)) {
    event.respondWith(cacheDocumentStrategy(request));
  } else if (isScript(url.pathname) || isStyle(url.pathname)) {
    event.respondWith(cacheAssetStrategy(request));
  } else {
    event.respondWith(cacheNetworkStrategy(request));
  }
});

/**
 * CACHE STRATEGIES
 */

// Cache-first with background update: Images (fast loads, update when possible)
function cacheImageStrategy(request) {
  return caches.open(CACHE_NAMES.images).then((cache) => {
    return cache.match(request).then((response) => {
      if (response) {
        // Update cache in background (stale-while-revalidate pattern)
        const fetchPromise = fetch(request).then((freshResponse) => {
          if (freshResponse && freshResponse.status === 200) {
            cache.put(request, freshResponse.clone());
            // Notify clients of update
            self.clients.matchAll().then((clients) => {
              clients.forEach((client) => {
                client.postMessage({
                  type: 'CACHE_UPDATED',
                  url: request.url,
                });
              });
            });
          }
          return freshResponse;
        }).catch(() => null);

        return response;
      }

      // Not in cache, fetch and store
      return fetch(request).then((response) => {
        if (response && response.status === 200) {
          cache.put(request, response.clone());
        }
        return response;
      }).catch(() => {
        // Return placeholder SVG if offline
        return createPlaceholder('image');
      });
    });
  });
}

// Cache-first: Videos (important for offline viewing)
function cacheVideoStrategy(request) {
  return caches.open(CACHE_NAMES.videos).then((cache) => {
    return cache.match(request).then((response) => {
      if (response) {
        return response;
      }

      // Fetch and cache video
      return fetch(request).then((response) => {
        if (response && response.status === 200) {
          cache.put(request, response.clone());
        }
        return response;
      }).catch(() => {
        return new Response('Video not available offline', { status: 503 });
      });
    });
  });
}

// Network-first: HTML documents (fresh content priority with fallback)
function cacheDocumentStrategy(request) {
  return fetch(request)
    .then((response) => {
      // Cache successful response
      if (response && response.status === 200) {
        const clonedResponse = response.clone();
        caches.open(CACHE_NAMES.dynamic).then((cache) => {
          cache.put(request, clonedResponse);
        });
      }
      return response;
    })
    .catch(() => {
      // Network failed, return cached version
      return caches.open(CACHE_NAMES.dynamic)
        .then((cache) => cache.match(request))
        .then((response) => {
          if (response) return response;
          // Return cached home page as fallback
          return caches.match('/index.html').catch(() => null);
        });
    });
}

// Cache-first: CSS, JS (fast load, update rarely)
function cacheAssetStrategy(request) {
  return caches.open(CACHE_NAMES.static).then((cache) => {
    return cache.match(request).then((response) => {
      if (response) {
        return response;
      }

      // Fetch and cache
      return fetch(request).then((response) => {
        if (response && response.status === 200) {
          cache.put(request, response.clone());
        }
        return response;
      }).catch(() => {
        return new Response('/* Resource not available offline */', {
          status: 503,
          headers: { 'Content-Type': 'text/css' },
        });
      });
    });
  });
}

// Network-first: Everything else
function cacheNetworkStrategy(request) {
  return fetch(request)
    .then((response) => {
      // Cache if successful
      if (response && response.status === 200) {
        const clonedResponse = response.clone();
        caches.open(CACHE_NAMES.dynamic).then((cache) => {
          cache.put(request, clonedResponse);
        });
      }
      return response;
    })
    .catch(() => {
      // Return cached if available
      return caches.match(request);
    });
}

/**
 * HELPER FUNCTIONS
 */

function isImage(pathname) {
  return /\.(jpg|jpeg|png|gif|webp|svg|avif|ico)$/i.test(pathname);
}

function isVideo(pathname) {
  return /\.(mp4|webm|ogg|mov|mkv)$/i.test(pathname);
}

function isDocument(pathname) {
  return /\.html$/i.test(pathname) || pathname.endsWith('/');
}

function isScript(pathname) {
  return /\.js$/i.test(pathname);
}

function isStyle(pathname) {
  return /\.css$/i.test(pathname);
}

/**
 * Create placeholder content for offline fallbacks
 */
function createPlaceholder(type) {
  if (type === 'image') {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" stroke-width="0.5"/></pattern></defs><rect width="200" height="200" fill="#f3f4f6"/><rect width="200" height="200" fill="url(#grid)"/><text x="100" y="100" text-anchor="middle" dominant-baseline="middle" fill="#9ca3af" font-size="14" font-family="system-ui">Offline</text></svg>';
    return new Response(svg, {
      headers: { 'Content-Type': 'image/svg+xml' },
    });
  }
  return new Response('Resource not available offline', { status: 503 });
}

/**
 * MESSAGE HANDLING - For cache management
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    clearAllCaches();
  }
});

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map((name) => caches.delete(name)));
  console.log('[SW] All caches cleared');
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: 'CACHE_CLEARED' });
    });
  });
}

