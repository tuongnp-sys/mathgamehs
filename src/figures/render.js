import { renderRightPrism } from './templates/right-prism.js';
import { renderSphere } from './templates/sphere.js';
import { renderPyramid } from './templates/pyramid.js';

/** @typedef {import('./templates/right-prism.js').RightPrismSpec | import('./templates/sphere.js').SphereSpec | import('./templates/pyramid.js').PyramidSpec} FigureSpec */

const RENDERERS = {
  rightPrism: renderRightPrism,
  sphere: renderSphere,
  pyramid: renderPyramid,
};

/**
 * @param {FigureSpec & { type: string }} spec
 * @returns {string}
 */
export function renderFigure(spec) {
  const fn = RENDERERS[spec.type];
  if (!fn) {
    throw new Error(`Unknown figure type: ${spec.type}`);
  }
  return fn(spec);
}
