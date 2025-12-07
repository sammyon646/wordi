import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// ────────────────── Фикс ошибки TypeScript для Telegram ──────────────────
interface TelegramWebApp {
  ready: () => void
  expand: () => void
  initDataUnsafe?: {
    user?: {
      language_code?: string
    }
  }
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.ready()
  window.Telegram.WebApp.expand()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

interface TelegramHapticFeedback {
  impactOccurred: (style: 'light' | 'medium' | 'heavy') => void
  notificationOccurred?: (type: 'error' | 'success' | 'warning') => void
  selectionChanged?: () => void
}

interface TelegramWebApp {
  ready: () => void
  expand: () => void
  HapticFeedback?: TelegramHapticFeedback
  initDataUnsafe?: { user?: { language_code?: string } }
}

declare global {
  interface Window {
    Telegram?: { WebApp: TelegramWebApp }
  }
}