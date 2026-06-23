import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { validateTokens } from './constants'
import { setupGlobalErrorHandlers } from './lib/errorLogger'

// Editorial type system
import '@fontsource/fraunces/400.css'
import '@fontsource/fraunces/500.css'
import '@fontsource/fraunces/600.css'
import '@fontsource/fraunces/700.css'
import '@fontsource/fraunces/400-italic.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

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

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
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

window.addEventListener('load', registerServiceWorker);

createRoot(document.getElementById("root")!).render(<App />);
