import { useMemo } from 'react'
import { SOURCES } from '../../lib/data.js'
import { useI18n } from '../../lib/i18n.jsx'
import { Button } from '../ui.jsx'
import { IconMap, IconPin } from '../icons.jsx'
import { hasCoords } from './projection.js'
import { facilityTypeLabel, provinceLabel } from './constants.js'

/**
 * Offline schematic facility map.
 *
 * No map tiles and no network requests: the viewBox is a hand-drawn sketch.
 * Pins are projected with a small linear mapping computed from the min/max of
 * the *currently filtered* pins (12% padding), recomputed on filter change.
 * Facilities without finite coordinates are never drawn; they are counted in
 * a note under the map.
 */

const MAP_WIDTH = 640
const MAP_HEIGHT = 460
const PAD = 0.12

const LANDMASS =
  'M320 34C372 44 414 66 456 100C496 132 534 154 548 194C560 228 532 250 542 282C552 318 522 342 500 372C476 406 432 420 394 402C360 386 330 412 294 406C250 398 224 364 202 330C182 298 148 284 134 250C118 212 146 180 156 146C166 112 196 104 226 88C262 68 284 44 320 34Z'

const RIVERS = [
  'M334 42C352 118 302 190 324 262C344 330 318 388 332 436',
  'M438 116C406 176 384 238 400 300C412 344 392 382 402 416',
]

const GRID_X = [80, 160, 240, 320, 400, 480, 560]
const GRID_Y = [60, 130, 200, 270, 340, 410]

/* Logo-derived palette, mirrored from tailwind.config.js. SVG fill/stroke
 * attributes cannot use Tailwind classes, so the map keeps a local copy.
 * Keep these values in sync with the design tokens. */
const COLOR = {
  paper: '#F7FAFA',
  paperDeep: '#EAF2F4',
  shell: '#FFFFFF',
  pine: '#14656F',
  teal: '#1E8E9C',
  teal100: '#CFE9EE',
  mint: '#D8F0F3',
  saffron: '#EE9E33',
  ink: '#10262B',
  inkSoft: '#415B60',
  inkFaint: '#5F797E',
  line: '#DCE8EA',
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function shortLabel(value, max = 18) {
  const text = String(value || '')
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}

/** Linear projection built from the filtered pins, padded by 12%. */
function buildProjection(points) {
  const padX = MAP_WIDTH * PAD
  const padY = MAP_HEIGHT * PAD
  const spanX = MAP_WIDTH - padX * 2
  const spanY = MAP_HEIGHT - padY * 2

  if (!points.length) {
    return () => ({ x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 })
  }

  const lngs = points.map((point) => point.lng)
  const lats = points.map((point) => point.lat)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const lngSpan = maxLng - minLng
  const latSpan = maxLat - minLat
  const lngFixed = lngSpan < 1e-9
  const latFixed = latSpan < 1e-9

  return (lat, lng) => ({
    x: lngFixed ? MAP_WIDTH / 2 : padX + ((lng - minLng) / lngSpan) * spanX,
    y: latFixed ? MAP_HEIGHT / 2 : padY + ((maxLat - lat) / latSpan) * spanY,
  })
}

export default function SchematicMap({
  facilities = [],
  selectedId = null,
  selected = null,
  hoveredId = null,
  onSelect,
  onHover,
  onReset,
}) {
  const { t, tl, isKm } = useI18n()
  const activeId = selectedId ?? selected?.id ?? null

  const pins = useMemo(() => {
    const mappable = facilities.filter(hasCoords)
    const project = buildProjection(mappable)
    return mappable.map((facility) => {
      const { x, y } = project(facility.lat, facility.lng)
      return { facility, x, y }
    })
  }, [facilities])

  const missingCount = facilities.length - pins.length

  /* Province labels anchored on filtered pins so they stay in frame. */
  const provinceLabels = useMemo(() => {
    const groups = new Map()
    for (const { facility, x, y } of pins) {
      const current = groups.get(facility.province) || {
        province: facility.province,
        x: 0,
        y: 0,
        count: 0,
      }
      current.x += x
      current.y += y
      current.count += 1
      groups.set(facility.province, current)
    }
    return Array.from(groups.values()).map((group) => ({
      province: group.province,
      x: group.x / group.count,
      y: group.y / group.count,
    }))
  }, [pins])

  const selectedPin = pins.find((pin) => pin.facility.id === activeId) || null
  const selectedFacility = selectedPin?.facility || null
  const selectedSource = selectedFacility
    ? SOURCES.find((source) => source.id === selectedFacility.sourceId) || null
    : null

  const isEmpty = facilities.length === 0
  const noPins = !isEmpty && pins.length === 0

  const tipLeft = selectedPin
    ? clamp((selectedPin.x / MAP_WIDTH) * 100, 30, 70)
    : 50
  const tipTop = selectedPin ? (selectedPin.y / MAP_HEIGHT) * 100 : 50
  const tipBelow = tipTop < 36

  const activate = (id) => {
    if (typeof onSelect === 'function') onSelect(id)
  }

  return (
    <section
      aria-labelledby="map-panel-heading"
      className="card min-w-0 overflow-hidden p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mono-label">
            {tl({ km: 'ផែនទីគំនូសសម្គាល់', en: 'Schematic map' })}
          </p>
          <h2
            id="map-panel-heading"
            className="mt-1 font-display text-lg font-semibold leading-snug text-ink"
          >
            {tl({ km: 'ទីតាំងមណ្ឌលនៅលើផែនទី', en: 'Facilities on the map' })}
          </h2>
        </div>
        <span className="flex-none rounded-full border border-line bg-paper-deep px-2.5 py-1 font-mono text-[11px] text-ink-soft">
          {pins.length} {tl({ km: 'ម្ជុល', en: 'pins' })}
        </span>
      </div>

      <div className="relative mt-3">
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="h-auto w-full rounded-2xl border border-line"
          role="group"
          aria-label={tl({
            km: 'ផែនទីគំនូសសម្គាល់នៃមណ្ឌលសុខភាព មិនមែនតាមមាត្រដ្ឋាន',
            en: 'Schematic sketch map of health facilities, not to scale',
          })}
        >
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill={COLOR.paper} />

          {/* Subtle grid */}
          <g
            stroke={COLOR.line}
            strokeWidth="0.75"
            strokeDasharray="2 7"
            opacity="0.85"
            aria-hidden="true"
          >
            {GRID_X.map((x) => (
              <line key={`gx-${x}`} x1={x} y1="0" x2={x} y2={MAP_HEIGHT} />
            ))}
            {GRID_Y.map((y) => (
              <line key={`gy-${y}`} x1="0" y1={y} x2={MAP_WIDTH} y2={y} />
            ))}
          </g>

          {/* Landmass and water, purely illustrative */}
          <g aria-hidden="true">
            <path
              d={LANDMASS}
              fill={COLOR.paperDeep}
              stroke={COLOR.line}
              strokeWidth="1.5"
            />
            <ellipse
              cx="300"
              cy="214"
              rx="46"
              ry="25"
              fill={COLOR.teal100}
              opacity="0.75"
            />
            {RIVERS.map((d, index) => (
              <path
                key={`river-${index}`}
                d={d}
                fill="none"
                stroke={COLOR.teal100}
                strokeWidth={index === 0 ? 11 : 6}
                strokeLinecap="round"
                opacity="0.95"
              />
            ))}
            <text
              x="574"
              y="34"
              textAnchor="middle"
              fontSize="11"
              fontFamily="'IBM Plex Mono', monospace"
              fill={COLOR.inkSoft}
            >
              N
            </text>
            <path
              d="M574 42v-14m0 0-4 5m4-5 4 5"
              stroke={COLOR.inkSoft}
              strokeWidth="1.25"
              fill="none"
            />
          </g>

          {/* Province labels for the main provinces represented */}
          <g aria-hidden="true">
            {provinceLabels.map((label) => (
              <text
                key={`province-${label.province}`}
                x={label.x}
                y={Math.max(16, label.y - 26)}
                textAnchor="middle"
                fontSize="10"
                fontFamily="'Noto Sans Khmer', Manrope, sans-serif"
                fill={COLOR.inkSoft}
                opacity="0.9"
                paintOrder="stroke"
                stroke={COLOR.paper}
                strokeWidth="2.5"
                strokeLinejoin="round"
              >
                {isKm ? label.province : provinceLabel(label.province).en}
              </text>
            ))}
          </g>

        </svg>

        {/* Pins — real 44px buttons layered on the offline SVG */}
        <div className="absolute inset-0">
          {pins.map(({ facility, x, y }) => {
            const verified = facility.status === 'verified'
            const isActive = facility.id === activeId
            const highlighted = isActive || facility.id === hoveredId
            const type = tl(facilityTypeLabel(facility.facilityType))

            return (
              <button
                key={facility.id}
                type="button"
                onClick={() => activate(facility.id)}
                onMouseEnter={() => onHover?.(facility.id)}
                onMouseLeave={() => onHover?.(null)}
                onFocus={() => onHover?.(facility.id)}
                onBlur={() => onHover?.(null)}
                aria-label={`${facility.nameKm} — ${facility.nameEn}, ${type}${
                  verified ? `, ${t('common.verified')}` : ''
                }`}
                aria-pressed={isActive}
                className={cx(
                  'focusable group absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full',
                  isActive ? 'z-20' : 'z-10',
                )}
                style={{
                  left: `${(x / MAP_WIDTH) * 100}%`,
                  top: `${(y / MAP_HEIGHT) * 100}%`,
                }}
              >
                <span
                  aria-hidden="true"
                  className={cx(
                    'flex items-center justify-center rounded-full border-2 shadow-lift outline outline-[1.5px] outline-white transition-transform',
                    verified
                      ? 'border-pine bg-pine'
                      : 'border-saffron-ink bg-saffron',
                    isActive
                      ? 'h-5 w-5 ring-4 ring-teal/35'
                      : highlighted
                        ? 'h-4 w-4 ring-4 ring-teal/20'
                        : 'h-3.5 w-3.5',
                  )}
                >
                  <span
                    className={cx(
                      'block h-1 w-1 rounded-full',
                      verified ? 'bg-mint' : 'bg-shell',
                    )}
                  />
                </span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-full mt-0.5 -translate-x-1/2 whitespace-nowrap text-[8.5px] font-medium leading-none text-ink-soft"
                  style={{
                    textShadow:
                      '0 0 3px #F7FAFA, 0 0 3px #F7FAFA, 0 0 3px #F7FAFA',
                  }}
                >
                  {shortLabel(isKm ? facility.nameKm : facility.nameEn, 14)}
                </span>
              </button>
            )
          })}
        </div>

        {/* Selected pin tooltip */}
        {selectedPin && !isEmpty ? (
          <div
            className="pointer-events-none absolute z-10 w-[min(220px,calc(100%-16px))] rounded-xl border border-line bg-shell p-3 shadow-lift"
            style={{
              left: `${tipLeft}%`,
              top: `${tipTop}%`,
              transform: `translate(-50%, ${
                tipBelow ? '14px' : 'calc(-100% - 14px)'
              })`,
            }}
            aria-hidden="true"
          >
            <p
              className={cx(
                'text-sm font-semibold leading-snug text-ink',
                isKm && 'font-khmer',
              )}
            >
              {isKm ? selectedFacility.nameKm : selectedFacility.nameEn}
            </p>
            <p className="mt-1 text-[11px] font-semibold text-teal-600">
              {tl(facilityTypeLabel(selectedFacility.facilityType))}
            </p>
            <p className="mt-1 line-clamp-2 font-mono text-[10px] leading-relaxed text-ink-faint">
              {selectedSource ? selectedSource.name : selectedFacility.sourceId}
            </p>
          </div>
        ) : null}

        {/* Empty overlays */}
        {isEmpty || noPins ? (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-paper/85 p-4 backdrop-blur-[1px]">
            <div className="max-w-[260px] text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mint/70 text-pine">
                <IconMap size={22} />
              </span>
              <p className="mt-3 font-display text-base font-semibold text-ink">
                {isEmpty
                  ? tl({ km: 'រកមិនឃើញទីតាំង', en: 'No facilities match' })
                  : tl({
                      km: 'គ្មានម្ជុលសម្រាប់លទ្ធផលនេះទេ',
                      en: 'No map pins for these results',
                    })}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                {isEmpty
                  ? tl({
                      km: 'សូមសម្អាតតម្រង ឬស្វែងរកខុសគ្នា។',
                      en: 'Clear the filters or try a different search.',
                    })
                  : `+${missingCount} ${tl({
                      km: 'គ្មានទីតាំងលើផែនទី',
                      en: 'without a map pin',
                    })}`}
              </p>
              {isEmpty && typeof onReset === 'function' ? (
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-3"
                  onClick={onReset}
                >
                  {t('common.reset')}
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-pine" aria-hidden="true" />
          {t('common.verified')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full border-2 border-saffron-ink bg-saffron"
            aria-hidden="true"
          />
          {t('common.demo')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <IconPin size={13} className="text-ink-faint" />
          {tl({ km: 'គ្មានទីតាំងលើផែនទី', en: 'No map pin' })}
        </span>
      </div>

      {missingCount > 0 ? (
        <p className="mt-2 rounded-xl border border-saffron/30 bg-saffron-tint px-3 py-2 text-xs leading-relaxed text-saffron-ink">
          <span className="font-mono font-semibold">+{missingCount}</span>{' '}
          {tl({ km: 'គ្មានទីតាំងលើផែនទី', en: 'without a map pin' })}
          {' — '}
          {tl({
            km: 'មណ្ឌលទាំងនេះមានក្នុងបញ្ជី ប៉ុន្តែមិនបានកត់ត្រាកូអរដោណេទេ។',
            en: 'listed above, but no coordinates are recorded.',
          })}
        </p>
      ) : null}

      <p className="mt-2 font-mono text-[10px] leading-relaxed text-ink-soft">
        {tl({
          km: 'ផែនទីគំនូសសម្គាល់ · មិនមែនតាមមាត្រដ្ឋាន',
          en: 'Schematic sketch · not to scale',
        })}
      </p>
    </section>
  )
}
