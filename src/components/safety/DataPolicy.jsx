import { useI18n } from '../../lib/i18n.jsx'
import { SafetyStripe, SectionHeading } from '../ui.jsx'
import {
  IconCheck,
  IconClose,
  IconGlobe,
  IconPin,
  IconShield,
  IconSource,
} from '../icons.jsx'

const RULES = [
  {
    Icon: IconSource,
    text: {
      km: 'កំណត់ត្រាគំរូបង្ហាញស្លាក DEMO ដើម្បីឱ្យអ្នកដឹងច្បាស់ថាកំពុងអានអ្វី។',
      en: 'Demo records show a DEMO label so you always know what you are reading.',
    },
  },
  {
    Icon: IconPin,
    text: {
      km: 'ប្រសិនបើលេខទូរស័ព្ទ ឬកូអរដោនេមិនមាន វានៅទទេ — KOMA មិនបង្កើតវាឡើងទេ។',
      en: 'If a phone number or coordinate is missing it stays empty — KOMA does not invent one.',
    },
  },
  {
    Icon: IconShield,
    text: {
      km: 'យើងមិនសុំឈ្មោះកូន លេខសម្គាល់ ឬអាសយដ្ឋានពិតប្រាកដរបស់អ្នកទេ។',
      en: "We do not ask for your child's name, ID or exact address.",
    },
  },
  {
    Icon: IconClose,
    text: {
      km: 'យើងមិនរក្សាទុករូបថត ឬវីដេអូទេ។',
      en: 'We do not store photos or videos.',
    },
  },
  {
    Icon: IconGlobe,
    text: {
      km: 'ការសន្ទនាមិនត្រូវបានផ្ញើទៅអ្នកផ្តល់សេវា AI ណាមួយក្នុងគំរូនេះទេ — ចម្លើយមកពីឈុតដែលបានពិនិត្យរួច។',
      en: 'Conversations are not sent to any AI provider in this prototype — answers come from a fixed reviewed set.',
    },
  },
  {
    Icon: IconCheck,
    text: {
      km: 'មតិយោបល់មិនបង្ហាញឈ្មោះ ហើយរក្សាទុកក្នុងកម្មវិធីរុករករបស់អ្នកតែប៉ុណ្ណោះ (localStorage)។',
      en: 'Feedback is anonymous and stored only in this browser (localStorage).',
    },
  },
]

/** Privacy and demo-data policy for the prototype. */
export default function DataPolicy() {
  const { t, tl } = useI18n()

  return (
    <section
      className="space-y-5"
      aria-label={tl({ km: 'គោលការណ៍ទិន្នន័យ និងភាពឯកជន', en: 'Data and privacy' })}
    >
      <SectionHeading
        eyebrow={tl({ km: 'ទិន្នន័យ', en: 'Data' })}
        title={tl({
          km: 'គោលការណ៍ទិន្នន័យ និងភាពឯកជន',
          en: 'Data and privacy',
        })}
        lead={tl({
          km: 'គំរូនេះរក្សាទុកទិន្នន័យតិចតួចបំផុត ហើយរក្សាទុកក្នុងកម្មវិធីរុករករបស់អ្នកតែប៉ុណ្ណោះ។',
          en: 'This prototype keeps data to a minimum and stores it only in your browser.',
        })}
      />

      <ul className="card divide-y divide-line">
        {RULES.map((rule) => {
          const { Icon } = rule
          return (
            <li key={rule.text.en} className="flex items-start gap-3 p-4 sm:p-5">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-teal-50 text-teal-600">
                <Icon size={17} />
              </span>
              <span className="min-w-0 text-sm leading-relaxed text-ink-soft">
                {tl(rule.text)}
              </span>
            </li>
          )
        })}
      </ul>

      <SafetyStripe
        tone="saffron"
        title={tl({ km: 'ទិន្នន័យគំរូ', en: 'Demo data' })}
      >
        {t('common.demoNotice')}{' '}
        {tl({
          km: 'ការប្រើប្រាស់ជាក់ស្តែងត្រូវការការពិនិត្យផ្នែកគ្លីនិក។',
          en: 'Real-world use would require clinical review.',
        })}
      </SafetyStripe>
    </section>
  )
}
