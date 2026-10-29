import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Offline access must not depend on opting into notifications.
if (import.meta.env.PROD && 'serviceWorker' in navigator && window.isSecureContext) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js', { updateViaCache: 'none' })
    .catch(error => console.warn('Offline setup could not finish. Try again online.', error));
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
