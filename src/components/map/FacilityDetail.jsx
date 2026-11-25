import { Button, DemoBadge, Provenance, Tag, VerifiedBadge } from '../ui.jsx'
import { IconClose, IconPhone, IconPin } from '../icons.jsx'
import { useI18n } from '../../lib/i18n.jsx'
import {
  facilityTypeLabel,
  formatCoords,
  provinceLabel,
  serviceLabel,
  telHref,
} from './constants.js'

/** Compact contact block for the facility selected from the list or map. */
export default function FacilityDetail({ facility, onClear }) {
  const { t, tl, isKm } = useI18n()

  if (!facility) {
    return (
      <div className="mt-4 rounded-2xl border border-dashed border-line bg-shell/70 px-4 py-4 text-sm leading-relaxed text-ink-soft">
        <p className="flex items-center gap-2 font-semibold text-ink">
          <IconPin size={16} className="text-teal" />
          {tl({ km: 'ជ្រើសរើសមណ្ឌលមួយ', en: 'Select a facility' })}
        </p>
        <p className="mt-1">
          {tl({
            km: 'ចុចលើកាត ឬម្ជុលលើផែនទី ដើម្បីមើលព័ត៌មានទំនាក់ទំនងនៅទីនេះ។',
            en: 'Choose a card or a map pin to see its contact details here.',
          })}
        </p>
      </div>
    )
  }

  const type = facilityTypeLabel(facility.facilityType)
  const coords = formatCoords(facility.lat, facility.lng)
  const tel = telHref(facility.phone)
  const verified = facility.status === 'verified'

  return (
    <section
      aria-labelledby="map-selected-heading"
      className="mt-4 rounded-2xl border border-line bg-shell p-4 shadow-lift sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mono-label">
            {tl({ km: 'កំណត់ត្រាដែលបានជ្រើស', en: 'Selected record' })}
          </p>
          <h3
            id="map-selected-heading"
            className="mt-1 break-words font-display text-lg font-semibold leading-snug text-ink"
          >
            {isKm ? facility.nameKm : facility.nameEn}
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          aria-label={t('common.close')}
          className="h-11 w-11 flex-none px-0"
        >
          <IconClose size={16} />
        </Button>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Tag tone={verified ? 'teal' : 'neutral'}>{tl(type)}</Tag>
        {verified ? (
          <VerifiedBadge date={facility.verifiedAt} />
        ) : (
          <DemoBadge />
        )}
      </div>

      <div className="mt-3 space-y-0.5 break-words">
        <p className="text-sm leading-relaxed text-ink-soft">
          {isKm ? facility.addressKm : facility.addressEn}
        </p>
        <p className="pt-1 text-xs text-ink-faint">
          {isKm
            ? `${facility.district} · ${facility.province}`
            : provinceLabel(facility.province).en}
        </p>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
        {tel ? (
          <a
            href={tel}
            className="focusable inline-flex min-h-[44px] items-center gap-2 rounded-full text-sm font-semibold text-teal-600 hover:underline"
          >
            <IconPhone size={16} />
            <span className="font-mono">{facility.phone}</span>
          </a>
        ) : (
          <span className="inline-flex min-h-[44px] items-center gap-2 text-sm text-ink-faint">
            <IconPhone size={16} />
            {tl({ km: 'គ្មានលេខទូរស័ព្ទសាធារណៈ', en: 'No public phone listed' })}
          </span>
        )}

        {coords ? (
          <span className="inline-flex min-h-[44px] items-center gap-2 font-mono text-[11px] text-ink-soft">
            <IconPin size={15} className="text-ink-faint" />
            {coords}
          </span>
        ) : (
          <span className="inline-flex min-h-[44px] items-center gap-2 text-xs text-ink-soft">
            <IconPin size={15} className="text-ink-faint" />
            {tl({
              km: 'គ្មានទីតាំងលើផែនទី — មិនបានកត់ត្រាកូអរដោណេ',
              en: 'No map pin — coordinates not recorded',
            })}
          </span>
        )}
      </div>

      {facility.services?.length ? (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {facility.services.map((service) => (
            <li key={service}>
              <span className="inline-flex items-center rounded-full border border-line bg-paper-deep px-2.5 py-1 text-[11px] font-medium leading-tight text-ink-soft">
                {tl(serviceLabel(service))}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {verified ? null : (
        <p className="mt-3 text-xs leading-relaxed text-saffron-ink">
          {tl({
            km: 'កំណត់ត្រានេះជាទិន្នន័យគំរូ មិនមែនបញ្ជីផ្លូវការទេ។',
            en: 'This record is sample data, not an official listing.',
          })}
        </p>
      )}

      <Provenance
        className="mt-3"
        sourceId={facility.sourceId}
        checkedAt={facility.verifiedAt}
      />
    </section>
  )
}
