import { useI18n } from '../../lib/i18n.jsx'
import { Button } from '../ui.jsx'
import { IconDoctor, IconMap, IconShield } from '../icons.jsx'

/**
 * Teal (not clay) reassurance strip: confirm any child use of a medicine with
 * a qualified clinician or pharmacist, with routes into the directory and the
 * facility map. Clay is reserved for urgent/warning surfaces only.
 */
export default function ConfirmStrip({ className }) {
  const { lang, tl } = useI18n()

  const km =
    'មុនពេលផ្តល់ឱសថដល់កុមារ សូមលើកពីចម្ងល់របស់អ្នក ហើយបញ្ជាក់បរិមាណ និងភាពសមស្របជាមួយគ្រូពេទ្យ ឬឱសថការីដែលមានគុណវុឌ្ឍិ។'
  const en =
    'Before giving any medicine to a child, raise your questions and confirm the amount and suitability with a qualified clinician or pharmacist.'

  return (
    <section
      aria-labelledby="medicine-confirm-title"
      className={[
        'rounded-2xl border border-teal-100 bg-teal-50 px-4 py-4 sm:px-5',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-shell text-teal-600">
          <IconShield size={18} />
        </span>
        <div className="min-w-0 space-y-2">
          <h3
            id="medicine-confirm-title"
            className="font-display text-base font-semibold leading-snug text-pine"
          >
            {tl({ km: 'បញ្ជាក់ជាមួយអ្នកជំនាញសុខាភិបាល', en: 'Confirm with a clinician' })}
          </h3>
          <p
            className={[
              'text-sm leading-relaxed text-pine',
              lang === 'km' ? 'font-khmer' : '',
            ].join(' ')}
          >
            {lang === 'km' ? km : en}
          </p>
          <div className="flex flex-wrap gap-2 pt-0.5">
            <Button as="a" href="/doctor" variant="secondary" size="sm">
              <IconDoctor size={15} />
              {tl({ km: 'ស្វែងរកវេជ្ជបណ្ឌិត', en: 'Find a clinician' })}
            </Button>
            <Button as="a" href="/map" variant="secondary" size="sm">
              <IconMap size={15} />
              {tl({ km: 'មើលមណ្ឌលសុខភាព', en: 'Find a facility' })}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
