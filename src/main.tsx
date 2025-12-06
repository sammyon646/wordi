import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './i18n/i18n'

interface TelegramWebApp {
  ready: () => void
  expand: () => void
  disableVerticalSwipes: () => void
  initDataUnsafe?: { user?: { language_code?: string } }
}

declare global {
  interface Window {
    Telegram?: { WebApp: TelegramWebApp }
  }
}

if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.ready()
  window.Telegram.WebApp.expand()
  window.Telegram.WebApp.disableVerticalSwipes()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)