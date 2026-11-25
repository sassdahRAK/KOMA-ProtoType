/**
 * Offline schematic projection for the KOMA facility map.
 *
 * No map tiles are loaded and no network request is made. Cambodia's fixed
 * bounding box is projected onto a square 1000 x 1000 viewBox:
 *
 *   longitude 102.3 -> 107.7  maps to  x 0 -> 1000
 *   latitude   14.8 -> 10.4   maps to  y 0 -> 1000   (north at the top)
 *
 * A 40 unit padding keeps pins clear of the frame edge. This is a schematic
 * sketch for orientation, not a scale map.
 */

export const MAP_SIZE = 1000
export const MAP_PAD = 40

export const LNG_MIN = 102.3
export const LNG_MAX = 107.7
export const LAT_MIN = 10.4
export const LAT_MAX = 14.8

const SPAN = MAP_SIZE - MAP_PAD * 2

/** Project a WGS84 latitude/longitude pair into the 1000x1000 viewBox. */
export function projectPoint(lat, lng) {
  const x = MAP_PAD + ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * SPAN
  const y = MAP_PAD + ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * SPAN
  return { x, y }
}

/** True only when both coordinates are real finite numbers. */
export function hasCoords(facility) {
  return (
    facility != null &&
    Number.isFinite(facility.lat) &&
    Number.isFinite(facility.lng)
  )
}

function marker(id, label, lat, lng) {
  const { x, y } = projectPoint(lat, lng)
  return { id, label, lat, lng, x, y }
}

/**
 * A small set of major province labels for orientation. These use the same
 * projection as the facility pins, so they stay aligned when the SVG scales.
 */
export const PROVINCE_MARKERS = [
  marker('phnom-penh', 'Phnom Penh', 11.55, 104.92),
  marker('siem-reap', 'Siem Reap', 13.36, 103.86),
  marker('battambang', 'Battambang', 13.1, 103.2),
  marker('sihanoukville', 'Sihanoukville', 10.62, 103.52),
  marker('kampong-cham', 'Kampong Cham', 11.99, 105.46),
]
