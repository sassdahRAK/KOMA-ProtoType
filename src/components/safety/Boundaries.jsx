import { useI18n } from '../../lib/i18n.jsx'
import { SectionHeading } from '../ui.jsx'
import { IconCheck, IconClose } from '../icons.jsx'

const DOES = [
  {
    km: 'ពន្យល់ប្រធានបទសុខភាពកុមារទូទៅ ជាភាសាខ្មែរ និងអង់គ្លេស',
    en: 'Explains general child-health topics in Khmer and English',
  },
  {
    km: 'បង្ហាញប្រភពដែលបានពិនិត្យ និងកាលបរិច្ឆេទពិនិត្យចុងក្រោយ',
    en: 'Shows the reviewed source and last-checked date',
  },
  {
    km: 'ជួយអ្នករកមណ្ឌលសុខភាពដែលមានក្នុងបញ្ជី',
    en: 'Helps you locate listed facilities',
  },
  {
    km: 'បង្ហាញព័ត៌មានយោងអំពីឱសថ',
    en: 'Shows reference medicine information',
  },
  {
    km: 'ចង្អុលបង្ហាញអ្នកទៅវេជ្ជបណ្ឌិត ឬមណ្ឌលសុខភាព',
    en: 'Points you to a doctor or facility',
  },
]

const DOES_NOT = [
  { km: 'មិនមែនជាវេជ្ជបណ្ឌិត', en: 'Not a doctor' },
  {
    km: 'មិនមែនជាឧបករណ៍ធ្វើរោគវិនិច្ឆ័យ',
    en: 'Not a diagnostic tool',
  },
  {
    km: 'មិនមែនជាប្រភពបរិមាណថ្នាំ ឬវេជ្ជបញ្ជា',
    en: 'Not a source of dosage or prescribing',
  },
  { km: 'មិនមែនជាសេវាសង្គ្រោះបន្ទាន់', en: 'Not an emergency service' },
  {
    km: 'មិនមែនជាការពិគ្រោះផ្ទាល់ជាមួយគ្រូពេទ្យ',
    en: 'Not a live consultation with a clinician',
  },
  {
    km: 'មិនធានាថាមណ្ឌលសុខភាពបើកទ្វារ',
    en: 'Not a guarantee that a facility is open',
  },
]

function BoundaryList({ title, items, tone }) {
  const { tl } = useI18n()
  const isYes = tone === 'yes'
  const Icon = isYes ? IconCheck : IconClose

  return (
    <div
      className={
        'card border-l-4 p-5 ' + (isYes ? 'border-l-teal' : 'border-l-pine')
      }
    >
      <h3 className="flex items-center gap-2.5 font-display text-lg font-semibold text-ink">
        <span
          className={
            'flex h-8 w-8 flex-none items-center justify-center rounded-full ' +
            (isYes ? 'bg-teal-50 text-teal-600' : 'bg-paper-deep text-ink-soft')
          }
        >
          <Icon size={17} strokeWidth={2.25} />
        </span>
        {tl(title)}
      </h3>

      <ul className="mt-4 space-y-3">
        {items.map((item) => {
          return (
            <li key={item.en} className="flex items-start gap-2.5">
              <Icon
                size={16}
                strokeWidth={2.25}
                className={
                  'mt-0.5 flex-none ' +
                  (isYes ? 'text-teal-600' : 'text-ink-faint')
                }
              />
              <span className="min-w-0">
                <span className="block text-sm font-medium leading-relaxed text-ink">
                  {tl(item)}
                </span>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** Two contrasted lists: what KOMA does, and what it deliberately does not. */
export default function Boundaries() {
  const { tl } = useI18n()

  return (
    <section
      className="space-y-5"
      aria-label={tl({ km: 'ព្រំដែនរបស់ KOMA', en: 'KOMA boundaries' })}
    >
      <SectionHeading
        eyebrow={tl({ km: 'ព្រំដែន', en: 'Boundaries' })}
        title={tl({
          km: 'KOMA ធ្វើអ្វី និងមិនធ្វើអ្វី',
          en: 'What KOMA does — and does not',
        })}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <BoundaryList
          tone="yes"
          title={{ km: 'KOMA ធ្វើ', en: 'KOMA does' }}
          items={DOES}
        />
        <BoundaryList
          tone="no"
          title={{ km: 'KOMA មិនធ្វើ', en: 'KOMA does not' }}
          items={DOES_NOT}
        />
      </div>
    </section>
  )
}
