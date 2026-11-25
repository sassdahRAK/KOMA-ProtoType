import { Link } from 'react-router-dom'
import { EMERGENCY, SOURCES } from '../../lib/data.js'
import { useI18n } from '../../lib/i18n.jsx'
import {
  Button,
  Chip,
  DemoBadge,
  FeedbackInline,
  Provenance,
  SafetyStripe,
  SourceList,
  Tag,
} from '../ui.jsx'
import { IconDoctor, IconMap, IconShield } from '../icons.jsx'
import { ASK_COPY, cx } from './copy.js'

function FollowUps({ items, messageId, onAsk }) {
  const { tl } = useI18n()
  if (!items || !items.length) return null

  return (
    <div>
      <p className="mono-label">{tl(ASK_COPY.followUpLabel)}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item, index) => (
          <Chip
            key={`${messageId}-fu-${index}`}
            onClick={() => onAsk(tl(item))}
            className="h-auto max-w-full whitespace-normal py-2 text-left leading-snug"
          >
            {tl(item)}
          </Chip>
        ))}
      </div>
    </div>
  )
}

/**
 * The signature "clinic note" answer: white card, teal left rule, mono
 * provenance footer. Partial text is shown while streaming or after the user
 * stops the answer; a language switch falls back to the stored text object.
 */
export default function KomaNote({ message, onAsk }) {
  const { t, tl, lang } = useI18n()

  const partialVisible =
    (message.streaming || message.stopped) && lang === message.streamedLang
  const streaming = Boolean(message.streaming) && lang === message.streamedLang
  const bodyText = partialVisible
    ? message.shown
    : (message.text[lang] ?? message.text.en ?? '')

  const firstSourceId = message.sourceIds?.[0]
  const source = SOURCES.find((item) => item.id === firstSourceId)
  const isDemo = source?.status === 'demo'
  const complete = !message.streaming

  return (
    <article
      className="card min-w-0 border-l-4 border-l-teal p-4 sm:p-5"
      aria-busy={message.streaming ? 'true' : 'false'}
    >
      <header className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-teal-50 text-teal-600">
          <IconShield size={16} />
        </span>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
          KOMA · {tl(ASK_COPY.answerLabel)}
        </p>
        {message.urgent ? (
          <Tag tone="clay">{t('common.urgent')}</Tag>
        ) : (
          <Tag tone="teal" className="max-w-full whitespace-normal text-left">
            {tl(ASK_COPY.reviewedTag)}
          </Tag>
        )}
        {isDemo ? <DemoBadge label={t('common.demo')} /> : null}

        <span className="ml-auto flex items-center gap-1.5">
          {streaming ? (
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-teal-600">
              <span
                className="h-1.5 w-1.5 flex-none animate-pulse rounded-full bg-teal"
                aria-hidden="true"
              />
              {tl(ASK_COPY.reading)}
            </span>
          ) : null}
          {message.stopped ? (
            <Tag tone="saffron">{tl(ASK_COPY.stopped)}</Tag>
          ) : null}
        </span>
      </header>

      {message.urgent ? (
        <SafetyStripe tone="clay" title={t('common.urgent')} className="mt-3">
          <p className="break-words">{tl(EMERGENCY)}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button as="a" href="/map" variant="danger" size="sm">
              <IconMap size={16} />
              {tl(ASK_COPY.findFacility)}
            </Button>
            <Link
              to="/doctor"
              className="focusable inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-clay/40 bg-shell px-4 text-sm font-semibold text-clay-ink transition-colors hover:bg-clay-tint"
            >
              <IconDoctor size={16} />
              {t('nav.doctor')}
            </Link>
          </div>
        </SafetyStripe>
      ) : null}

      <div className="mt-3">
        <p
          className={cx(
            'whitespace-pre-line break-words text-[15px] leading-7 text-ink',
            lang === 'km' && 'font-khmer',
          )}
        >
          {bodyText}
          {streaming ? (
            <span
              className="ml-0.5 inline-block h-[1.05em] w-[2px] animate-pulse bg-teal align-[-0.15em]"
              aria-hidden="true"
            />
          ) : null}
        </p>
        <p className="sr-only" role="status" aria-live="polite">
          {message.streaming
            ? tl(ASK_COPY.reading)
            : message.stopped
              ? tl(ASK_COPY.stoppedNote)
              : bodyText}
        </p>
        {message.stopped && complete ? (
          <p className="mt-2 text-xs font-semibold leading-relaxed text-saffron-ink">
            {tl(ASK_COPY.stoppedNote)}
          </p>
        ) : null}
      </div>

      <footer className="mt-4 space-y-3 border-t border-line pt-3">
        <SourceList
          ids={message.sourceIds}
          className="[&_a]:max-w-full [&_a]:whitespace-normal [&_a]:py-1.5"
        />
        {firstSourceId ? (
          <Provenance sourceId={firstSourceId} checkedAt={message.checkedAt} />
        ) : null}
        <p className="text-[11px] leading-relaxed text-ink-faint">
          {t('common.notMedicalAdvice')}
        </p>

        {complete && !message.urgent ? (
          <FollowUps
            items={message.followUps}
            messageId={message.id}
            onAsk={onAsk}
          />
        ) : null}

        {complete ? (
          <FeedbackInline feature="ask" className="border-t border-line pt-3" />
        ) : null}

        <p className="font-mono text-[11px] leading-relaxed text-ink-faint">
          {message.requestId}
        </p>
      </footer>
    </article>
  )
}
