import { storageGet, storageSet } from '../../platform/storage.js';

const KEY = 'content_lang';

/** @returns {'vi' | 'en'} */
export function getContentLang() {
  const v = storageGet(KEY, null);
  if (v === 'en' || v === 'vi') return v;
  return 'vi';
}

/** @param {'vi' | 'en'} lang */
export function setContentLang(lang) {
  storageSet(KEY, lang === 'en' ? 'en' : 'vi');
}
