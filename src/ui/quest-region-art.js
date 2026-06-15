/** @typedef {import('../app/quest-regions.js').RegionId} RegionId */

/**
 * Inline SVG scene art for quest regions (no external assets).
 * @param {RegionId} regionId
 * @param {'banner' | 'thumb'} size
 */
export function regionSceneSvg(regionId, size = 'banner') {
  const h = size === 'banner' ? 72 : 48;
  const w = size === 'banner' ? 320 : 120;
  if (regionId === 'dam_lay') return swampSvg(w, h);
  if (regionId === 'rung_nguy') return jungleSvg(w, h);
  return caveSvg(w, h);
}

export function treasureCaveSceneSvg() {
  return caveSvg(280, 140, true);
}

function swampSvg(w, h) {
  return `<svg class="region-svg" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="swampSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1a3d2e"/>
        <stop offset="100%" stop-color="#0d2818"/>
      </linearGradient>
      <linearGradient id="swampWater" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2d6b4f"/>
        <stop offset="100%" stop-color="#1a4d38"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#swampSky)"/>
    <ellipse cx="${w * 0.5}" cy="${h * 0.85}" rx="${w * 0.55}" ry="${h * 0.35}" fill="url(#swampWater)" opacity="0.9"/>
    <ellipse cx="${w * 0.25}" cy="${h * 0.78}" rx="${w * 0.12}" ry="${h * 0.08}" fill="#3d8b5a" opacity="0.7"/>
    <ellipse cx="${w * 0.55}" cy="${h * 0.72}" rx="${w * 0.1}" ry="${h * 0.07}" fill="#4a9e68"/>
    <ellipse cx="${w * 0.78}" cy="${h * 0.8}" rx="${w * 0.11}" ry="${h * 0.075}" fill="#357a52"/>
    <path d="M${w * 0.08} ${h * 0.5} Q${w * 0.06} ${h * 0.3} ${w * 0.1} ${h * 0.15}" stroke="#2d5a3d" stroke-width="3" fill="none"/>
    <path d="M${w * 0.15} ${h * 0.55} l0 -${h * 0.35}" stroke="#3d6b45" stroke-width="2.5"/>
    <path d="M${w * 0.88} ${h * 0.52} l0 -${h * 0.28}" stroke="#2d5a3d" stroke-width="2"/>
    <circle cx="${w * 0.35}" cy="${h * 0.55}" r="3" fill="#7ec8a0" opacity="0.5"/>
    <circle cx="${w * 0.62}" cy="${h * 0.48}" r="2.5" fill="#9ed4b8" opacity="0.4"/>
    <text x="${w * 0.5}" y="${h * 0.22}" text-anchor="middle" fill="#a8e6c4" font-size="9" opacity="0.6">~ ~ ~</text>
  </svg>`;
}

function jungleSvg(w, h) {
  return `<svg class="region-svg" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="jungleBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0f2a18"/>
        <stop offset="100%" stop-color="#051208"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#jungleBg)"/>
    <ellipse cx="${w * 0.2}" cy="${h * 0.35}" rx="${w * 0.18}" ry="${h * 0.28}" fill="#1e5c32"/>
    <ellipse cx="${w * 0.45}" cy="${h * 0.3}" rx="${w * 0.22}" ry="${h * 0.32}" fill="#267a3e"/>
    <ellipse cx="${w * 0.72}" cy="${h * 0.38}" rx="${w * 0.2}" ry="${h * 0.3}" fill="#1a4d2a"/>
    <ellipse cx="${w * 0.88}" cy="${h * 0.42}" rx="${w * 0.15}" ry="${h * 0.25}" fill="#2d6b3d"/>
    <rect x="${w * 0.18}" y="${h * 0.55}" width="4" height="${h * 0.4}" fill="#3d2817"/>
    <rect x="${w * 0.5}" y="${h * 0.5}" width="5" height="${h * 0.45}" fill="#4a3020"/>
    <rect x="${w * 0.75}" y="${h * 0.58}" width="4" height="${h * 0.38}" fill="#352818"/>
    <path d="M${w * 0.1} ${h * 0.7} Q${w * 0.3} ${h * 0.55} ${w * 0.5} ${h * 0.72} T${w * 0.9} ${h * 0.68}" stroke="#143d22" stroke-width="8" fill="none" opacity="0.5"/>
    <circle cx="${w * 0.3}" cy="${h * 0.2}" r="2" fill="#ffd54f" opacity="0.3"/>
    <circle cx="${w * 0.7}" cy="${h * 0.15}" r="1.5" fill="#fff9c4" opacity="0.25"/>
  </svg>`;
}

function caveSvg(w, h, treasure = false) {
  const gems = treasure
    ? `<circle cx="${w * 0.35}" cy="${h * 0.72}" r="5" fill="#ffd700" class="gem-sparkle"/>
       <circle cx="${w * 0.5}" cy="${h * 0.78}" r="4" fill="#e040fb" class="gem-sparkle" style="animation-delay:0.3s"/>
       <circle cx="${w * 0.62}" cy="${h * 0.7}" r="4.5" fill="#40c4ff" class="gem-sparkle" style="animation-delay:0.6s"/>
       <circle cx="${w * 0.45}" cy="${h * 0.65}" r="3" fill="#69f0ae" class="gem-sparkle" style="animation-delay:0.9s"/>
       <rect x="${w * 0.38}" y="${h * 0.55}" width="${w * 0.24}" height="${h * 0.12}" rx="3" fill="#8b6914" stroke="#e6b450" stroke-width="1"/>
       <text x="${w * 0.5}" y="${h * 0.63}" text-anchor="middle" fill="#ffe082" font-size="10">♦</text>`
    : `<circle cx="${w * 0.4}" cy="${h * 0.75}" r="3" fill="#ffd700" opacity="0.6"/>
       <circle cx="${w * 0.55}" cy="${h * 0.72}" r="2.5" fill="#b388ff" opacity="0.5"/>`;

  return `<svg class="region-svg ${treasure ? 'region-svg-treasure' : ''}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="caveBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1a1520"/>
        <stop offset="100%" stop-color="#0a080c"/>
      </linearGradient>
      <radialGradient id="caveGlow" cx="50%" cy="80%" r="50%">
        <stop offset="0%" stop-color="#5c4033" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#0a080c" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#caveBg)"/>
    <path d="M0 ${h * 0.4} Q${w * 0.25} ${h * 0.15} ${w * 0.5} ${h * 0.35} Q${w * 0.75} ${h * 0.12} ${w} ${h * 0.38} L${w} ${h} L0 ${h} Z" fill="#2d2420"/>
    <ellipse cx="${w * 0.5}" cy="${h * 0.55}" rx="${w * 0.35}" ry="${h * 0.35}" fill="url(#caveGlow)"/>
    ${gems}
    <path d="M${w * 0.15} ${h} L${w * 0.2} ${h * 0.5} L${w * 0.25} ${h}" fill="#1a1410" opacity="0.8"/>
    <path d="M${w * 0.75} ${h} L${w * 0.8} ${h * 0.48} L${w * 0.85} ${h}" fill="#1a1410" opacity="0.8"/>
  </svg>`;
}

/**
 * @param {RegionId} regionId
 * @param {(key: string) => string} t
 */
export function regionSceneBlock(regionId, t, size = 'banner') {
  const descKey = `region_desc_${regionId}`;
  return `
    <div class="quest-scene quest-scene-${regionId}">
      ${regionSceneSvg(regionId, size)}
      <div class="quest-scene-caption">
        <strong>${t(`region_${regionId}`)}</strong>
        <span class="quest-scene-desc">${t(descKey)}</span>
      </div>
    </div>`;
}
