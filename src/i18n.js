import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    detection: {
      order: ['navigator', 'localStorage', 'htmlTag', 'cookie', 'path', 'subdomain'],
      lookupNavigator: true,
      caches: ['localStorage'],
      // Custom lookup to only allow 'pt' or 'en', fallback to 'en'
      checkWhitelist: true,
    },
    whitelist: ['en', 'pt'],
    supportedLngs: ['en', 'pt'],
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;