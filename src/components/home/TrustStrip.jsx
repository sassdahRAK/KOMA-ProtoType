import { Link } from 'react-router-dom'
import {
  DOCTORS,
  FACILITIES,
  KNOWLEDGE,
  MEDICINES,
  SOURCES,
} from '../../lib/data.js'
import { useI18n } from '../../lib/i18n.jsx'
import {
  DemoBadge,
  Provenance,
  SafetyStripe,
  SectionHeading,
  VerifiedBadge,
} from '../ui.jsx'
import { IconArrow } from '../icons.jsx'

/**
 * Trust / provenance teaser. Explains VERIFIED vs DEMO with live badges and
 * links through to the Safety page, which owns the full source table.
 */
export default function TrustStrip() {
  const { t, tl } = useI18n()
  const records =
    FACILITIES.length + MEDICINES.length + DOCTORS.length + KNOWLEDGE.length
  const exampleSource =
    SOURCES.find((source) => source.status === 'verified') || SOURCES[0]

  return (
    <section
      className="space-y-5"
      aria-label={tl({ km: 'ទុកចិត្ត និងប្រភព', en: 'Trust and provenance' })}
    >
      <SectionHeading
        eyebrow={tl({ km: 'ទុកចិត្ត', en: 'Trust' })}
        title={tl({
          km: 'រាល់ព័ត៌មានមានប្រភព និងកាលបរិច្ឆេទ',
          en: 'Every fact carries a source and a date',
        })}
        lead={tl({
          km: 'តួអង្គពណ៌បៃតងបង្ហាញកំណត់ត្រាដែលបានផ្ទៀងផ្ទាត់ ហើយស្លាក DEMO បង្ហាញទិន្នន័យគំរូដែលមិនទាន់ផ្ទៀងផ្ទាត់។',
          en: 'A teal badge marks verified records; a DEMO label marks sample data that has not been verified.',
        })}
      />

      <div className="card grid gap-6 p-5 sm:p-6 md:grid-cols-[1.35fr_1fr] md:items-center">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <VerifiedBadge date={exampleSource?.accessedAt} />
            <DemoBadge label={t('common.demo')} />
          </div>

          <p className="measure text-sm leading-relaxed text-ink-soft">
            {tl({
              km: 'យើងបង្ហាញប្រភពជាសាធារណៈ និងកាលបរិច្ឆេទដែលព័ត៌មានត្រូវបានពិនិត្យ។ ប្រសិនបើតម្លៃណាមួយមិនត្រូវបានដឹង វានៅទទេ ហើយមិនត្រូវបានបង្កើតឡើងទេ។',
              en: 'We show public sources and the date each record was checked. If a value is unknown it stays empty — it is never invented.',
            })}
          </p>

          <Provenance
            sourceId={exampleSource?.id}
            checkedAt={exampleSource?.accessedAt}
          />

          <Link
            to="/safety"
            className="focusable inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-1 text-sm font-semibold text-teal-600 hover:underline"
          >
            {tl({
              km: 'មើលសុវត្ថិភាព និងប្រភពទាំងអស់',
              en: 'See safety and all sources',
            })}
            <IconArrow size={15} />
          </Link>
        </div>

        <dl className="grid grid-cols-2 gap-3 rounded-2xl border border-line bg-paper-deep/50 p-4">
          <div className="min-w-0">
            <dt className="mono-label">{tl({ km: 'ប្រភព', en: 'Sources' })}</dt>
            <dd className="mt-1 font-mono text-2xl font-semibold leading-none text-pine">
              {SOURCES.length}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="mono-label">
              {tl({ km: 'កំណត់ត្រាអប់រំ', en: 'Records' })}
            </dt>
            <dd className="mt-1 font-mono text-2xl font-semibold leading-none text-pine">
              {records}
            </dd>
          </div>
        </dl>
      </div>

      <SafetyStripe
        tone="saffron"
        title={tl({ km: 'ការរំលឹក', en: 'A reminder' })}
      >
        {t('common.notMedicalAdvice')}{' '}
        <Link to="/safety" className="font-semibold">
          {t('nav.safety')}
        </Link>
      </SafetyStripe>
    </section>
  )
}
