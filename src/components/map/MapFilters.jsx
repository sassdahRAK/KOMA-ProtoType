import { Chip, Field, SearchField } from '../ui.jsx'
import { IconChevron, IconFilter } from '../icons.jsx'
import { PROVINCES } from '../../lib/data.js'
import { useI18n } from '../../lib/i18n.jsx'
import { FACILITY_TYPE_OPTIONS, provinceLabel } from './constants.js'

/** Search, province and facility-type controls for the directory. */
export default function MapFilters({
  query,
  onQuery,
  province,
  onProvince,
  type,
  onType,
}) {
  const { tl, isKm } = useI18n()
  const provinceId = 'map-province'
  const knownProvince = PROVINCES.includes(province) ? province : ''

  return (
    <div className="card p-3.5 sm:p-4">
      <div className="lg:flex lg:flex-wrap lg:items-end lg:gap-3">
        <div className="min-w-0 lg:min-w-[15rem] lg:flex-1">
          <SearchField
            label={tl({
              km: 'ស្វែងរកតាមឈ្មោះ ស្រុក ឬខេត្ត',
              en: 'Search by name, district or province',
            })}
            placeholder={tl({
              km: 'ស្វែងរកមណ្ឌល…',
              en: 'Search facilities…',
            })}
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            onClear={() => onQuery('')}
          />
        </div>

        <div className="mt-3 min-w-0 lg:mt-0 lg:w-[13.5rem] lg:flex-none">
          <Field
            label={tl({ km: 'ខេត្ត / រាជធានី', en: 'Province' })}
            htmlFor={provinceId}
          >
            <div className="relative">
              <select
                id={provinceId}
                value={knownProvince}
                onChange={(event) => onProvince(event.target.value)}
                className="focusable h-12 w-full appearance-none rounded-xl border border-line bg-shell px-3.5 pr-10 text-[15px] text-ink"
              >
                <option value="">
                  {tl({ km: 'គ្រប់ខេត្ត', en: 'All provinces' })}
                </option>
                {PROVINCES.map((item) => (
                  <option key={item} value={item}>
                    {isKm ? item : provinceLabel(item).en}
                  </option>
                ))}
              </select>
              <IconChevron
                size={16}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 rotate-90 text-ink-faint"
              />
            </div>
          </Field>
        </div>

        <div className="mt-3 min-w-0 lg:mt-0 lg:basis-full">
          <p
            id="map-type-label"
            className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-ink"
          >
            <IconFilter size={14} className="text-teal" />
            {tl({ km: 'ប្រភេទមណ្ឌល', en: 'Facility type' })}
          </p>
          <div
            role="group"
            aria-labelledby="map-type-label"
            className="flex flex-wrap gap-2"
          >
            {FACILITY_TYPE_OPTIONS.map((option) => {
              const active = type === option.id
              return (
                <Chip
                  key={option.id}
                  active={active}
                  onClick={() => onType(option.id)}
                  className="px-3"
                >
                  <span className={isKm ? 'font-khmer' : undefined}>
                    {tl(option)}
                  </span>
                </Chip>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
