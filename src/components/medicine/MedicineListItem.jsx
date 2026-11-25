import { useI18n } from '../../lib/i18n.jsx'
import { DemoBadge, Tag } from '../ui.jsx'
import { IconChevron, IconMedicine } from '../icons.jsx'
import { categoryLabel } from './categoryLabel.js'

/**
 * One reviewed reference entry. A real full-width <button> so it is keyboard
 * operable and keeps a 44px+ touch target; aria-current marks the entry that is
 * open in the detail panel.
 */
export default function MedicineListItem({ medicine, selected, onSelect }) {
  const { lang, t } = useI18n()

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-current={selected ? 'true' : undefined}
        className={[
          'focusable group flex w-full min-w-0 items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-colors',
          selected
            ? 'border-teal/60 bg-teal-50 ring-2 ring-teal/25'
            : 'border-line bg-shell hover:border-teal/40 hover:bg-teal-50/60',
        ].join(' ')}
      >
        <span
          className={[
            'flex h-10 w-10 flex-none items-center justify-center rounded-full',
            selected
              ? 'bg-teal-100 text-teal-600'
              : 'bg-teal-50 text-teal-600 group-hover:bg-teal-100',
          ].join(' ')}
        >
          <IconMedicine size={19} />
        </span>

        <span className="min-w-0 flex-1">
          <span
            className={[
              'block truncate text-[15px] font-medium leading-snug text-ink',
              lang === 'km' ? 'font-khmer' : '',
            ].join(' ')}
          >
            {lang === 'km' ? medicine.nameKm : medicine.nameEn}
          </span>
          <span className="mt-1 block truncate font-mono text-[11px] leading-snug text-ink-faint">
            {medicine.activeIngredient}
          </span>
          <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <Tag tone="teal">{categoryLabel(medicine.category, lang)}</Tag>
            <DemoBadge label={t('common.demo')} />
          </span>
        </span>

        <IconChevron
          size={18}
          className={[
            'flex-none',
            selected ? 'text-teal-600' : 'text-ink-faint group-hover:text-teal-600',
          ].join(' ')}
        />
      </button>
    </li>
  )
}
