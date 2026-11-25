import { useI18n } from '../../lib/i18n.jsx'
import { SafetyStripe } from '../ui.jsx'
import { IconShield } from '../icons.jsx'

/**
 * The safety boundary made visible: KOMA never provides an amount, frequency,
 * duration or treatment choice for a child. This is the only place in the
 * medicine journey where a word for an amount appears, and it always appears
 * inside a negative statement.
 *
 * variant=page  -> the non-dismissible stripe under the page header.
 * variant=detail -> the explicit per-entry panel with a shield icon.
 */
const PAGE = {
  titleKm: 'គ្មានព័ត៌មានកម្រិតថ្នាំ',
  titleEn: 'No dosage information',
  km:
    'KOMA មិនផ្តល់បរិមាណថ្នាំទេ។ សម្រាប់ឱសថណាមួយសម្រាប់កុមារ សូមផ្ទៀងផ្ទាត់បរិមាណ និងភាពសមស្របជាមួយវេជ្ជបណ្ឌិត ឬឱសថការីដែលមានគុណវុឌ្ឍិ។',
  en:
    'KOMA does not provide doses. For any medicine for a child, confirm the amount and suitability with a qualified doctor or pharmacist.',
}

const DETAIL = {
  kmTitle: 'KOMA មិនផ្តល់កម្រិតថ្នាំទេ',
  enTitle: 'KOMA does not provide doses',
  km:
    'កម្រិតថ្នាំសម្រាប់កុមារ ត្រូវផ្ទៀងផ្ទាត់ជាមួយវេជ្ជបណ្ឌិត ឬឱសថការី។',
  en: 'Child dosing must be confirmed with a doctor or pharmacist.',
  monoKm: 'គ្មានទិន្នន័យបរិមាណថ្នាំសម្រាប់គំរូនេះទេ។',
  mono: 'No dosage data is stored for this prototype.',
}

export default function NoDosageNotice({ variant = 'detail', className }) {
  const { lang } = useI18n()

  if (variant === 'page') {
    return (
      <SafetyStripe
        tone="saffron"
        title={lang === 'km' ? PAGE.titleKm : PAGE.titleEn}
        className={className}
      >
        <p className={lang === 'km' ? 'font-khmer' : undefined}>
          {lang === 'km' ? PAGE.km : PAGE.en}
        </p>
      </SafetyStripe>
    )
  }

  return (
    <section
      role="note"
      aria-labelledby="no-dosage-title"
      className={[
        'rounded-2xl border border-saffron/40 bg-saffron-tint/65 px-4 py-4',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-shell text-saffron-ink">
          <IconShield size={18} />
        </span>
        <div className="min-w-0">
          <h3
            id="no-dosage-title"
            className={[
              'text-base font-bold leading-snug text-saffron-ink',
              lang === 'km' ? 'font-khmer' : 'font-display',
            ].join(' ')}
          >
            {lang === 'km' ? DETAIL.kmTitle : DETAIL.enTitle}
          </h3>
          <p
            className={[
              'mt-2 text-sm leading-relaxed text-ink',
              lang === 'km' ? 'font-khmer' : '',
            ].join(' ')}
          >
            {lang === 'km' ? DETAIL.km : DETAIL.en}
          </p>
          <p className="mt-2.5 border-t border-saffron/25 pt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-saffron-ink/80">
            {lang === 'km' ? DETAIL.monoKm : DETAIL.mono}
          </p>
        </div>
      </div>
    </section>
  )
}
