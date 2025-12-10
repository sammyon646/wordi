export {}

declare global {
  interface TelegramHapticFeedback {
    impactOccurred: (style: 'light' | 'medium' | 'heavy') => void
    notificationOccurred?: (type: 'error' | 'success' | 'warning') => void
    selectionChanged?: () => void
  }

  interface TelegramWebApp {
    ready: () => void
    expand: () => void
    HapticFeedback?: TelegramHapticFeedback
    initDataUnsafe?: {
      user?: { language_code?: string }
    }
  }

  interface Window {
    Telegram?: { WebApp: TelegramWebApp }
  }
}