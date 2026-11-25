import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { SOURCES } from '../lib/data.js'
import { useI18n } from '../lib/i18n.jsx'
import { addFeedback } from '../lib/store.js'
import {
  IconAlert,
  IconCheck,
  IconClose,
  IconSearch,
  IconSource,
} from './icons.jsx'

function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}

function findSource(id) {
  return SOURCES.find((source) => source.id === id) || null
}

/* ------------------------------------------------------------------ */
/* Signature band                                                      */
/* ------------------------------------------------------------------ */

export function KramaBand({ vertical = false, className }) {
  return (
    <div
      className={cx(vertical ? 'krama-v' : 'krama', className)}
      aria-hidden="true"
    />
  )
}

/* ------------------------------------------------------------------ */
/* Status tags                                                         */
/* ------------------------------------------------------------------ */

const TAG_TONES = {
  teal: 'border-teal-100 bg-teal-50 text-teal-600',
  mint: 'border-mint bg-mint/60 text-pine',
  saffron: 'border-saffron/35 bg-saffron-tint text-saffron-ink',
  clay: 'border-clay/30 bg-clay-tint text-clay-ink',
  neutral: 'border-line bg-paper-deep text-ink-soft',
}

export function Tag({ tone = 'neutral', children, className }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold leading-5',
        TAG_TONES[tone] || TAG_TONES.neutral,
        className,
      )}
    >
      {children}
    </span>
  )
}

export function DemoBadge({ label, className }) {
  const { t } = useI18n()
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full border border-saffron/40 bg-saffron-tint px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-saffron-ink',
        className,
      )}
      style={{
        backgroundImage:
          'repeating-linear-gradient(135deg, rgba(238,158,51,0.16) 0 6px, rgba(238,158,51,0) 6px 12px)',
      }}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-saffron" />
      {label || t('common.demo')}
    </span>
  )
}

export function VerifiedBadge({ date, className }) {
  const { t, fmtDate } = useI18n()
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-600',
        className,
      )}
    >
      <IconCheck size={13} strokeWidth={2.25} />
      {t('common.verified')}
      {date ? (
        <span className="font-mono font-normal text-ink-faint">{fmtDate(date)}</span>
      ) : null}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */

const BUTTON_VARIANTS = {
  primary:
    'border border-teal bg-teal text-white hover:bg-teal-600 hover:border-teal-600 active:bg-pine',
  secondary:
    'border border-line bg-shell text-pine hover:border-teal/45 hover:bg-teal-50',
  ghost: 'border border-transparent bg-transparent text-pine hover:bg-teal-50',
  danger:
    'border border-clay bg-clay text-white hover:bg-clay-ink hover:border-clay-ink',
}

const BUTTON_SIZES = {
  sm: 'min-h-[44px] px-3.5 text-sm gap-1.5',
  md: 'min-h-[44px] px-5 text-sm gap-2',
  lg: 'min-h-[52px] px-6 text-base gap-2.5',
}

export function Button({
  variant = 'primary',
  size = 'md',
  as,
  href,
  children,
  className,
  type,
  ...rest
}) {
  const classes = cx(
    'focusable inline-flex items-center justify-center rounded-full font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
    BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary,
    BUTTON_SIZES[size] || BUTTON_SIZES.md,
    className,
  )

  // `as="a"` is the documented contract; treat a bare `href` as a link too so
  // a navigation button can never render as a dead <button>.
  if (as === 'a' || (!as && href)) {
    // Internal app routes (e.g. /map) must be client-side links so they do
    // not trigger a full page reload, which would wipe conversation state.
    // Absolute URLs and fragments (http, mailto, tel, #, //host) stay anchors.
    const isInternalRoute =
      typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')

    if (isInternalRoute) {
      return (
        <Link to={href} className={classes} {...rest}>
          {children}
        </Link>
      )
    }

    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button type={type || 'button'} className={classes} {...rest}>
      {children}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Chips                                                               */
/* ------------------------------------------------------------------ */

export function Chip({ active = false, onClick, children, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        'focusable inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors',
        active
          ? 'border-pine bg-pine text-white'
          : 'border-line bg-shell text-ink-soft hover:border-teal/45 hover:bg-teal-50 hover:text-pine',
        className,
      )}
    >
      {children}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Form primitives                                                     */
/* ------------------------------------------------------------------ */

export function Field({ label, hint, htmlFor, children, className }) {
  return (
    <div className={cx('space-y-1.5', className)}>
      {label ? (
        <label htmlFor={htmlFor} className="block text-sm font-semibold text-ink">
          {label}
        </label>
      ) : null}
      {children}
      {hint ? <p className="text-xs leading-relaxed text-ink-faint">{hint}</p> : null}
    </div>
  )
}

export function SearchField({
  label,
  value = '',
  onChange,
  placeholder,
  onClear,
  className,
  id,
}) {
  const { t } = useI18n()
  const generatedId = useId()
  const inputId = id || `koma-search-${generatedId}`
  const hasValue = String(value).length > 0

  const handleClear = () => {
    if (typeof onClear === 'function') onClear()
    else if (typeof onChange === 'function') onChange({ target: { value: '' } })
  }

  return (
    <div className={cx('w-full', className)}>
      <label htmlFor={inputId} className="sr-only">
        {label || t('common.search')}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-ink-faint">
          <IconSearch size={18} />
        </span>
        <input
          id={inputId}
          type="search"
          inputMode="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder || t('common.search')}
          className="focusable h-12 w-full rounded-full border border-line bg-shell pl-11 pr-12 text-[15px] text-ink placeholder:text-ink-faint"
        />
        {hasValue ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label={t('common.clear')}
            className="focusable absolute right-0.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-paper-deep hover:text-pine"
          >
            <IconClose size={17} />
          </button>
        ) : null}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Safety + provenance                                                 */
/* ------------------------------------------------------------------ */

const STRIPE_TONES = {
  saffron: {
    wrap: 'border-saffron bg-saffron-tint/70 text-saffron-ink',
    icon: 'bg-saffron/20 text-saffron-ink',
  },
  clay: {
    wrap: 'border-clay bg-clay-tint/75 text-clay-ink',
    icon: 'bg-clay/15 text-clay-ink',
  },
}

export function SafetyStripe({ tone = 'saffron', title, children, className }) {
  const t = STRIPE_TONES[tone] || STRIPE_TONES.saffron
  return (
    <section
      role="note"
      className={cx('rounded-2xl border-l-4 px-4 py-3.5 sm:px-5', t.wrap, className)}
    >
      <div className="flex items-start gap-3">
        <span
          className={cx(
            'mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full',
            t.icon,
          )}
        >
          <IconAlert size={16} />
        </span>
        <div className="min-w-0 space-y-1">
          {title ? <p className="text-sm font-bold leading-snug">{title}</p> : null}
          <div className="text-sm leading-relaxed [&_a]:font-semibold [&_a]:underline">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Provenance({ sourceId, checkedAt, className }) {
  const { t, fmtDate } = useI18n()
  const source = findSource(sourceId)
  const date = checkedAt || source?.accessedAt

  return (
    <div
      className={cx(
        'flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] leading-relaxed text-ink-faint',
        className,
      )}
    >
      <IconSource size={14} />
      <span className="text-ink-soft">
        {source ? source.name : sourceId || t('common.source')}
      </span>
      <span aria-hidden="true">·</span>
      <span className="whitespace-nowrap">
        {t('common.lastChecked')} {date ? fmtDate(date) : '—'}
      </span>
    </div>
  )
}

export function SourceList({ ids = [], className }) {
  const { t } = useI18n()
  const sources = (ids || []).map(findSource).filter(Boolean)

  if (!sources.length) return null

  return (
    <div className={cx('flex flex-wrap items-center gap-2', className)}>
      <span className="mono-label">{t('common.sources')}</span>
      {sources.map((source) => (
        <a
          key={source.id}
          href={source.url}
          target="_blank"
          rel="noreferrer noopener"
          title={`${source.publisher} — ${source.license}`}
          className="focusable inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-line bg-shell px-3 text-xs font-semibold text-teal-600 transition-colors hover:border-teal/40 hover:bg-teal-50"
        >
          <IconSource size={14} />
          {source.name}
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Headings and layout helpers                                         */
/* ------------------------------------------------------------------ */

export function SectionHeading({ eyebrow, title, lead, className }) {
  return (
    <header className={cx('space-y-2', className)}>
      {eyebrow ? <p className="mono-label">{eyebrow}</p> : null}
      <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-[28px]">
        {title}
      </h2>
      {lead ? <p className="measure text-[15px] leading-relaxed text-ink-soft">{lead}</p> : null}
    </header>
  )
}

export function PageHeader({ eyebrow, title, lead, aside, className }) {
  return (
    <header className={cx('border-b border-line pb-6', className)}>
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 max-w-[62ch]">
          {eyebrow ? <p className="mono-label">{eyebrow}</p> : null}
          <h1 className="mt-2 font-display text-[30px] font-semibold leading-[1.12] tracking-tight text-ink sm:text-[38px]">
            {title}
          </h1>
          {lead ? (
            <p className="measure mt-3 text-[15px] leading-relaxed text-ink-soft sm:text-base">
              {lead}
            </p>
          ) : null}
        </div>
        {aside ? <div className="flex-none">{aside}</div> : null}
      </div>
    </header>
  )
}

export function Divider({ label, className }) {
  if (!label) {
    return <div className={cx('h-px w-full bg-line', className)} role="presentation" />
  }
  return (
    <div className={cx('flex items-center gap-3', className)} role="presentation">
      <span className="h-px flex-1 bg-line" />
      <span className="mono-label text-center">{label}</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  )
}

export function EmptyState({ icon, title, body, action, className }) {
  return (
    <div
      className={cx(
        'flex flex-col items-center rounded-[22px] border border-dashed border-line bg-shell/70 px-5 py-12 text-center',
        className,
      )}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mint/70 text-pine">
        {icon || <IconSearch size={24} />}
      </span>
      <h2 className="mt-4 font-display text-lg font-semibold text-ink">{title}</h2>
      {body ? (
        <p className="measure mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Feedback                                                            */
/* ------------------------------------------------------------------ */

export function FeedbackInline({ feature, prompt, onDone, className }) {
  const { t } = useI18n()
  const [done, setDone] = useState(false)

  const send = (rating) => {
    addFeedback({ feature, rating })
    setDone(true)
    if (typeof onDone === 'function') onDone(rating)
  }

  if (done) {
    return (
      <p
        className={cx('flex items-center gap-2 text-sm text-teal-600', className)}
        role="status"
      >
        <IconCheck size={16} strokeWidth={2.25} />
        {t('common.feedbackThanks')}
      </p>
    )
  }

  return (
    <div className={cx('flex flex-wrap items-center gap-3', className)}>
      <p className="text-sm text-ink-soft">{prompt || t('common.feedbackQuestion')}</p>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" size="sm" onClick={() => send('helpful')}>
          <IconCheck size={15} />
          {t('common.helpful')}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => send('not-helpful')}>
          <IconClose size={15} />
          {t('common.notHelpful')}
        </Button>
      </div>
    </div>
  )
}
