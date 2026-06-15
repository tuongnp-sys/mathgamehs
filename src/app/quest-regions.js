/** @typedef {'dam_lay' | 'rung_nguy' | 'thap_co'} RegionId */

export const REGIONS = [
  {
    id: /** @type {RegionId} */ ('dam_lay'),
    part: 1,
    startOrder: 1,
    endOrder: 12,
    icon: '🌿',
  },
  {
    id: /** @type {RegionId} */ ('rung_nguy'),
    part: 2,
    startOrder: 13,
    endOrder: 16,
    icon: '🌲',
  },
  {
    id: /** @type {RegionId} */ ('thap_co'),
    part: 3,
    startOrder: 17,
    endOrder: 22,
    icon: '💎',
  },
];

/**
 * @param {number} questionIndex 0-based index in exam.questions
 * @returns {RegionId}
 */
export function regionForIndex(questionIndex) {
  const order = questionIndex + 1;
  if (order <= 12) return 'dam_lay';
  if (order <= 16) return 'rung_nguy';
  return 'thap_co';
}

/**
 * @param {RegionId} regionId
 * @returns {{ start: number, end: number }}
 */
export function indexRangeForRegion(regionId) {
  const r = REGIONS.find((x) => x.id === regionId);
  if (!r) return { start: 0, end: 0 };
  return { start: r.startOrder - 1, end: r.endOrder - 1 };
}

/**
 * First question index in region (0-based).
 * @param {RegionId} regionId
 */
export function firstIndexInRegion(regionId) {
  return indexRangeForRegion(regionId).start;
}
