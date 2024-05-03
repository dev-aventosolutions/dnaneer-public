import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-xhr-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en', // fallback language
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      // load translation files from /locales folder
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;
