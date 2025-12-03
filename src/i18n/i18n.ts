import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ru from "./locales/ru.json";
// Добавляй сюда новые языки одной строкой

const resources = {
  en: { translation: en },
  ru: { translation: ru },
  // es: { translation: es },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",                    // язык по умолчанию
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;