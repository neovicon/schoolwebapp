import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// @ts-expect-error - no types for fontsource
import '@fontsource/geist-sans';
// @ts-expect-error - no types for fontsource
import '@fontsource/geist-mono';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
