import { useEffect, useMemo, useRef, useState } from 'react'
import { DOCTORS, FACILITIES, SPECIALTIES } from '../lib/data.js'
import { useI18n } from '../lib/i18n.jsx'
import {
  Button,
  Chip,
  EmptyState,
  Field,
  PageHeader,
  SafetyStripe,
  SearchField,
  Tag,
} from '../components/ui.jsx'
import { IconDoctor, IconFilter, IconShield } from '../components/icons.jsx'
import DoctorCard from '../components/doctor/DoctorCard.jsx'
import DoctorDetail from '../components/doctor/DoctorDetail.jsx'
import COPY from '../components/doctor/copy.js'

const FACILITY_SELECT_ID = 'doctor-facility'

export default function Doctor() {
  const { t, tl, lang } = useI18n()

  const [query, setQuery] = useState('')
  const [specialtyId, setSpecialtyId] = useState(null)
  const [facilityFilter, setFacilityFilter] = useState('')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const detailRef = useRef(null)
  const listRef = useRef(null)
  const previousIdRef = useRef(null)
  const suppressFocusRef = useRef(false)

  const facilityById = useMemo(
    () => new Map(FACILITIES.map((facility) => [facility.id, facility])),
    [],
  )

  const facilityOptions = useMemo(() => {
    const ids = new Set(
      DOCTORS.map((doctor) => doctor.facilityId).filter(Boolean),
    )
    return Array.from(ids)
      .map((id) => facilityById.get(id))
      .filter(Boolean)
      .sort((a, b) => a.nameKm.localeCompare(b.nameKm, 'km'))
  }, [facilityById])

  // Verified records lead the list; everything else keeps its data order.
  const ordered = useMemo(
    () =>
      [...DOCTORS].sort(
        (a, b) =>
          (a.status === 'verified' ? 0 : 1) - (b.status === 'verified' ? 0 : 1),
      ),
    [],
  )

  const normalizedQuery = query.trim().toLowerCase()

  const filtered = useMemo(() => {
    return ordered.filter((doctor) => {
      if (verifiedOnly && doctor.status !== 'verified') return false
      if (specialtyId && doctor.specialty !== specialtyId) return false
      if (facilityFilter && doctor.facilityId !== facilityFilter) return false
      if (!normalizedQuery) return true
      const facility = facilityById.get(doctor.facilityId)
      return [
        doctor.nameKm,
        doctor.nameEn,
        facility?.nameKm,
        facility?.nameEn,
      ].some((value) =>
        String(value || '')
          .toLowerCase()
          .includes(normalizedQuery),
      )
    })
  }, [ordered, normalizedQuery, verifiedOnly, specialtyId, facilityFilter, facilityById])

  const selected = useMemo(
    () => filtered.find((doctor) => doctor.id === selectedId) || null,
    [filtered, selectedId],
  )

  const verifiedCount = useMemo(
    () => DOCTORS.filter((doctor) => doctor.status === 'verified').length,
    [],
  )

  const hasFilters =
    normalizedQuery.length > 0 ||
    specialtyId !== null ||
    facilityFilter !== '' ||
    verifiedOnly

  // If a filter hides the open record, close the panel without stealing focus
  // from the filter control the user just used.
  useEffect(() => {
    if (selectedId && !filtered.some((doctor) => doctor.id === selectedId)) {
      suppressFocusRef.current = true
      setSelectedId(null)
    }
  }, [filtered, selectedId])

  // Move focus into the detail panel when it opens; return it to the card that
  // opened it when the panel closes.
  useEffect(() => {
    if (selectedId) {
      previousIdRef.current = selectedId
      const node = detailRef.current
      if (node) node.focus({ preventScroll: false })
      return
    }

    if (!previousIdRef.current) return
    const id = previousIdRef.current
    previousIdRef.current = null

    if (suppressFocusRef.current) {
      suppressFocusRef.current = false
      return
    }

    const card = listRef.current?.querySelector(
      `[data-doctor-id="${id}"] button`,
    )
    if (card) card.focus()
    else listRef.current?.focus()
  }, [selectedId])

  const resetAll = () => {
    setQuery('')
    setSpecialtyId(null)
    setFacilityFilter('')
    setVerifiedOnly(false)
    setSelectedId(null)
    window.requestAnimationFrame(() => listRef.current?.focus())
  }

  return (
    <div className="space-y-6 sm:space-y-7">
      <PageHeader
        eyebrow={tl(COPY.eyebrow)}
        title={tl(COPY.title)}
        lead={
          <>
            {tl(COPY.lead)}
            <span className="mt-3 flex items-start gap-1.5 text-[13px] leading-relaxed text-ink-faint">
              <IconShield size={14} className="mt-0.5 flex-none" />
              <span>{t('common.notMedicalAdvice')}</span>
            </span>
          </>
        }
        aside={
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone="mint">
              {DOCTORS.length} {tl(COPY.profiles)}
            </Tag>
            <Tag tone="teal">
              {verifiedCount} {t('common.verified')}
            </Tag>
          </div>
        }
      />

      <SafetyStripe tone="saffron" title={tl(COPY.demoNoteTitle)}>
        {tl(COPY.demoNote)}
      </SafetyStripe>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:items-start">
        <section
          aria-labelledby="doctor-filters-heading"
          className="card min-w-0 p-4 sm:p-5 lg:sticky lg:top-6"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-teal-50 text-teal-600">
              <IconFilter size={16} />
            </span>
            <h2
              id="doctor-filters-heading"
              className="font-display text-lg font-semibold leading-snug text-ink"
            >
              {tl(COPY.filtersTitle)}
            </h2>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-ink-faint">
            {tl(COPY.filtersHint)}
          </p>

          <SearchField
            className="mt-4"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery('')}
            label={tl(COPY.searchLabel)}
            placeholder={tl(COPY.searchPlaceholder)}
          />

          <div className="mt-4">
            <p className="mono-label">{tl(COPY.specialtyLabel)}</p>
            <div
              role="group"
              aria-label={tl(COPY.specialtyLabel)}
              className="mt-2 flex flex-wrap gap-2"
            >
              <Chip
                active={specialtyId === null}
                onClick={() => setSpecialtyId(null)}
              >
                {t('common.all')}
              </Chip>
              {SPECIALTIES.map((item) => (
                <Chip
                  key={item.id}
                  active={specialtyId === item.id}
                  onClick={() =>
                    setSpecialtyId((current) =>
                      current === item.id ? null : item.id,
                    )
                  }
                >
                  <span
                    lang={lang}
                    className={lang === 'km' ? 'font-khmer' : ''}
                  >
                    {tl(item)}
                  </span>
                </Chip>
              ))}
            </div>
          </div>

          <Field
            className="mt-4"
            label={tl(COPY.facilityLabel)}
            htmlFor={FACILITY_SELECT_ID}
          >
            <select
              id={FACILITY_SELECT_ID}
              value={facilityFilter}
              onChange={(event) => setFacilityFilter(event.target.value)}
              className="focusable min-h-[48px] w-full min-w-0 rounded-2xl border border-line bg-shell px-3 text-sm text-ink"
            >
              <option value="">{tl(COPY.allFacilities)}</option>
              {facilityOptions.map((facility) => (
                <option key={facility.id} value={facility.id} lang={lang}>
                  {lang === 'km' ? facility.nameKm : facility.nameEn}
                </option>
              ))}
            </select>
          </Field>

          <div role="group" aria-label={tl(COPY.statusLabel)} className="mt-4">
            <p className="mono-label">{tl(COPY.statusLabel)}</p>
            <Chip
              className="mt-2"
              active={verifiedOnly}
              onClick={() => setVerifiedOnly((current) => !current)}
            >
              <IconShield size={16} className="flex-none" />
              <span
                lang={lang}
                className={lang === 'km' ? 'font-khmer' : ''}
              >
                {tl(COPY.verifiedOnly)}
              </span>
            </Chip>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
            <p
              role="status"
              aria-live="polite"
              className="text-xs leading-relaxed text-ink-faint"
            >
              {t('common.showing')} {filtered.length} / {DOCTORS.length}{' '}
              {t('common.results')}
            </p>
            {hasFilters ? (
              <Button variant="ghost" size="sm" onClick={resetAll}>
                {t('common.reset')}
              </Button>
            ) : null}
          </div>
        </section>

        <div className="min-w-0 space-y-6">
          {selected ? (
            <div
              ref={detailRef}
              tabIndex={-1}
              role="region"
              aria-label={tl(COPY.selectedRegion)}
              className="min-w-0 outline-none"
            >
              <DoctorDetail
                doctor={selected}
                onClose={() => setSelectedId(null)}
              />
            </div>
          ) : (
            <div className="hidden lg:block">
              <div className="flex items-center gap-2.5 rounded-2xl border border-dashed border-line bg-shell/70 px-3.5 py-2.5">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-teal-50 text-teal-600">
                  <IconDoctor size={16} />
                </span>
                <p className="min-w-0 text-xs leading-snug text-ink-soft">
                  <span className="font-semibold text-ink">
                    {tl(COPY.selectTitle)}
                  </span>
                  <span className="text-ink-faint">
                    {' — '}
                    {tl(COPY.selectBody)}
                  </span>
                </p>
              </div>
            </div>
          )}

          <section
            ref={listRef}
            tabIndex={-1}
            aria-labelledby="doctor-results-heading"
            className="min-w-0 outline-none"
          >
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h2
                id="doctor-results-heading"
                className="font-display text-lg font-semibold leading-snug text-ink"
              >
                {tl(COPY.resultsTitle)}
              </h2>
              <span
                aria-hidden="true"
                className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint"
              >
                {filtered.length}/{DOCTORS.length}
              </span>
            </div>

            {filtered.length ? (
              <ul className="mt-3 space-y-3">
                {filtered.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    selected={doctor.id === selected?.id}
                    onSelect={setSelectedId}
                  />
                ))}
              </ul>
            ) : (
              <EmptyState
                className="mt-3"
                icon={<IconDoctor size={24} />}
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
        </div>
      </div>
    </div>
  )
}
