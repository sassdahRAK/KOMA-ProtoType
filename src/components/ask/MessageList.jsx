import { useI18n } from '../../lib/i18n.jsx'
import KomaNote from './KomaNote.jsx'
import NotCoveredNote from './NotCoveredNote.jsx'
import { ASK_COPY, cx } from './copy.js'

/** Right-aligned quiet user turn. The question is shown exactly as typed. */
function UserTurn({ message }) {
  const { tl, lang } = useI18n()

  return (
    <div className="flex flex-col items-end gap-1">
      <span className="mono-label pr-1">{tl(ASK_COPY.you)}</span>
      <p
        className={cx(
          'max-w-[88%] break-words rounded-2xl rounded-br-md border border-teal-100 bg-teal-50 px-4 py-2.5 text-[15px] leading-relaxed text-ink',
          lang === 'km' && 'font-khmer',
        )}
      >
        {message.text}
      </p>
    </div>
  )
}

/** Conversation log. Answers own their own polite live region. */
export default function MessageList({ messages = [], onAsk }) {
  const { tl } = useI18n()

  return (
    <ol
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      aria-label={tl(ASK_COPY.conversation)}
      className="space-y-5"
    >
      {messages.map((message) => (
        <li key={message.id} className="min-w-0">
          {message.role === 'user' ? (
            <UserTurn message={message} />
          ) : message.found ? (
            <KomaNote message={message} onAsk={onAsk} />
          ) : (
            <NotCoveredNote message={message} onAsk={onAsk} />
          )}
        </li>
      ))}
    </ol>
  )
}
