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

// Service worker intentionally not registered here.
// A kill-switch worker at /sw.js exists solely to unregister the previous
// app-shell service worker for returning visitors; do not re-register it.


createRoot(document.getElementById("root")!).render(<App />);
