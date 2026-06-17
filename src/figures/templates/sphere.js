import { svgWrap, line, label, edgeLabel } from '../geom/svg.js';

/**
 * @typedef {object} SphereSpec
 * @property {'sphere'} type
 * @property {number} radius
 * @property {boolean} [showRadius]
 * @property {string} [radiusLabel]
 * @property {'stem' | 'solution'} [variant]
 */

/**
 * @param {SphereSpec} spec
 * @returns {string}
 */
export function renderSphere(spec) {
  const R = spec.radius ?? 3;
  const showRadius = spec.showRadius !== false;
  const radiusLabel = spec.radiusLabel ?? String(R);
  const scale = 14;
  const r = R * scale;
  const cx = r + 36;
  const cy = r + 32;
  const w = Math.ceil(cx + r + 36);
  const h = Math.ceil(cy + r + 28);

  const parts = [];
  parts.push(
    `<ellipse cx="${cx.toFixed(2)}" cy="${(cy + r * 0.12).toFixed(2)}" rx="${r.toFixed(2)}" ry="${(r * 0.32).toFixed(2)}" fill="none" stroke="#888" stroke-width="1.2" stroke-dasharray="5 4"/>`
  );
  parts.push(
    `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${r.toFixed(2)}" fill="none" stroke="#1a1a1a" stroke-width="1.8"/>`
  );
  parts.push(
    `<ellipse cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" rx="${r.toFixed(2)}" ry="${(r * 0.32).toFixed(2)}" fill="none" stroke="#1a1a1a" stroke-width="1.4"/>`
  );

  if (showRadius) {
    const px = cx + r * 0.65;
    const py = cy - r * 0.55;
    parts.push(line({ x: cx, y: cy }, { x: px, y: py }, { width: 1.4 }));
    parts.push(edgeLabel({ x: cx, y: cy }, { x: px, y: py }, `R = ${radiusLabel}`));
    parts.push(label({ x: cx - 8, y: cy + 4 }, 'O', { dx: 0, dy: 0 }));
  }

  return svgWrap(w, h, parts.join('\n'));
}
