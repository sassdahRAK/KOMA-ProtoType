import { DemoBadge, Provenance, Tag, VerifiedBadge } from '../ui.jsx'
import {
  IconDoctor,
  IconMap,
  IconPhone,
  IconPin,
  IconShield,
} from '../icons.jsx'
import { useI18n } from '../../lib/i18n.jsx'
import {
  facilityTypeLabel,
  formatCoords,
  provinceLabel,
  serviceLabel,
  telHref,
} from './constants.js'

function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}

const TYPE_ICON = {
  hospital: IconShield,
  'health-center': IconMap,
  clinic: IconDoctor,
}

/**
 * One facility record in the directory list.
 *
 * The visible content stays readable markup (heading, address, a real tel:
 * link, provenance). The whole card is selectable through an absolutely
 * positioned but real <button>, so keyboard users get one clear target while
 * the phone link stays independently operable above the overlay.
 */
export default function FacilityCard({
  facility,
  selected = false,
  highlighted = false,
  onSelect,
  onHover,
  innerRef,
}) {
  const { tl, isKm } = useI18n()
  const type = facilityTypeLabel(facility.facilityType)
  const TypeIcon = TYPE_ICON[facility.facilityType] || IconPin
  const coords = formatCoords(facility.lat, facility.lng)
  const tel = telHref(facility.phone)
  const verified = facility.status === 'verified'
  const services = Array.isArray(facility.services) ? facility.services : []
  const shownServices = services.slice(0, 3)
  const extraServices = services.length - shownServices.length

  return (
    <li
      ref={innerRef}
      data-facility-id={facility.id}
      onMouseEnter={() => {
        if (typeof onHover === 'function') onHover(facility.id)
      }}
      onMouseLeave={() => {
        if (typeof onHover === 'function') onHover(null)
      }}
      className={cx(
        'group relative overflow-hidden rounded-[22px] border bg-shell shadow-lift transition-colors',
        verified ? 'border-teal/40' : 'border-line',
        highlighted && !selected ? 'border-teal/50 bg-teal-50/50' : '',
        selected
          ? 'border-teal/60 ring-2 ring-teal ring-offset-2 ring-offset-paper'
          : 'hover:border-teal/35',
      )}
    >
      <span
        aria-hidden="true"
        className={cx(
          'absolute inset-y-0 left-0 w-1',
          verified ? 'bg-teal' : 'bg-saffron/70',
        )}
      />

      <div className="p-4 pl-5 sm:p-5 sm:pl-6">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cx(
              'flex h-7 w-7 flex-none items-center justify-center rounded-full',
              verified ? 'bg-teal-50 text-teal-600' : 'bg-paper-deep text-ink-soft',
            )}
          >
            <TypeIcon size={15} />
          </span>
          <Tag tone={verified ? 'teal' : 'neutral'}>{tl(type)}</Tag>
          {verified ? (
            <VerifiedBadge date={facility.verifiedAt} />
          ) : (
            <DemoBadge />
          )}
          {selected ? (
            <span className="ml-auto font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-teal-600">
              {tl({ km: 'បានជ្រើស', en: 'Selected' })}
            </span>
          ) : null}
        </div>

        <h3 className="mt-3 break-words font-display text-lg font-semibold leading-snug text-ink">
          {isKm ? facility.nameKm : facility.nameEn}
        </h3>

        <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs leading-relaxed text-ink-faint">
          <IconPin size={14} className="flex-none" />
          {isKm ? (
            <>
              <span className="font-semibold text-ink-soft">{facility.district}</span>
              <span aria-hidden="true">·</span>
              <span>{facility.province}</span>
            </>
          ) : (
            <span className="font-semibold text-ink-soft">
              {provinceLabel(facility.province).en}
            </span>
          )}
        </p>

        <div className="mt-2 break-words">
          <p className="text-sm leading-relaxed text-ink-soft">
            {isKm ? facility.addressKm : facility.addressEn}
          </p>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          {tel ? (
            <a
              href={tel}
              className="focusable relative z-10 inline-flex min-h-[44px] items-center gap-2 rounded-full text-sm font-semibold text-teal-600 hover:underline"
            >
              <IconPhone size={16} />
              <span className="break-all font-mono">{facility.phone}</span>
            </a>
          ) : (
            <span className="inline-flex min-h-[44px] items-center gap-2 text-sm text-ink-faint">
              <IconPhone size={16} className="flex-none" />
              <span aria-hidden="true">—</span>
              <span className="sr-only">
                {tl({
                  km: 'មិនមានលេខទូរស័ព្ទសាធារណៈ',
                  en: 'No public phone number recorded',
                })}
              </span>
            </span>
          )}

          {coords ? (
            <span className="inline-flex min-h-[44px] items-center gap-2 font-mono text-[11px] text-ink-soft">
              <IconPin size={15} className="flex-none text-ink-faint" />
              <span className="break-all">{coords}</span>
            </span>
          ) : null}
        </div>

        {coords ? null : (
          <p className="flex items-start gap-2 rounded-xl border border-dashed border-line bg-paper-deep/70 px-3 py-2 text-xs leading-relaxed text-ink-soft">
            <IconPin size={15} className="mt-0.5 flex-none text-ink-faint" />
            <span>
              <span className="font-semibold text-ink">
                {tl({ km: 'គ្មានកូដទីតាំង', en: 'No map pin' })}
              </span>
              {' — '}
              {tl({
                km: 'មិនបានកត់ត្រាកូអរដោណេ',
                en: 'coordinates not recorded',
              })}
            </span>
          </p>
        )}

        {shownServices.length ? (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {shownServices.map((service) => (
              <li key={service}>
                <span className="inline-flex items-center rounded-full border border-line bg-paper-deep px-2.5 py-1 text-[11px] font-medium leading-tight text-ink-soft">
                  {tl(serviceLabel(service))}
                </span>
              </li>
            ))}
            {extraServices > 0 ? (
              <li>
                <span className="inline-flex items-center rounded-full border border-line bg-shell px-2.5 py-1 font-mono text-[11px] font-medium leading-tight text-ink-faint">
                  +{extraServices}
                </span>
              </li>
            ) : null}
          </ul>
        ) : null}

        <Provenance
          className="mt-3"
          sourceId={facility.sourceId}
          checkedAt={facility.verifiedAt}
        />
      </div>

      <button
        type="button"
        onClick={() => {
          if (typeof onSelect === 'function') onSelect(facility.id)
        }}
        aria-label={`${facility.nameKm} — ${facility.nameEn}, ${tl(type)}`}
        aria-pressed={Boolean(selected)}
        aria-current={selected ? 'true' : undefined}
        className="focusable absolute inset-0 z-[1] rounded-[22px]"
      />
    </li>
  )
}
