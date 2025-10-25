import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import enComponents from './locales/en/components.json';
import enPages from './locales/en/pages.json';
import enValidation from './locales/en/validation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        validation: enValidation,
        pages: enPages,
        components: enComponents,
      },
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'validation', 'pages', 'components'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
