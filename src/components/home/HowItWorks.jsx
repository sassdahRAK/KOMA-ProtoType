import { useI18n } from '../../lib/i18n.jsx'
import { SectionHeading } from '../ui.jsx'
import { IconArrow, IconAsk, IconSource } from '../icons.jsx'

const STEPS = [
  {
    Icon: IconAsk,
    title: { km: 'សំណួរត្រូវបានផ្គូផ្គង', en: 'Your question is matched' },
    body: {
      km: 'សំណួររបស់អ្នកត្រូវបានផ្គូផ្គងទៅកាន់កំណត់ត្រាអប់រំដែលបានពិនិត្យក្នុង KOMA។',
      en: 'Your question is matched to a reviewed educational note inside KOMA.',
    },
  },
  {
    Icon: IconSource,
    title: { km: 'ចម្លើយមានប្រភព', en: 'The answer carries its source' },
    body: {
      km: 'អ្នកទទួលបានចម្លើយអប់រំ ជាមួយប្រភព និងកាលបរិច្ឆេទពិនិត្យចុងក្រោយ។',
      en: 'You get an educational answer with its source and last-checked date.',
    },
  },
  {
    Icon: IconArrow,
    title: { km: 'សញ្ញាបន្ទាន់ត្រូវបានបញ្ជូនទៅការថែទាំ', en: 'Urgent signs point to care' },
    body: {
      km: 'ប្រសិនបើមានសញ្ញាបន្ទាន់ KOMA ណែនាំឱ្យទៅរកការថែទាំ មិនមែនធានាថាសុវត្ថិភាពទេ។',
      en: 'If signs are urgent, KOMA points you to care rather than reassuring you.',
    },
  },
]

export default function HowItWorks() {
  const { tl } = useI18n()

  return (
    <section
      className="space-y-5"
      aria-label={tl({ km: 'KOMA ឆ្លើយយ៉ាងដូចម្តេច', en: 'How KOMA answers' })}
    >
      <SectionHeading
        eyebrow={tl({ km: 'ដំណើរការ', en: 'How it works' })}
        title={tl({ km: 'KOMA ឆ្លើយយ៉ាងដូចម្តេច', en: 'How KOMA answers' })}
        lead={tl({
          km: 'លំដាប់សាមញ្ញពីរបៀបដែលសំណួរមួយក្លាយជាចម្លើយដែលមានប្រភព។',
          en: 'A simple sequence from a question to an answer you can trace.',
        })}
      />

      <ol className="grid gap-4 md:grid-cols-3">
        {STEPS.map((step, index) => {
          const { Icon } = step
          return (
            <li key={step.title.en} className="flex flex-col border-t border-line pt-4">
              <div className="flex items-center gap-3">
                <span
                  className="font-mono text-[11px] font-semibold tracking-[0.12em] text-teal-600"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="h-px flex-1 bg-line" aria-hidden="true" />
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-teal-50 text-pine">
                  <Icon size={18} />
                </span>
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-ink">
                {tl(step.title)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {tl(step.body)}
              </p>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
