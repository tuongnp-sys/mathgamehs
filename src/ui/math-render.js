import katex from 'katex';

export function renderMath(text) {
  if (!text) return '';
  const parts = String(text).split(/(\$\$[\s\S]+?\$\$|\$[^$]+\$)/g);
  return parts
    .map((part) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        try {
          return katex.renderToString(part.slice(2, -2), { displayMode: true, throwOnError: false });
        } catch {
          return part;
        }
      }
      if (part.startsWith('$') && part.endsWith('$')) {
        try {
          return katex.renderToString(part.slice(1, -1), { displayMode: false, throwOnError: false });
        } catch {
          return part;
        }
      }
      return escapeHtml(part);
    })
    .join('');
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function mathHtml(text) {
  return `<span class="math-content">${renderMath(text)}</span>`;
}
