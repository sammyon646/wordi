import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import ru from './locales/ru.json'

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

// Авто по Telegram
if (window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code) {
  i18n.changeLanguage(window.Telegram.WebApp.initDataUnsafe.user.language_code)
}

export default i18n