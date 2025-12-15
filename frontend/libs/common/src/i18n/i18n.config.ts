import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en, pl, de, hr, hu, it, si } from './translations';

export const resources = {
  en,
  pl,
  de,
  hr,
  hu,
  it,
  si,
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  fallbackLng: 'en',
  defaultNS: 'translations',
  lowerCaseLng: true,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export { i18n };
