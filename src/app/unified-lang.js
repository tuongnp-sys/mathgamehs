import { setLocale, getLocale } from './i18n.js';
import { getContentLang, setContentLang } from './content-lang.js';

/** @returns {'vi' | 'en'} */
export function getUnifiedLang() {
  return getContentLang();
}

/** Sync UI locale to match content language on boot */
export function syncUnifiedLang() {
  const lang = getContentLang();
  setLocale(lang);
  setContentLang(lang);
  return lang;
}

/** @returns {'vi' | 'en'} */
export function toggleUnifiedLang() {
  const next = getContentLang() === 'vi' ? 'en' : 'vi';
  setContentLang(next);
  setLocale(next);
  return next;
}

/** @param {'vi' | 'en'} lang */
export function applyUnifiedLang(lang) {
  setContentLang(lang);
  setLocale(lang);
}
