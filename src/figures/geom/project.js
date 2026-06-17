/** @typedef {{ x: number, y: number, z: number }} Vec3 */
/** @typedef {{ x: number, y: number }} Vec2 */

/**
 * Isometric-style projection (exam diagram convention).
 * @param {Vec3} p
 * @param {number} unit
 * @returns {Vec2}
 */
export function project(p, unit = 1) {
  const x = p.x * unit;
  const y = p.y * unit;
  const z = p.z * unit;
  return {
    x: (x - y) * 0.866,
    y: -z + (x + y) * 0.5,
  };
}

/**
 * @param {Record<string, Vec2>} points
 * @param {number} padding
 */
export function boundsOf(points, padding = 24) {
  const xs = Object.values(points).map((p) => p.x);
  const ys = Object.values(points).map((p) => p.y);
  const minX = Math.min(...xs) - padding;
  const maxX = Math.max(...xs) + padding;
  const minY = Math.min(...ys) - padding;
  const maxY = Math.max(...ys) + padding;
  return {
    minX,
    minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * @param {Vec2} p
 * @param {{ minX: number, minY: number }} origin
 */
export function toSvg(p, origin) {
  return { x: p.x - origin.minX, y: p.y - origin.minY };
}
