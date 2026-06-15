/** @param {'vi' | 'en'} lang @param {string} [id] */
export function unifiedLangButtonHtml(lang, id = 'btn-unified-lang') {
  return `<button type="button" class="btn btn-sm btn-lang-unified" id="${id}" title="VI / EN">${lang === 'vi' ? 'EN' : 'VI'}</button>`;
}
