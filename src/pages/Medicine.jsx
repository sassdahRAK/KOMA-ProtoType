import { useEffect, useMemo, useRef, useState } from 'react'
import { MEDICINES } from '../lib/data.js'
import { useI18n } from '../lib/i18n.jsx'
import {
  Button,
  Chip,
  DemoBadge,
  EmptyState,
  PageHeader,
  SearchField,
  Tag,
} from '../components/ui.jsx'
import {
  IconBook,
  IconClose,
  IconMedicine,
  IconShield,
} from '../components/icons.jsx'
import NoDosageNotice from '../components/medicine/NoDosageNotice.jsx'
import MedicineListItem from '../components/medicine/MedicineListItem.jsx'
import MedicineDetail from '../components/medicine/MedicineDetail.jsx'
import { categoryLabel } from '../components/medicine/categoryLabel.js'

const COPY = {
  titleKm: 'ព័ត៌មានយោងអំពីឱសថ',
  titleEn: 'Reference medicine information',
  leadKm:
    'បញ្ជីយោងតូចមួយដែលបានពិនិត្យ ដែលពន្យល់ថាឱសថមួយត្រូវប្រើសម្រាប់អ្វីជាទូទៅ និងការព្រមានរបស់វា។ វាមិនប្រាប់អ្នកថាត្រូវផ្តល់ប៉ុន្មានដល់កុមារទេ។',
  leadEn:
    'A small reviewed catalogue that explains what a medicine is generally used for and its warnings. It does not tell you how much to give a child.',
  aboutKm:
    'ធាតុទាំងអស់ក្នុងទំព័រនេះជាសេចក្តីសង្ខេបសាកល្បងសម្រាប់គម្រោងគំរូ។ ការដាក់ឱ្យប្រើពិតត្រូវការការពិនិត្យផ្នែកគ្លីនិកដោយអ្នកជំនាញសម្រាប់ធាតុនីមួយៗ។',
  aboutEn:
    'Every entry here is a demo summary for a prototype. A real deployment needs qualified clinical review of each entry.',
  emptyKm: 'រកមិនឃើញឱសថដែលត្រូវនឹងការស្វែងរកទេ',
  emptyEn: 'No medicine entries match your search',
  emptyBodyKm:
    'សូមសាកល្បងអក្ខរាវិរុទ្ធផ្សេង ឬកំណត់ឡើងវិញដើម្បីមើលធាតុទាំងអស់។',
  emptyBodyEn:
    'Try a different spelling, or reset to see every reference entry again.',
}

export default function Medicine() {
  const { lang, t, tl } = useI18n()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(null)
  const [selectedId, setSelectedId] = useState(MEDICINES[0]?.id ?? null)
  const [mobileDetail, setMobileDetail] = useState(false)

  const listRef = useRef(null)
  const detailRef = useRef(null)
  const firstRun = useRef(true)

  const categories = useMemo(
    () =>
      Array.from(
        new Set(MEDICINES.map((medicine) => medicine.category).filter(Boolean)),
      ),
    [],
  )

  const normalizedQuery = query.trim().toLowerCase()

  const filtered = useMemo(() => {
    return MEDICINES.filter((medicine) => {
      if (category && medicine.category !== category) return false
      if (!normalizedQuery) return true
      return [medicine.nameKm, medicine.nameEn, medicine.activeIngredient].some(
        (value) =>
          String(value || '')
            .toLowerCase()
            .includes(normalizedQuery),
      )
    })
  }, [category, normalizedQuery])

  const selected = useMemo(
    () =>
      filtered.find((medicine) => medicine.id === selectedId) ||
      filtered[0] ||
      null,
    [filtered, selectedId],
  )

  const hasFilters = normalizedQuery.length > 0 || category !== null

  const resetAll = () => {
    setQuery('')
    setCategory(null)
    setSelectedId(MEDICINES[0]?.id ?? null)
    setMobileDetail(false)
  }

  const selectMedicine = (id) => {
    setSelectedId(id)
    setMobileDetail(true)
  }

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    const isNarrow =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(max-width: 1023px)').matches
    if (!isNarrow) return
    const target = mobileDetail ? detailRef.current : listRef.current
    if (target) target.focus({ preventScroll: true })
  }, [mobileDetail])

  return (
    <div className="space-y-6 sm:space-y-7">
      <PageHeader
        eyebrow={tl({ km: 'ឱសថ', en: 'MEDICINE' })}
        title={
          <span className="block [overflow-wrap:anywhere]">
            {tl({ km: COPY.titleKm, en: COPY.titleEn })}
          </span>
        }
        lead={
          <>
            {tl({ km: COPY.leadKm, en: COPY.leadEn })}
            <span className="mt-3 flex items-start gap-1.5 text-[13px] leading-relaxed text-ink-faint">
              <IconShield size={14} className="mt-0.5 flex-none" />
              <span>{t('common.notMedicalAdvice')}</span>
            </span>
          </>
        }
        aside={
          <div className="flex flex-wrap items-center gap-2">
            <DemoBadge label={t('common.demo')} />
            <Tag tone="mint">
              {MEDICINES.length}{' '}
              {tl({ km: 'ធាតុយោង', en: 'reference entries' })}
            </Tag>
          </div>
        }
      />

      <NoDosageNotice variant="page" />

      <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[13px] leading-relaxed text-ink-soft">
        <span className="mono-label">
          {tl({ km: 'របៀបអានទំព័រនេះ', en: 'How to read this page' })}
        </span>
        <span className="min-w-0 flex-1">
          {tl({
            km: 'ប្រភព កាលបរិច្ឆេទពិនិត្យឡើងវិញ និងការព្រមាន មកពីបញ្ជីឱសថគំរូ។ អវត្តមាននៃផ្នែកបរិមាណ គឺជាចេតនា។',
            en: 'Source, review date and warnings come from the demo catalogue. The absence of an amount section is deliberate.',
          })}
        </span>
      </p>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-8">
        <section
          ref={listRef}
          tabIndex={-1}
          aria-labelledby="medicine-list-heading"
          className={[
            'card min-w-0 p-4 outline-none sm:p-5',
            mobileDetail ? 'hidden lg:block' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div className="flex items-center justify-between gap-3">
            <h2
              id="medicine-list-heading"
              className="font-display text-lg font-semibold leading-snug text-ink"
            >
              {tl({ km: 'បញ្ជីឱសថ', en: 'Medicine entries' })}
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
              {filtered.length}/{MEDICINES.length}
            </span>
          </div>

          <SearchField
            className="mt-3"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery('')}
            label={tl({
              km: 'ស្វែងរកឱសថតាមឈ្មោះ ឬសារធាតុសកម្ម',
              en: 'Search medicines by name or active ingredient',
            })}
            placeholder={tl({
              km: 'ឈ្មោះខ្មែរ ឬអង់គ្លេស…',
              en: 'Khmer or English name…',
            })}
          />

          <div
            role="group"
            aria-label={tl({
              km: 'តម្រងតាមប្រភេទ',
              en: 'Filter by category',
            })}
            className="mt-3 flex flex-wrap gap-2"
          >
            <Chip active={category === null} onClick={() => setCategory(null)}>
              {t('common.all')}
            </Chip>
            {categories.map((item) => (
              <Chip
                key={item}
                active={category === item}
                onClick={() => setCategory(item)}
              >
                {categoryLabel(item, lang)}
              </Chip>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p
              role="status"
              aria-live="polite"
              className="text-xs leading-relaxed text-ink-faint"
            >
              {t('common.showing')} {filtered.length} / {MEDICINES.length}{' '}
              {t('common.results')}
            </p>
            {hasFilters ? (
              <button
                type="button"
                onClick={resetAll}
                className="focusable inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-2 text-xs font-semibold text-teal-600 transition-colors hover:bg-teal-50"
              >
                <IconClose size={14} />
                {t('common.reset')}
              </button>
            ) : null}
          </div>

          {filtered.length ? (
            <ul className="mt-2 space-y-2">
              {filtered.map((medicine) => (
                <MedicineListItem
                  key={medicine.id}
                  medicine={medicine}
                  selected={medicine.id === selected?.id}
                  onSelect={() => selectMedicine(medicine.id)}
                />
              ))}
            </ul>
          ) : (
            <EmptyState
              className="mt-4"
              icon={<IconMedicine size={24} />}
              title={tl({ km: COPY.emptyKm, en: COPY.emptyEn })}
              body={tl({ km: COPY.emptyBodyKm, en: COPY.emptyBodyEn })}
              action={
                <Button variant="secondary" size="sm" onClick={resetAll}>
                  {t('common.reset')}
                </Button>
              }
            />
          )}
        </section>

        <div
          ref={detailRef}
          tabIndex={-1}
          className={[
            'min-w-0 outline-none lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:pr-1',
            mobileDetail ? '' : 'hidden lg:block',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {selected ? (
            <MedicineDetail
              medicine={selected}
              onBack={() => setMobileDetail(false)}
            />
          ) : (
            <div className="card flex min-h-[260px] flex-col items-center justify-center px-6 py-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                <IconBook size={24} />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold text-ink">
                {tl({ km: 'គ្មានធាតុត្រូវបានជ្រើសរើស', en: 'No entry selected' })}
              </h2>
              <p className="measure mt-2 text-sm leading-relaxed text-ink-soft">
                {tl({
                  km: 'សូមកែតម្រង ឬស្វែងរកម្តងទៀត ដើម្បីជ្រើសរើសឱសថមួយ។',
                  en: 'Adjust the filters or search again to choose a medicine entry.',
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      <section
        aria-labelledby="medicine-about"
        className="card min-w-0 px-4 py-4 sm:px-5"
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-shell text-teal-600">
            <IconBook size={16} />
          </span>
          <div className="min-w-0">
            <h2
              id="medicine-about"
              className="font-display text-base font-semibold leading-snug text-ink"
            >
              {tl({ km: 'ស្តីពីព័ត៌មាននេះ', en: 'About this information' })}
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
              {tl({ km: COPY.aboutKm, en: COPY.aboutEn })}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
