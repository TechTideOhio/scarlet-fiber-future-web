
import { useEffect } from 'react';

const ResourcePreloader = () => {
  useEffect(() => {
    // Enhanced resource preloading for performance targets
    const preloadResources = () => {
      // Fonts are bundled via @fontsource (see src/main.tsx). No external font preload needed.

      // Preload critical CSS for immediate paint
      const criticalCSS = document.createElement('link');
      criticalCSS.rel = 'preload';
      criticalCSS.href = '/src/index.css';
      criticalCSS.as = 'style';
      document.head.appendChild(criticalCSS);

      // Prefetch potential next navigation
      const prefetchLink = document.createElement('link');
      prefetchLink.rel = 'prefetch';
      prefetchLink.href = '/api/fiber-data';
      document.head.appendChild(prefetchLink);
    };

    // Critical rendering path optimization
    const optimizeCriticalPath = () => {
      // Minimize layout shifts by setting viewport meta if not present
      if (!document.querySelector('meta[name="viewport"]')) {
        const viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0';
        document.head.appendChild(viewport);
      }
    };

    preloadResources();
    optimizeCriticalPath();

    // Enhanced service worker registration with update handling
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
          
          // Handle service worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker available, could show update notification
                  console.log('New content available, refresh recommended');
                }
              });
            }
          });
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Performance observer for Core Web Vitals tracking
    if ('PerformanceObserver' in window) {
      try {
        // Track Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.startTime);
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

        // Track First Input Delay with proper type checking
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            // Type guard for PerformanceEventTiming
            if ('processingStart' in entry && typeof entry.processingStart === 'number') {
              console.log('FID:', entry.processingStart - entry.startTime);
            }
          });
        });
        fidObserver.observe({ type: 'first-input', buffered: true });

        // Track Cumulative Layout Shift with proper type checking
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach(entry => {
            // Type guard for LayoutShift entries
            if ('hadRecentInput' in entry && 'value' in entry && 
                typeof entry.hadRecentInput === 'boolean' && 
                typeof entry.value === 'number') {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            }
          });
          console.log('CLS:', clsValue);
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (error) {
        console.warn('Performance Observer not fully supported:', error);
      }
    }
  }, []);

  return null;
};

export default ResourcePreloader;
