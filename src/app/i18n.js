import vi from '../../content/bank/locales/vi.json';
import en from '../../content/bank/locales/en.json';

const catalogs = { vi, en };
let locale = 'en';

export function setLocale(code) {
  locale = catalogs[code] ? code : 'en';
  try {
    localStorage.setItem('mathgamehs_locale', locale);
  } catch {
    /* ignore */
  }
}

export function getLocale() {
  return locale;
}

export function detectLocale() {
  try {
    const saved = localStorage.getItem('mathgamehs_locale');
    if (saved && catalogs[saved]) return saved;
  } catch {
    /* ignore */
  }
  const lang = (navigator.language || 'en').slice(0, 2);
  return catalogs[lang] ? lang : 'en';
}

export function t(key) {
  const table = catalogs[locale] || en;
  return table[key] ?? en[key] ?? key;
}
