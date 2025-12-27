import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { validateTokens } from './constants'
import { setupGlobalErrorHandlers } from './lib/errorLogger'

// 🎯 Validate design tokens on startup
validateTokens();

// 🛡️ Setup global error handlers for analytics
setupGlobalErrorHandlers();

createRoot(document.getElementById("root")!).render(<App />);
