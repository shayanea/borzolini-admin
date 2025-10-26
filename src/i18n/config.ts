import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import enComponents from './locales/en/components.json';
import enPages from './locales/en/pages.json';
import enValidation from './locales/en/validation.json';

import frCACommon from './locales/fr-CA/common.json';
import frCAComponents from './locales/fr-CA/components.json';
import frCAPages from './locales/fr-CA/pages.json';
import frCAValidation from './locales/fr-CA/validation.json';

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
      'fr-CA': {
        common: frCACommon,
        validation: frCAValidation,
        pages: frCAPages,
        components: frCAComponents,
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
