import { useI18n } from '../../lib/i18n.jsx'
import {
  Button,
  DemoBadge,
  FeedbackInline,
  Provenance,
  SafetyStripe,
  SourceList,
  Tag,
} from '../ui.jsx'
import { IconAlert, IconArrow, IconBook, IconMedicine } from '../icons.jsx'
import ConfirmStrip from './ConfirmStrip.jsx'
import { categoryLabel } from './categoryLabel.js'

const NO_AMOUNT_KM =
  'KOMA មិនផ្តល់បរិមាណឱសថ (ដូស) ទេ។ សូមពិគ្រោះគ្រូពេទ្យ ឬឱសថការីសម្រាប់បរិមាណ និងការប្រើប្រាស់ត្រឹមត្រូវសម្រាប់កូនរបស់អ្នក។'
const NO_AMOUNT_EN =
  'KOMA does not provide dosage information. Ask a clinician or pharmacist for the correct amount and use for your child.'

function BlockHeading({ id, icon, children }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-paper-deep text-teal-600">
        {icon}
      </span>
      <h3 id={id} className="font-display text-base font-semibold leading-snug text-ink">
        {children}
      </h3>
    </div>
  )
}

export default function MedicineDetail({ medicine, onBack }) {
  const { lang, t, tl, fmtDate } = useI18n()

  if (!medicine) return null

  const generalUse = lang === 'km' ? medicine.generalUseKm : medicine.generalUseEn
  const warnings = lang === 'km' ? medicine.warningsKm : medicine.warningsEn

  return (
    <article className="min-w-0 overflow-hidden rounded-[22px] border border-line border-l-4 border-l-teal bg-shell shadow-lift">
      <header className="border-b border-line px-4 pb-5 pt-4 sm:px-6">
        <div className="lg:hidden">
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-1">
            <IconArrow size={16} className="rotate-180" />
            {tl({ km: 'ត្រឡប់ទៅបញ្ជី', en: 'Back to list' })}
          </Button>
        </div>

        <p className="mono-label">
          {tl({ km: 'ឯកសារយោងឱសថ', en: 'Medicine reference' })}
        </p>
        <p className="mt-1 break-all font-mono text-[11px] leading-relaxed text-ink-faint">
          {medicine.id}
        </p>
        <h2
          className={[
            'mt-1 break-words text-2xl font-semibold leading-tight text-ink sm:text-[28px]',
            lang === 'km' ? 'font-khmer' : 'font-display',
          ].join(' ')}
        >
          {lang === 'km' ? medicine.nameKm : medicine.nameEn}
        </h2>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Tag tone="teal">{categoryLabel(medicine.category, lang)}</Tag>
          <DemoBadge label={t('common.demo')} />
        </div>
      </header>

      <div className="space-y-5 px-4 py-5 sm:px-6">
        <SafetyStripe
          tone="saffron"
          title={
            lang === 'km'
              ? 'គ្មានបរិមាណឱសថ (ដូស) ក្នុងព័ត៌មាននេះទេ'
              : 'No dosage information'
          }
        >
          <p className={lang === 'km' ? 'font-khmer' : undefined}>
            {lang === 'km' ? NO_AMOUNT_KM : NO_AMOUNT_EN}
          </p>
        </SafetyStripe>

        <section aria-labelledby="medicine-ingredient">
          <BlockHeading id="medicine-ingredient" icon={<IconMedicine size={15} />}>
            {tl({ km: 'សារធាតុសកម្ម', en: 'Active ingredient' })}
          </BlockHeading>
          <p className="mt-2 inline-block max-w-full break-words rounded-lg border border-line bg-paper-deep px-2.5 py-1 font-mono text-[13px] font-semibold leading-relaxed text-pine">
            {medicine.activeIngredient}
          </p>
        </section>

        {generalUse ? (
          <section aria-labelledby="medicine-general-use">
            <BlockHeading id="medicine-general-use" icon={<IconBook size={15} />}>
              {tl({ km: 'ប្រយោជន៍ទូទៅ', en: 'General use' })}
            </BlockHeading>
            <p
              className={[
                'mt-2 text-sm leading-relaxed text-ink-soft',
                lang === 'km' ? 'font-khmer' : '',
              ].join(' ')}
            >
              {generalUse}
            </p>
          </section>
        ) : null}

        {warnings ? (
          <section
            role="note"
            aria-labelledby="medicine-warnings"
            className="rounded-2xl border border-clay/40 bg-clay-tint/80 px-4 py-4 sm:px-5"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-clay/15 text-clay-ink">
                <IconAlert size={16} />
              </span>
              <h3
                id="medicine-warnings"
                className="font-display text-base font-bold leading-snug text-clay-ink"
              >
                {tl({ km: 'ការព្រមាន', en: 'Warnings' })}
              </h3>
            </div>
            <p
              className={[
                'mt-2 text-sm font-medium leading-relaxed text-clay-ink',
                lang === 'km' ? 'font-khmer' : '',
              ].join(' ')}
            >
              {warnings}
            </p>
          </section>
        ) : null}

        <ConfirmStrip />
      </div>

      <footer className="space-y-3 border-t border-line bg-paper/50 px-4 py-4 sm:px-6">
        <Provenance sourceId={medicine.sourceId} checkedAt={medicine.reviewedAt} />

        <p className="mono-label">
          {tl({ km: 'ការពិនិត្យឡើងវិញ', en: 'Review' })}
        </p>
        <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          <div className="min-w-0">
            <dt className="mono-label">
              {tl({ km: 'អ្នកពិនិត្យ', en: 'Reviewed by' })}
            </dt>
            <dd className="mt-0.5 break-words font-mono text-[13px] leading-relaxed text-ink">
              {medicine.reviewedBy}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="mono-label">
              {tl({ km: 'កាលបរិច្ឆេទពិនិត្យ', en: 'Reviewed on' })}
            </dt>
            <dd className="mt-0.5 font-mono text-[13px] text-ink-soft">
              {fmtDate(medicine.reviewedAt)}
            </dd>
          </div>
          {medicine.status ? (
            <div className="min-w-0">
              <dt className="mono-label">
                {tl({ km: 'ស្ថានភាព', en: 'Status' })}
              </dt>
              <dd className="mt-1 flex flex-wrap items-center gap-2">
                <Tag tone="saffron">{t('common.demo')}</Tag>
              </dd>
            </div>
          ) : null}
        </dl>

        <p className="text-xs leading-relaxed text-ink-soft">
          {tl({
            km: 'ព័ត៌មាននេះជាសេចក្តីសង្ខេបពីប្រភពយោង មិនមែនជាវេជ្ជបញ្ជាទេ។',
            en: 'This is a summary from a reference source, not a prescription.',
          })}
        </p>
        <p className="text-[11px] leading-relaxed text-ink-faint">
          {t('common.notMedicalAdvice')}
        </p>

        <SourceList ids={[medicine.sourceId]} />

        <div className="border-t border-line pt-3">
          <FeedbackInline feature="medicine" />
        </div>
      </footer>
    </article>
  )
}
