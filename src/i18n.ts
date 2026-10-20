import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './locales/fr.json';
import en from './locales/en.json';
import enData from './locales/en-data.json';

export const LANGS = ['fr', 'en'] as const;
const KEY = 'cv-lang';
let saved: string | null = null;
try { saved = localStorage.getItem(KEY); } catch { /* storage unavailable: fall back to the browser language */ }

i18n.use(initReactI18next).init({
  resources: { fr: { translation: fr }, en: { translation: en, data: enData } },
  lng: LANGS.find(l => l === saved) ?? (navigator.language.startsWith('fr') ? 'fr' : 'en'),
  fallbackLng: 'fr',
  initAsync: false,
  interpolation: { escapeValue: false },
});
document.documentElement.lang = i18n.language;
i18n.on('languageChanged', l => {
  document.documentElement.lang = l;
  try { localStorage.setItem(KEY, l); } catch { /* not persisted */ }
});

/** Data files are written in French; en-data.json maps each French string to its English text. Missing keys show the French. */
export const td = (s: string): string => i18n.t(s, { ns: 'data', keySeparator: false, nsSeparator: false, defaultValue: s });

export default i18n;
