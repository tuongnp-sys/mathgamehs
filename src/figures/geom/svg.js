/** @typedef {{ x: number, y: number }} Vec2 */

export function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * @param {number} w
 * @param {number} h
 * @param {string} body
 */
export function svgWrap(w, h, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-hidden="true">
${body}
</svg>`;
}

/**
 * @param {Vec2} a
 * @param {Vec2} b
 * @param {{ dashed?: boolean, stroke?: string, width?: number }} [opts]
 */
export function line(a, b, opts = {}) {
  const dash = opts.dashed ? ' stroke-dasharray="6 4"' : '';
  const stroke = opts.stroke ?? '#1a1a1a';
  const width = opts.width ?? 1.6;
  return `<line x1="${a.x.toFixed(2)}" y1="${a.y.toFixed(2)}" x2="${b.x.toFixed(2)}" y2="${b.y.toFixed(2)}" stroke="${stroke}" stroke-width="${width}"${dash} stroke-linecap="round"/>`;
}

/**
 * @param {Vec2} p
 * @param {string} text
 * @param {{ dx?: number, dy?: number }} [opts]
 */
export function label(p, text, opts = {}) {
  const dx = opts.dx ?? 0;
  const dy = opts.dy ?? 0;
  return `<text x="${(p.x + dx).toFixed(2)}" y="${(p.y + dy).toFixed(2)}" font-family="Segoe UI, Arial, sans-serif" font-size="14" font-style="italic" fill="#111" text-anchor="middle" dominant-baseline="middle">${escapeXml(text)}</text>`;
}

/**
 * @param {Vec2} a
 * @param {Vec2} b
 * @param {string} text
 */
export function edgeLabel(a, b, text) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = (-dy / len) * 10;
  const ny = (dx / len) * 10;
  return `<text x="${(mx + nx).toFixed(2)}" y="${(my + ny).toFixed(2)}" font-family="Segoe UI, Arial, sans-serif" font-size="13" fill="#333" text-anchor="middle" dominant-baseline="middle">${escapeXml(text)}</text>`;
}
