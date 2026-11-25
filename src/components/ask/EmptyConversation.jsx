import { SUGGESTED } from '../../lib/data.js'
import { useI18n } from '../../lib/i18n.jsx'
import { IconClock } from '../icons.jsx'
import komaLogo from '../../assets/koma-logo-removed-bg.png'
import { ASK_COPY } from './copy.js'

const ROW_CLASS =
  'focusable flex min-h-[44px] w-full items-center rounded-xl px-3 py-2.5 text-left text-[15px] leading-snug text-ink-soft transition-colors hover:bg-teal-50 hover:text-pine'

/**
 * Quiet first screen, ChatGPT-style: the logo mark, a short greeting and the
 * five reviewed questions as plain full-width rows. Clicking one sends it.
 */
export default function EmptyConversation({ recents = [], onAsk }) {
  const { tl } = useI18n()

  return (
    <section className="w-full pb-2 pt-4 sm:pt-10">
      <div className="flex items-center gap-3">
        <img
          src={komaLogo}
          alt="KOMA"
          width={44}
          height={44}
          className="h-11 w-11 flex-none"
        />
        <div className="min-w-0">
          <h2 className="font-display text-xl font-semibold leading-snug text-ink sm:text-2xl">
            {tl(ASK_COPY.emptyPrompt)}
          </h2>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ink-faint">
        {tl(ASK_COPY.emptyHint)}
      </p>

      <div className="mt-8">
        <p className="mono-label">{tl(ASK_COPY.suggestedLabel)}</p>
        <ul className="mt-2 flex flex-col">
          {SUGGESTED.map((item, index) => (
            <li key={`suggested-${index}`}>
              <button
                type="button"
                onClick={() => onAsk(tl(item))}
                className={ROW_CLASS}
              >
                <span className="min-w-0 break-words">{tl(item)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {recents.length ? (
        <div className="mt-8 border-t border-line pt-5">
          <p className="mono-label">{tl(ASK_COPY.recentTitle)}</p>
          <ul className="mt-2 flex flex-col">
            {recents.slice(0, 3).map((question) => (
              <li key={question}>
                <button
                  type="button"
                  onClick={() => onAsk(question)}
                  className={ROW_CLASS}
                >
                  <IconClock
                    size={15}
                    className="mr-2 mt-0.5 flex-none text-ink-faint"
                  />
                  <span className="min-w-0 break-words">{question}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
