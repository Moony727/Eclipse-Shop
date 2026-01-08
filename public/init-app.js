// scripts/init-app.js
// Safe initialization script: no inline code, fully CSP-compliant
// Called from layout.tsx via <script src="/init-app.js"></script>

(function initApp() {
  'use strict';

  // Performance: preload critical resources
  function preloadCriticalResources() {
    try {
      // Preconnect to Google Fonts
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = 'https://fonts.gstatic.com';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);

      // Preconnect to Firebase
      const fbLink = document.createElement('link');
      fbLink.rel = 'preconnect';
      fbLink.href = 'https://firebaseapp.com';
      fbLink.crossOrigin = 'anonymous';
      document.head.appendChild(fbLink);
    } catch (e) {
      // Silently fail if preconnect not supported
      console.debug('Preconnect not available', e);
    }
  }

  // Service Worker: register in the background
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js', { scope: '/' })
        .then((registration) => {
          console.debug('Service Worker registered:', registration);
        })
        .catch((error) => {
          // Service Worker registration is optional; don't break the app
          console.debug('Service Worker registration failed:', error);
        });
    }
  }

  // Theme management: restore from localStorage
  function initTheme() {
    try {
      const theme = localStorage.getItem('eclipse-theme');
      if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.debug('Theme init failed', e);
    }
  }

  // Run initialization functions
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function onReady() {
      preloadCriticalResources();
      registerServiceWorker();
      initTheme();
      document.removeEventListener('DOMContentLoaded', onReady);
    });
  } else {
    preloadCriticalResources();
    registerServiceWorker();
    initTheme();
  }
})();
