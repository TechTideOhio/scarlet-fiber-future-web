import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { validateTokens } from './constants'
import { setupGlobalErrorHandlers } from './lib/errorLogger'

// 🎯 Validate design tokens on startup
validateTokens();

// 🛡️ Setup global error handlers for analytics
setupGlobalErrorHandlers();

// 📱 Register service worker for PWA functionality
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, notify user if needed
              console.log('[SW] New content available, refresh to update');
            }
          });
        }
      });
      
      console.log('[SW] Service worker registered successfully');
    } catch (error) {
      console.error('[SW] Service worker registration failed:', error);
    }
  }
};

// Register SW after page load
window.addEventListener('load', registerServiceWorker);

createRoot(document.getElementById("root")!).render(<App />);
