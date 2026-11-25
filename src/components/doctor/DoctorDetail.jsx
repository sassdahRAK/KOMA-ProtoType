import { Link } from 'react-router-dom'
import { useI18n } from '../../lib/i18n.jsx'
import {
  Button,
  DemoBadge,
  FeedbackInline,
  Provenance,
  SourceList,
  Tag,
  VerifiedBadge,
} from '../ui.jsx'
import {
  IconAlert,
  IconArrow,
  IconBook,
  IconClose,
  IconMap,
  IconPhone,
  IconShield,
} from '../icons.jsx'
import Monogram from './Monogram.jsx'
import PhoneAction from './PhoneAction.jsx'
import COPY from './copy.js'
import { doctorInitials, facilityFor, specialtyFor } from './helpers.js'

function SectionHeading({ id, icon, children }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-paper-deep text-teal-600">
        {icon}
      </span>
      <h3
        id={id}
        className="font-display text-base font-semibold leading-snug text-ink"
      >
        {children}
      </h3>
    </div>
  )
}

/**
 * Detail panel for one doctor record. The same panel is used in the desktop
 * column and in the inline mobile panel above the results list.
 */
export default function DoctorDetail({ doctor, onClose }) {
  const { t, tl, lang } = useI18n()

  if (!doctor) return null

  const verified = doctor.status === 'verified'
  const facility = facilityFor(doctor.facilityId)
  const specialty = specialtyFor(doctor)

  return (
    <article
      className={[
        'min-w-0 overflow-hidden rounded-[22px] border border-l-4 border-line bg-shell shadow-lift',
        verified ? 'border-l-teal' : 'border-l-saffron',
      ].join(' ')}
    >
      <header className="border-b border-line px-4 pb-5 pt-3 sm:px-6">
        <div className="flex items-center justify-between gap-2 lg:hidden">
          <Button variant="ghost" size="sm" onClick={onClose} className="-ml-2">
            <IconArrow size={16} className="rotate-180" />
            {tl(COPY.backToResults)}
          </Button>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <Monogram initials={doctorInitials(doctor, lang)} size="lg" />
            <div className="min-w-0">
              <p className="mono-label">{tl(COPY.detailEyebrow)}</p>
              <h2
                lang={lang}
                className={[
                  'mt-1 break-words text-[24px] font-semibold leading-tight text-ink sm:text-[27px]',
                  lang === 'km' ? 'font-khmer' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {lang === 'km' ? doctor.nameKm : doctor.nameEn}
              </h2>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label={t('common.close')}
            className="hidden h-11 w-11 flex-none px-0 lg:inline-flex"
          >
            <IconClose size={16} />
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Tag tone="teal">{tl(specialty)}</Tag>
          {verified ? (
            <VerifiedBadge date={doctor.verifiedAt} />
          ) : (
            <DemoBadge label={t('common.demo')} />
          )}
        </div>

        <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-ink-soft">
          <IconMap size={14} className="mt-0.5 flex-none text-ink-faint" />
          {facility ? (
            <span
              lang={lang}
              className={[
                'min-w-0 break-words font-medium',
                lang === 'km' ? 'font-khmer' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {lang === 'km' ? facility.nameKm : facility.nameEn}
            </span>
          ) : (
            <span className="text-ink-faint">{tl(COPY.facilityMissing)}</span>
          )}
        </p>
      </header>

      <div className="space-y-5 px-4 py-5 sm:px-6">
        <section aria-labelledby="doctor-contact-heading">
          <SectionHeading
            id="doctor-contact-heading"
            icon={<IconPhone size={15} />}
          >
            {tl(COPY.contactTitle)}
          </SectionHeading>

          <div className="mt-2">
            <PhoneAction doctor={doctor} size="md" fullWidth />
          </div>

          <div className="mt-2 border-t border-line pt-2">
            {facility ? (
              <Link
                to="/map"
                className="focusable flex min-h-[44px] items-center gap-2.5 rounded-xl px-1 py-1 text-teal-600 transition-colors hover:bg-teal-50"
              >
                <IconMap size={16} className="flex-none" />
                <span className="min-w-0 flex-1">
                  <span
                    lang={lang}
                    className={[
                      'block break-words text-sm font-semibold',
                      lang === 'km' ? 'font-khmer' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {lang === 'km' ? facility.nameKm : facility.nameEn}
                  </span>
                </span>
                <IconArrow size={16} className="flex-none text-ink-faint" />
                <span className="sr-only">— {tl(COPY.viewOnMap)}</span>
              </Link>
            ) : (
              <p className="py-2 text-sm leading-relaxed text-ink-faint">
                {tl(COPY.facilityMissing)}
              </p>
            )}
          </div>
        </section>

        {verified ? null : (
          <p className="flex items-start gap-2 rounded-2xl border border-saffron/40 bg-saffron-tint/70 px-4 py-3 text-sm font-medium leading-relaxed text-saffron-ink">
            <IconAlert size={16} className="mt-0.5 flex-none" />
            <span>{tl(COPY.demoProfile)}</span>
          </p>
        )}

        <section
          role="note"
          aria-labelledby="doctor-directory-notice"
          className="rounded-2xl border border-mint bg-mint/45 px-4 py-3.5"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-shell text-teal-600">
              <IconShield size={16} />
            </span>
            <div className="min-w-0">
              <h3
                id="doctor-directory-notice"
                className="font-display text-sm font-bold leading-snug text-pine"
              >
                {tl(COPY.directoryTitle)}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                {tl(COPY.directoryNotice)}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                {tl(COPY.directoryExtra)}
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="doctor-prepare-heading">
          <SectionHeading id="doctor-prepare-heading" icon={<IconBook size={15} />}>
            {tl(COPY.prepareTitle)}
          </SectionHeading>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
            {tl(COPY.prepareLead)}
          </p>
          <ol className="mt-2 space-y-1.5">
            {COPY.prepare.map((item, index) => (
              <li
                key={item.en}
                className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-soft"
              >
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-teal-50 font-mono text-[11px] font-semibold text-teal-600">
                  {index + 1}
                </span>
                <span>{tl(item)}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <footer className="space-y-3 border-t border-line bg-paper/50 px-4 py-4 sm:px-6">
        <Provenance sourceId={doctor.sourceId} checkedAt={doctor.verifiedAt} />
        <SourceList ids={[doctor.sourceId]} />
        <p className="text-[11px] leading-relaxed text-ink-faint">
          {t('common.notMedicalAdvice')}
        </p>
        <div className="border-t border-line pt-3">
          <FeedbackInline feature="doctor" />
        </div>
      </footer>
    </article>
  )
}
