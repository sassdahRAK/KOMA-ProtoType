import { useEffect, useRef } from 'react'
import { IconSend, IconStop } from '../icons.jsx'
import { useI18n } from '../../lib/i18n.jsx'
import { ASK_COPY, ASK_COUNTER_AT, ASK_MAX, cx } from './copy.js'

/**
 * Floating pill composer, ChatGPT-style. Controlled by the page so validation
 * and sending stay in one place. Enter sends, Shift+Enter adds a newline, IME
 * composition is never intercepted. Sticky to the bottom of the reading column;
 * on mobile its inner padding lifts the pill clear of the fixed bottom tabs.
 */
export default function AskComposer({
  value,
  onChange,
  onSend,
  onStop,
  streaming = false,
  error = null,
  maxLength = ASK_MAX,
  inputRef,
  sendButtonRef,
}) {
  const { tl } = useI18n()
  const localRef = useRef(null)
  const ref = inputRef || localRef

  const length = String(value || '').length
  const over = length > maxLength
  const showCounter = length > ASK_COUNTER_AT
  const activeError = over ? 'tooLong' : error
  const errorMessage =
    activeError === 'empty'
      ? tl(ASK_COPY.emptyError)
      : activeError === 'tooLong'
        ? tl(ASK_COPY.tooLong)
        : null

  // Grow to about five lines, then scroll inside the pill.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    const cap = 5 * 24 + 20
    el.style.height = `${Math.min(el.scrollHeight, cap)}px`
    el.style.overflowY = el.scrollHeight > cap ? 'auto' : 'hidden'
  }, [value, ref])

  const describedBy = [
    showCounter ? 'koma-ask-counter' : null,
    errorMessage ? 'koma-ask-error' : null,
  ]
    .filter(Boolean)
    .join(' ')

  const submit = () => {
    if (streaming) return
    onSend()
  }

  const handleKeyDown = (event) => {
    if (event.key !== 'Enter' || event.shiftKey) return
    if (event.nativeEvent?.isComposing || event.isComposing) return
    event.preventDefault()
    submit()
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    submit()
  }

  return (
    <div className="sticky bottom-0 z-20 mt-6 pt-6">
      {/* Soft paper fade so the conversation scrolls under the floating pill. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-4 bottom-0 bg-gradient-to-t from-paper via-paper/95 to-transparent"
      />

      <div className="relative pb-[calc(4rem+env(safe-area-inset-bottom,0px))] lg:pb-3">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex items-end gap-2 rounded-[26px] border border-line bg-shell px-3 py-2 shadow-lift transition-colors focus-within:border-teal/60 focus-within:ring-2 focus-within:ring-teal/25"
        >
          <label htmlFor="koma-ask-input" className="sr-only">
            {tl(ASK_COPY.composerLabel)}
          </label>
          <textarea
            id="koma-ask-input"
            ref={ref}
            rows={1}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tl(ASK_COPY.composerPlaceholder)}
            aria-describedby={describedBy || undefined}
            aria-invalid={errorMessage ? 'true' : 'false'}
            className="block min-h-[44px] w-full flex-1 resize-none border-0 bg-transparent px-1 py-2.5 text-[15px] leading-6 text-ink outline-none placeholder:text-ink-faint focus:outline-none focus-visible:outline-none"
          />

          <div ref={sendButtonRef} className="flex flex-none items-center">
            {streaming ? (
              <button
                type="button"
                onClick={onStop}
                aria-label={tl(ASK_COPY.stopAria)}
                className="focusable flex h-11 w-11 items-center justify-center rounded-full bg-pine text-white transition-colors hover:bg-pine-800"
              >
                <IconStop size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={streaming}
                aria-label={tl(ASK_COPY.sendAria)}
                data-koma-send="true"
                className="focusable flex h-11 w-11 items-center justify-center rounded-full bg-teal text-white transition-colors hover:bg-teal-600 active:bg-pine disabled:cursor-not-allowed disabled:opacity-40"
              >
                <IconSend size={18} />
              </button>
            )}
          </div>
        </form>

        <div className="mt-2 flex flex-wrap items-start justify-between gap-x-4 gap-y-1 px-1">
          <p className="min-w-0 text-[11px] leading-relaxed text-ink-faint">
            {tl(ASK_COPY.composerHint)}
          </p>
          {showCounter ? (
            <p
              id="koma-ask-counter"
              className={cx(
                'flex-none font-mono text-[11px] tabular-nums',
                over ? 'font-semibold text-clay-ink' : 'text-ink-faint',
              )}
            >
              {length}/{maxLength} {tl(ASK_COPY.counterLabel)}
            </p>
          ) : null}
        </div>

        {errorMessage ? (
          <p
            id="koma-ask-error"
            role="alert"
            className="mt-1 max-w-[42ch] break-words px-1 text-xs font-semibold leading-snug text-clay-ink"
          >
            {errorMessage}
          </p>
        ) : null}
      </div>

      <span className="sr-only" role="status">
        {streaming ? tl(ASK_COPY.reading) : ''}
      </span>
    </div>
  )
}
