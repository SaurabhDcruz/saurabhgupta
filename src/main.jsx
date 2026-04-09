import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import './styles/ui.css'

// Silence THREE.Clock deprecation warning (Library internal)
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes?.('THREE.Clock: This module has been deprecated')) return;
  originalWarn(...args);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
