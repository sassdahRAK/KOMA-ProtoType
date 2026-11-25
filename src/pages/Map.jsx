import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FACILITIES } from '../lib/data.js'
import { useI18n } from '../lib/i18n.jsx'
import {
  Button,
  DemoBadge,
  EmptyState,
  PageHeader,
  SafetyStripe,
  Tag,
} from '../components/ui.jsx'
import {
  IconClose,
  IconMap,
  IconMenu,
  IconPin,
  IconShield,
} from '../components/icons.jsx'
import MapFilters from '../components/map/MapFilters.jsx'
import FacilityCard from '../components/map/FacilityCard.jsx'
import SchematicMap from '../components/map/SchematicMap.jsx'
import { hasCoords } from '../components/map/projection.js'

function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}

const COPY = {
  eyebrow: { km: 'ទីតាំង', en: 'MAP' },
  title: { km: 'រកមើលមណ្ឌលសុខភាព', en: 'Find a health facility' },
  lead: {
    km: 'ស្វែងរកក្នុងបញ្ជីមណ្ឌលសុខភាពគំរូតូចមួយ។ រាល់កំណត់ត្រាបង្ហាញប្រភព និងកាលបរិច្ឆេទពិនិត្យចុងក្រោយ។ នេះជាបញ្ជីមិនពេញលេញ មិនមែនជាគម្របទូទាំងប្រទេសទេ។',
    en: 'Search a small demo directory. Every record shows its source and last-checked date. This is a partial list, not nationwide coverage.',
  },
  stripeTitle: {
    km: 'មិនទាន់មានព័ត៌មានបើកដំណើរការ',
    en: 'Opening hours are not recorded',
  },
  stripeBody: {
    km: 'យើងមិនដឹងថាមណ្ឌលណាកំពុងបើកដំណើរការឥឡូវនេះទេ។ សូមទូរស័ព្ទទៅមុនពេលធ្វើដំណើរ។',
    en: 'We do not know which facilities are open right now — call ahead before travelling.',
  },
  listHeading: {
    km: 'បញ្ជីមណ្ឌលសុខភាព',
    en: 'Facility directory',
  },
  emptyTitle: {
    km: 'រកមិនឃើញទីតាំង',
    en: 'No facilities match',
  },
  emptyBody: {
    km: 'សូមសម្អាតការស្វែងរក ឬជ្រើសរើសខេត្ត និងប្រភេទឡើងវិញ ដើម្បីមើលបញ្ជីទាំងមូល។',
    en: 'Clear your search or choose all provinces and facility types to see the full demo directory.',
  },
  withPins: { km: 'មានម្ជុលលើផែនទី', en: 'with map pins' },
  showAs: { km: 'បង្ហាញជាបញ្ជី ឬផែនទី', en: 'Show as list or map' },
  list: { km: 'បញ្ជី', en: 'List' },
  map: { km: 'ផែនទី', en: 'Map' },
  pinNote: {
    km: 'ម្ជុលបង្ហាញតែមណ្ឌលដែលមានកូអរដោណេ។ មណ្ឌលដែលគ្មានកូអរដោណេនៅមានក្នុងបញ្ជីខាងឆ្វេង។',
    en: 'Only facilities with coordinates get a pin. Records without coordinates stay in the list.',
  },
}

export default function MapPage() {
  const { t, tl, isKm } = useI18n()

  const [query, setQuery] = useState('')
  const [province, setProvince] = useState('')
  const [type, setType] = useState('all')
  const [selectedId, setSelectedId] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [view, setView] = useState('list')

  const cardRefs = useRef(new Map())

  const registerCard = useCallback((id, node) => {
    if (node) cardRefs.current.set(id, node)
    else cardRefs.current.delete(id)
  }, [])

  const needle = query.trim().toLowerCase()

  const filtered = useMemo(() => {
    return FACILITIES.filter((facility) => {
      if (province && facility.province !== province) return false
      if (type && type !== 'all' && facility.facilityType !== type) return false
      if (!needle) return true
      return [
        facility.nameKm,
        facility.nameEn,
        facility.district,
        facility.province,
      ].some((field) =>
        String(field ?? '')
          .toLowerCase()
          .includes(needle),
      )
    })
  }, [needle, province, type])

  const selected = filtered.find((facility) => facility.id === selectedId) || null
  const pinnedCount = filtered.filter(hasCoords).length

  const hasFilters =
    needle.length > 0 || province !== '' || (type && type !== 'all')

  useEffect(() => {
    setHoveredId(null)
    if (selectedId && !filtered.some((facility) => facility.id === selectedId)) {
      setSelectedId(null)
    }
  }, [filtered, selectedId])

  const resetAll = useCallback(() => {
    setQuery('')
    setProvince('')
    setType('all')
    setSelectedId(null)
    setHoveredId(null)
  }, [])

  const scrollToCard = useCallback((id) => {
    const node = cardRefs.current.get(id)
    if (!node) return
    const reduceMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    node.scrollIntoView({
      block: 'center',
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }, [])

  const handlePinSelect = useCallback(
    (id) => {
      setSelectedId(id)
      setHoveredId(null)
      setView('list')
      if (typeof window !== 'undefined') {
        window.setTimeout(() => scrollToCard(id), 40)
      }
    },
    [scrollToCard],
  )

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        eyebrow={`KOMA · ${tl(COPY.eyebrow)}`}
        title={tl(COPY.title)}
        lead={
          <>
            {tl(COPY.lead)}
            <span className="mt-3 flex items-start gap-1.5 text-[13px] leading-relaxed text-ink-soft">
              <IconShield size={14} className="mt-0.5 flex-none" />
              <span>{t('common.notMedicalAdvice')}</span>
            </span>
          </>
        }
        aside={
          <div className="flex flex-wrap items-center gap-2">
            <DemoBadge label={t('common.demo')} />
            <Tag tone="mint">
              {FACILITIES.length}{' '}
              {tl({ km: 'កំណត់ត្រា', en: 'records' })}
            </Tag>
          </div>
        }
      />

      <SafetyStripe tone="saffron" title={tl(COPY.stripeTitle)}>
        {tl(COPY.stripeBody)}
      </SafetyStripe>

      {/* Controls bar — sticky under the header on desktop */}
      <div className="lg:sticky lg:top-2 lg:z-20">
        <MapFilters
          query={query}
          onQuery={setQuery}
          province={province}
          onProvince={setProvince}
          type={type}
          onType={setType}
          onReset={resetAll}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p
          role="status"
          aria-live="polite"
          className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm leading-relaxed text-ink-soft"
        >
          <span>
            {t('common.showing')}{' '}
            <span className="font-mono font-semibold text-ink">
              {filtered.length}
            </span>{' '}
            {t('common.results')}
          </span>
          <span className="text-xs text-ink-soft">
            · {pinnedCount} {tl(COPY.withPins)}
          </span>
        </p>
        {hasFilters ? (
          <button
            type="button"
            onClick={resetAll}
            className="focusable inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-2.5 text-sm font-semibold text-teal-600 transition-colors hover:bg-teal-50"
          >
            <IconClose size={14} />
            {t('common.reset')}
          </button>
        ) : null}
      </div>

      {/* Mobile List / Map segmented control */}
      <div className="lg:hidden">
        <div
          role="group"
          aria-label={tl(COPY.showAs)}
          className="grid grid-cols-2 gap-1 rounded-full border border-line bg-shell p-1"
        >
          <button
            type="button"
            aria-pressed={view === 'list'}
            aria-controls="facility-list-pane"
            onClick={() => setView('list')}
            className={cx(
              'focusable flex min-h-[44px] items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold transition-colors',
              view === 'list'
                ? 'bg-pine text-white'
                : 'text-ink-soft hover:text-pine',
            )}
          >
            <IconMenu size={16} />
            <span className={cx(isKm && 'font-khmer')}>{tl(COPY.list)}</span>
          </button>
          <button
            type="button"
            aria-pressed={view === 'map'}
            aria-controls="map-pane"
            onClick={() => setView('map')}
            className={cx(
              'focusable flex min-h-[44px] items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold transition-colors',
              view === 'map'
                ? 'bg-pine text-white'
                : 'text-ink-soft hover:text-pine',
            )}
          >
            <IconMap size={16} />
            <span className={cx(isKm && 'font-khmer')}>{tl(COPY.map)}</span>
          </button>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        {/* Results list */}
        <section
          id="facility-list-pane"
          aria-labelledby="facility-list-heading"
          className={cx('min-w-0', view === 'map' && 'hidden lg:block')}
        >
          <h2 id="facility-list-heading" className="sr-only">
            {tl(COPY.listHeading)}
          </h2>

          {filtered.length ? (
            <ul
              tabIndex={0}
              aria-label={tl(COPY.listHeading)}
              className="focusable space-y-3 lg:max-h-[calc(100vh-13rem)] lg:overflow-y-auto lg:pb-2 lg:pr-2 lg:pt-1"
            >
              {filtered.map((facility) => (
                <FacilityCard
                  key={facility.id}
                  facility={facility}
                  selected={facility.id === selectedId}
                  highlighted={facility.id === hoveredId}
                  onSelect={setSelectedId}
                  onHover={setHoveredId}
                  innerRef={(node) => registerCard(facility.id, node)}
                />
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={<IconMap size={24} />}
              title={tl(COPY.emptyTitle)}
              body={tl(COPY.emptyBody)}
              action={
                <Button variant="secondary" size="sm" onClick={resetAll}>
                  {t('common.reset')}
                </Button>
              }
            />
          )}
        </section>

        {/* Schematic map */}
        <div
          id="map-pane"
          className={cx('min-w-0', view === 'list' && 'hidden lg:block')}
        >
          <div className="mt-4 lg:mt-0 lg:sticky lg:top-24">
            <SchematicMap
              facilities={filtered}
              selectedId={selectedId}
              selected={selected}
              hoveredId={hoveredId}
              onSelect={handlePinSelect}
              onHover={setHoveredId}
              onReset={resetAll}
            />
            <p className="mt-3 flex items-start gap-1.5 px-1 text-[11px] leading-relaxed text-ink-soft">
              <IconPin size={13} className="mt-0.5 flex-none" />
              {tl(COPY.pinNote)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
