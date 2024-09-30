import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './Dashboard.tsx'
import './css/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)