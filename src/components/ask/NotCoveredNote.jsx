import { useI18n } from '../../lib/i18n.jsx'
import { Button, Chip, FeedbackInline, Tag } from '../ui.jsx'
import { IconSearch, IconShield } from '../icons.jsx'
import { ASK_COPY, cx } from './copy.js'

/**
 * "Our reviewed sources do not cover this" block. Deliberately quieter than a
 * clinic note and explicit that KOMA will not guess: it repeats the engine's
 * boundary message, offers three reviewed questions and a route to Safety.
 */
export default function NotCoveredNote({ message, onAsk }) {
  const { t, tl, lang } = useI18n()
  const bodyText = message.text[lang] ?? message.text.en ?? ''
  const items = message.followUps || []

  return (
    <article className="rounded-[22px] border border-dashed border-line bg-paper-deep/40 p-4 sm:p-5">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mint/70 text-pine">
          <IconSearch size={22} />
        </span>
        <Tag tone="saffron" className="mt-3">
          {tl(ASK_COPY.notCoveredTag)}
        </Tag>
        <h2 className="measure mt-3 font-display text-lg font-semibold leading-snug text-ink">
          {tl(ASK_COPY.notCoveredTitle)}
        </h2>
        <p
          className={cx(
            'measure mt-2 break-words text-sm leading-relaxed text-ink-soft',
            lang === 'km' && 'font-khmer',
          )}
        >
          {bodyText}
        </p>
        <p className="measure mt-2 text-xs font-semibold leading-relaxed text-ink-soft">
          {tl(ASK_COPY.notCoveredGuess)}
        </p>
      </div>

      {items.length ? (
        <div className="mt-4">
          <p className="mono-label text-center">{tl(ASK_COPY.suggestedLabel)}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {items.map((item, index) => (
              <Chip
                key={`${message.id}-nc-${index}`}
                onClick={() => onAsk(tl(item))}
                className="h-auto max-w-full whitespace-normal py-2 text-left leading-snug"
              >
                {tl(item)}
              </Chip>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex justify-center">
        <Button as="a" href="/safety" variant="secondary" size="sm">
          <IconShield size={15} />
          {tl(ASK_COPY.safetyLink)}
        </Button>
      </div>

      <div className="mt-4 border-t border-line pt-3">
        <p className="text-[11px] leading-relaxed text-ink-faint">
          {t('common.notMedicalAdvice')}
        </p>
        <FeedbackInline feature="ask" className="mt-3" />
        <p className="mt-3 font-mono text-[11px] leading-relaxed text-ink-faint">
          {message.requestId}
        </p>
      </div>
    </article>
  )
}
