/**
 * Resolve bilingual field: string | { vi, en }
 * @param {string | { vi?: string, en?: string } | null | undefined} value
 * @param {'vi' | 'en'} lang
 */
export function tx(value, lang) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (lang === 'en' && value.en) return value.en;
  if (value.vi) return value.vi;
  return value.en || '';
}

/**
 * @param {Array<{ label: string, text: string | object, correct: boolean }>} options
 * @param {'vi' | 'en'} lang
 */
export function txOptions(options, lang) {
  return (options || []).map((o) => ({
    label: o.label,
    correct: o.correct,
    text: tx(o.text, lang),
  }));
}

/**
 * @param {Array<{ label: string, statement: string | object, isTrue: boolean, explanation?: string | object }>} items
 * @param {'vi' | 'en'} lang
 */
export function txSubItems(items, lang) {
  return (items || []).map((s) => ({
    label: s.label,
    isTrue: s.isTrue,
    statement: tx(s.statement, lang),
    explanation: s.explanation ? tx(s.explanation, lang) : undefined,
  }));
}
