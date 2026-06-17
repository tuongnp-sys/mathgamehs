import { vec3 } from '../geom/vec3.js';
import { project, boundsOf, toSvg } from '../geom/project.js';
import { svgWrap, line, label, edgeLabel } from '../geom/svg.js';

const DEFAULT_LABELS = ['A', 'B', 'C', 'D', "A'", "B'", "C'", "D'"];

/** Hidden edges for front-right-top view of ABCD base. */
const DEFAULT_HIDDEN = [
  ['D', 'A'],
  ['D', "D'"],
  ["D'", 'C'],
  ["D'", "A'"],
];

const LABEL_OFFSETS = {
  A: { dx: -10, dy: 8 },
  B: { dx: 10, dy: 8 },
  C: { dx: 10, dy: -6 },
  D: { dx: -10, dy: -6 },
  "A'": { dx: -12, dy: -8 },
  "B'": { dx: 12, dy: -8 },
  "C'": { dx: 12, dy: 6 },
  "D'": { dx: -12, dy: 6 },
};

/**
 * @typedef {object} RightPrismSpec
 * @property {'rightPrism'} type
 * @property {{ shape: 'square', side: number }} base
 * @property {number} height
 * @property {string[]} [labels]
 * @property {string[][]} [hiddenEdges]
 * @property {{ edge: [string, string], label: string }[]} [annotations]
 * @property {'stem' | 'solution'} [variant]
 */

/**
 * @param {RightPrismSpec} spec
 * @returns {string}
 */
export function renderRightPrism(spec) {
  const side = spec.base?.side ?? 4;
  const height = spec.height ?? 5;
  const labels = spec.labels ?? DEFAULT_LABELS;
  const hidden = new Set(
    (spec.hiddenEdges ?? DEFAULT_HIDDEN).map(([a, b]) => `${a}|${b}`)
  );
  const unit = 28;

  const names = ['A', 'B', 'C', 'D', "A'", "B'", "C'", "D'"];
  const raw = {
    A: vec3(0, 0, 0),
    B: vec3(side, 0, 0),
    C: vec3(side, side, 0),
    D: vec3(0, side, 0),
    "A'": vec3(0, 0, height),
    "B'": vec3(side, 0, height),
    "C'": vec3(side, side, height),
    "D'": vec3(0, side, height),
  };

  const projected = Object.fromEntries(
    names.map((n) => [n, project(raw[n], unit)])
  );
  const box = boundsOf(projected, 28);
  const pts = Object.fromEntries(
    names.map((n) => [n, toSvg(projected[n], box)])
  );

  const edges = [
    ['A', 'B'],
    ['B', 'C'],
    ['C', 'D'],
    ['D', 'A'],
    ["A'", "B'"],
    ["B'", "C'"],
    ["C'", "D'"],
    ["D'", "A'"],
    ['A', "A'"],
    ['B', "B'"],
    ['C', "C'"],
    ['D', "D'"],
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
