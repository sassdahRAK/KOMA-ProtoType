import { Link } from 'react-router-dom'
import { KNOWLEDGE, SOURCES } from '../../lib/data.js'
import { useI18n } from '../../lib/i18n.jsx'
import { SafetyStripe, Tag } from '../ui.jsx'
import { IconChevron, IconClock, IconShield, IconSource } from '../icons.jsx'
import { ASK_COPY, cx } from './copy.js'

/**
 * Desktop context rail: the six reviewed topics KOMA answers from, recent
 * questions, the standing safety notice and a route to the Safety page. It is
 * an aside, not chat history; on mobile it stacks below the conversation.
 */
export default function ContextRail({ recents = [], onAsk }) {
  const { t, tl, lang } = useI18n()

  return (
    <div className="card min-w-0 space-y-4 p-4 sm:p-5">
      <header>
        <p className="mono-label">{tl(ASK_COPY.railEyebrow)}</p>
        <h2 className="mt-1 font-display text-base font-semibold leading-snug text-ink">
          {tl(ASK_COPY.railTitle)}
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-ink-faint">
          {tl(ASK_COPY.railNote)}
        </p>
      </header>

      <div>
        <p className="mono-label">{tl(ASK_COPY.answersFrom)}</p>
        <ul className="mt-2 space-y-1.5">
          {KNOWLEDGE.map((doc, index) => (
            <li key={doc.id} className="flex gap-2">
              <span
                className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-teal-50 font-mono text-[10px] font-semibold text-teal-600"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <span className="min-w-0">
                <span
                  className={cx(
                    'block break-words text-[13px] font-semibold leading-snug text-ink',
                    lang === 'km' && 'font-khmer',
                  )}
                >
                  {lang === 'km' ? doc.titleKm : doc.titleEn}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-line pt-3">
        <p className="mono-label flex items-center gap-1.5">
          <IconSource size={13} className="flex-none text-teal-600" />
          {t('common.sources')}
        </p>
        <ul className="mt-2 space-y-1">
          {SOURCES.map((source) => (
            <li key={source.id}>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer noopener"
                className="focusable flex min-h-[44px] items-start gap-2 rounded-xl px-1 py-1.5 transition-colors hover:bg-teal-50"
              >
                <span className="min-w-0 flex-1">
                  <span className="block break-words text-xs font-semibold leading-snug text-ink">
                    {source.name}
                  </span>
                  <span className="mt-0.5 block break-words font-mono text-[10px] leading-snug text-ink-faint">
                    {source.publisher}
                  </span>
                </span>
                <span className="mt-0.5 flex-none">
                  {source.status === 'verified' ? (
                    <Tag tone="teal" className="whitespace-nowrap px-2 text-[10px]">
                      {t('common.verified')}
                    </Tag>
                  ) : null}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-line pt-3">
        <p className="mono-label flex items-center gap-1.5">
          <IconClock size={13} className="flex-none text-ink-faint" />
          {tl(ASK_COPY.recentTitle)}
        </p>
        {recents.length ? (
          <div className="mt-2 flex flex-col">
            {recents.slice(0, 5).map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => onAsk(question)}
                className="focusable flex min-h-[44px] w-full items-start gap-2 rounded-xl px-2 py-2 text-left text-xs font-medium leading-snug text-ink-soft transition-colors hover:bg-teal-50 hover:text-pine"
              >
                <IconChevron
                  size={13}
                  className="mt-0.5 flex-none text-teal-600"
                />
                <span className="min-w-0 break-words">{question}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-1.5 text-xs leading-relaxed text-ink-faint">
            {tl(ASK_COPY.recentEmpty)}
          </p>
        )}
      </div>

      <SafetyStripe tone="saffron">{t('common.notMedicalAdvice')}</SafetyStripe>

      <Link
        to="/safety"
        className="focusable flex min-h-[44px] items-center justify-between gap-2 rounded-2xl border border-line bg-shell px-4 text-sm font-semibold text-pine transition-colors hover:bg-teal-50"
      >
        <span className="inline-flex items-center gap-2">
          <IconShield size={16} className="flex-none" />
          {t('nav.safety')}
        </span>
        <IconChevron size={16} className="flex-none text-ink-faint" />
      </Link>
    </div>
  )
}
