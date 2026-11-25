import { useI18n } from '../../lib/i18n.jsx'
import { DemoBadge, Provenance, Tag, VerifiedBadge } from '../ui.jsx'
import { IconChevron, IconMap } from '../icons.jsx'
import Monogram from './Monogram.jsx'
import PhoneAction from './PhoneAction.jsx'
import COPY from './copy.js'
import { doctorInitials, facilityFor, specialtyFor } from './helpers.js'

function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}

/**
 * One directory result.
 *
 * The card body is readable markup (heading, facility, provenance) with a real
 * full-card <button> laid over it for keyboard/touch selection. The phone
 * action sits above that overlay so the tel: link stays independently usable
 * and nothing interactive is nested inside another control.
 *
 * Verified records carry a teal rule and a VerifiedBadge; DEMO records carry a
 * saffron rule and a DEMO badge, so status is never colour-only.
 */
export default function DoctorCard({ doctor, selected = false, onSelect }) {
  const { t, tl, lang } = useI18n()
  const verified = doctor.status === 'verified'
  const facility = facilityFor(doctor.facilityId)
  const specialty = specialtyFor(doctor)

  return (
    <li data-doctor-id={doctor.id} className="relative">
      <article
        className={cx(
          'card min-w-0 overflow-hidden border-l-4 transition-shadow',
          verified ? 'border-l-teal' : 'border-l-saffron',
          selected
            ? 'ring-2 ring-teal ring-offset-2 ring-offset-paper'
            : 'hover:bg-teal-50/40',
        )}
      >
        <div className="p-4 pl-5 sm:p-5 sm:pl-6">
          <div className="flex items-start gap-3">
            <Monogram initials={doctorInitials(doctor, lang)} size="md" />

            <div className="min-w-0 flex-1">
              <h3
                lang={lang}
                className={cx(
                  'break-words text-[17px] font-semibold leading-snug text-ink',
                  lang === 'km' ? 'font-khmer' : '',
                )}
              >
                {lang === 'km' ? doctor.nameKm : doctor.nameEn}
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Tag tone="teal">{tl(specialty)}</Tag>
                {verified ? (
                  <VerifiedBadge date={doctor.verifiedAt} />
                ) : (
                  <DemoBadge label={t('common.demo')} />
                )}
              </div>

              <div className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed">
                <IconMap size={14} className="mt-0.5 flex-none text-ink-faint" />
                {facility ? (
                  <span
                    lang={lang}
                    className={cx(
                      'min-w-0 break-words text-[13px] font-medium text-ink-soft',
                      lang === 'km' ? 'font-khmer' : '',
                    )}
                  >
                    {lang === 'km' ? facility.nameKm : facility.nameEn}
                  </span>
                ) : (
                  <span className="text-ink-faint">{tl(COPY.facilityMissing)}</span>
                )}
              </div>
            </div>

            <IconChevron
              size={18}
              className={cx(
                'mt-1 flex-none',
                selected ? 'text-teal-600' : 'text-ink-faint',
              )}
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
            <PhoneAction doctor={doctor} className="relative z-10" />
            <Provenance
              className="min-w-0"
              sourceId={doctor.sourceId}
              checkedAt={doctor.verifiedAt}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelect(doctor.id)}
          aria-label={`${doctor.nameKm} — ${doctor.nameEn}, ${tl(specialty)}`}
          aria-current={selected ? 'true' : undefined}
          aria-pressed={selected}
          className="focusable absolute inset-0 z-[1] rounded-[22px]"
        />
      </article>
    </li>
  )
}
