import { REGIONS, regionForIndex, firstIndexInRegion } from '../app/quest-regions.js';
import { renderQuestTrailHtml, bindQuestTrail, spawnGoldFloat } from './quest-trail.js';
import { regionSceneBlock } from './quest-region-art.js';

export { isQuestionAnswered } from '../app/quest-answer.js';
export { spawnGoldFloat };

/**
 * @param {object} opts
 */
export function renderQuestMapHtml(opts) {
  return renderQuestTrailHtml(opts);
}

export function bindQuestMap(root, onGoToIndex, onGoToRegion) {
  bindQuestTrail(root, onGoToIndex, (regionId) =>
    onGoToRegion(firstIndexInRegion(/** @type {import('../app/quest-regions.js').RegionId} */ (regionId)))
  );
}

export { REGIONS, regionForIndex, regionSceneBlock };
