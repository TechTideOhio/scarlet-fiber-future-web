import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { validateTokens } from './constants'

// 🎯 Validate design tokens on startup
validateTokens();

createRoot(document.getElementById("root")!).render(<App />);
