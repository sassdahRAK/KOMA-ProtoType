import { Link } from 'react-router-dom'
import { EMERGENCY } from '../lib/data.js'
import { useI18n } from '../lib/i18n.jsx'
import { PageHeader, SafetyStripe, Tag } from '../components/ui.jsx'
import { IconDoctor, IconMap } from '../components/icons.jsx'
import Boundaries from '../components/safety/Boundaries.jsx'
import ProvenanceTable from '../components/safety/ProvenanceTable.jsx'
import DataPolicy from '../components/safety/DataPolicy.jsx'
import FeedbackForm from '../components/safety/FeedbackForm.jsx'

export default function Safety() {
  const { t, tl } = useI18n()

  return (
    <div className="space-y-10 sm:space-y-12">
      <PageHeader
        eyebrow={tl({ km: 'KOMA · សុវត្ថិភាព', en: 'KOMA · SAFETY' })}
        title={tl({
          km: 'អ្វីដែល KOMA ជាអ្វី និងអ្វីដែលវាមិនមែន',
          en: 'What KOMA is — and what it is not',
        })}
        lead={tl({
          km: 'KOMA គឺជាគំរូអប់រំសម្រាប់មាតាបិតា។ ព្រំដែនទាំងនេះជាផ្នែកនៃផលិតផល មិនមែនជាអក្សរតូចនៅខាងក្រោមទេ។',
          en: 'KOMA is an educational prototype for parents. These boundaries are part of the product, not fine print.',
        })}
        aside={
          <Tag tone="saffron">
            {tl({ km: 'គំរូអប់រំ', en: 'Educational prototype' })}
          </Tag>
        }
      />

      <Boundaries />

      {/* ---------------- Urgent guidance ---------------- */}
      <section
        className="space-y-4"
        aria-label={tl({ km: 'ការណែនាំស្ថានភាពបន្ទាន់', en: 'Urgent guidance' })}
      >
        <SafetyStripe tone="clay" title={t('common.urgent')}>
          <p>{tl(EMERGENCY)}</p>
        </SafetyStripe>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/map"
            className="focusable inline-flex min-h-[44px] items-center gap-2 rounded-full border border-clay bg-shell px-4 text-sm font-semibold text-clay-ink transition-colors hover:bg-clay-tint"
          >
            <IconMap size={17} />
            {tl({ km: 'រកមណ្ឌលសុខភាពនៅជិតអ្នក', en: 'Find a facility near you' })}
          </Link>
          <Link
            to="/doctor"
            className="focusable inline-flex min-h-[44px] items-center gap-2 rounded-full border border-clay bg-shell px-4 text-sm font-semibold text-clay-ink transition-colors hover:bg-clay-tint"
          >
            <IconDoctor size={17} />
            {tl({ km: 'មើលបញ្ជីវេជ្ជបណ្ឌិត', en: 'Doctor directory' })}
          </Link>
        </div>

        <p className="font-mono text-[11px] leading-relaxed text-ink-faint">
          {tl({
            km: 'គ្មានលេខទូរស័ព្ទត្រូវបានផ្ទៀងផ្ទាត់សម្រាប់គំរូនេះទេ។',
            en: 'No phone number is verified for this prototype.',
          })}
        </p>

        <p className="measure text-sm leading-relaxed text-ink-soft">
          {tl({
            km: 'KOMA មិនដែលសម្រេចថាកុមារមានសុវត្ថិភាពទេ។ ប្រសិនបើអ្នកមិនប្រាកដ សូមទៅរកការថែទាំឱ្យបានឆាប់ ជាជាងរង់ចាំនៅផ្ទះ។',
            en: 'KOMA never decides that a child is safe. If you are unsure, seek care early rather than waiting at home.',
          })}
        </p>
      </section>

      <ProvenanceTable />
      <DataPolicy />
      <FeedbackForm />
    </div>
  )
}
