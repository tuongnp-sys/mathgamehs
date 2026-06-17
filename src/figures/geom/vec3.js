/** @typedef {{ x: number, y: number, z: number }} Vec3 */

/** @param {number} x @param {number} y @param {number} z @returns {Vec3} */
export function vec3(x, y, z) {
  return { x, y, z };
}

/** @param {Vec3} a @param {Vec3} b @returns {Vec3} */
export function add(a, b) {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

/** @param {Vec3} v @param {number} s @returns {Vec3} */
export function scale(v, s) {
  return { x: v.x * s, y: v.y * s, z: v.z * s };
}
