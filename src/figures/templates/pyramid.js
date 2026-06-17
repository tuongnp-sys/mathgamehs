import { vec3 } from '../geom/vec3.js';
import { project, boundsOf, toSvg } from '../geom/project.js';
import { svgWrap, line, label, edgeLabel } from '../geom/svg.js';

const DEFAULT_LABELS = ['S', 'A', 'B', 'C'];

/** Hidden edges for front-right view: AC into depth, SC and BC on the far side. */
const DEFAULT_HIDDEN = [
  ['A', 'C'],
  ['S', 'C'],
  ['B', 'C'],
];

const LABEL_OFFSETS = {
  S: { dx: 0, dy: -12 },
  A: { dx: -10, dy: 10 },
  B: { dx: 12, dy: 8 },
  C: { dx: -12, dy: -4 },
};

/**
 * @typedef {object} PyramidSpec
 * @property {'pyramid'} type
 * @property {string} [apex]
 * @property {{ shape: 'rightTriangle', rightAt?: string, AB: number, AC: number }} base
 * @property {number} height
 * @property {string[]} [labels]
 * @property {string[][]} [hiddenEdges]
 * @property {{ edge: [string, string], label: string }[]} [annotations]
 * @property {'stem' | 'solution'} [variant]
 */

/**
 * Triangular pyramid with apex above `rightAt` (default A); height along SA ⊥ base.
 * @param {PyramidSpec} spec
 * @returns {string}
 */
export function renderPyramid(spec) {
  const ab = spec.base?.AB ?? 4;
  const ac = spec.base?.AC ?? 5;
  const height = spec.height ?? 3;
  const labels = spec.labels ?? DEFAULT_LABELS;
  const hidden = new Set(
    (spec.hiddenEdges ?? DEFAULT_HIDDEN).map(([a, b]) => `${a}|${b}`)
  );
  const unit = 22;

  const names = ['S', 'A', 'B', 'C'];
  const raw = {
    A: vec3(0, 0, 0),
    B: vec3(ab, 0, 0),
    C: vec3(0, ac, 0),
    S: vec3(0, 0, height),
  };

  const projected = Object.fromEntries(
    names.map((n) => [n, project(raw[n], unit)])
  );
  const box = boundsOf(projected, 32);
  const pts = Object.fromEntries(
    names.map((n) => [n, toSvg(projected[n], box)])
  );

  const edges = [
    ['A', 'B'],
    ['B', 'C'],
    ['C', 'A'],
    ['S', 'A'],
    ['S', 'B'],
    ['S', 'C'],
  ];

  const parts = [];
  for (const [a, b] of edges) {
    const key = `${a}|${b}`;
    const keyRev = `${b}|${a}`;
    const dashed = hidden.has(key) || hidden.has(keyRev);
    parts.push(line(pts[a], pts[b], { dashed }));
  }

  const labelMap = Object.fromEntries(labels.map((l, i) => [names[i], l]));
  for (const n of names) {
    const off = LABEL_OFFSETS[n] ?? { dx: 0, dy: 0 };
    parts.push(label(pts[n], labelMap[n] ?? n, off));
  }

  if (spec.annotations?.length) {
    for (const ann of spec.annotations) {
      const [a, b] = ann.edge;
      if (pts[a] && pts[b]) {
        parts.push(edgeLabel(pts[a], pts[b], ann.label));
      }
    }
  }

  const w = Math.ceil(box.width);
  const h = Math.ceil(box.height);
  return svgWrap(w, h, parts.join('\n'));
}
