import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SUGGESTED } from '../../lib/data.js'
import { useI18n } from '../../lib/i18n.jsx'
import { addRecent } from '../../lib/store.js'
import { Button } from '../ui.jsx'
import { IconAlert, IconArrow, IconSend } from '../icons.jsx'

const COPY = {
  label: { km: 'តើអ្នកចង់សួរអ្វី?', en: 'What would you like to ask?' },
  hint: {
    km: 'អ្នកអាចសួរជាភាសាខ្មែរ ឬអង់គ្លេស។',
    en: 'You can ask in Khmer or English.',
  },
  placeholder: {
    km: 'សួរអំពីសុខភាពកូនរបស់អ្នក…',
    en: "Ask about your child's health…",
  },
  send: { km: 'សួរ KOMA', en: 'Ask KOMA' },
  empty: {
    km: 'សូមវាយសំណួរមួយជាមុនសិន។',
    en: 'Please type a question first.',
  },
  tryLabel: { km: 'សាកសួរ', en: 'Try asking' },
  boundary: {
    km: 'KOMA មិនមែនជាគ្រូពេទ្យទេ — ព័ត៌មានសម្រាប់ការអប់រំតែប៉ុណ្ណោះ។',
    en: 'KOMA is not a doctor — educational information only.',
  },
}

/**
 * Landing-page question composer. Suggestions fill and submit the field; the
 * form routes to /ask?q= so the Ask page owns the answer. Rendered as one
 * quiet, rounded surface in the style of a chat input.
 */
export default function QuestionComposer() {
  const { tl } = useI18n()
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const submit = (raw) => {
    const text = String(raw ?? value).trim()
    if (!text) {
      setError(tl(COPY.empty))
      if (inputRef.current) inputRef.current.focus()
      return
    }
    setError('')
    addRecent(text)
    navigate(`/ask?q=${encodeURIComponent(text)}`)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    submit()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  const handleSuggested = (item) => {
    const text = tl(item)
    setValue(text)
    submit(text)
  }

  return (
    <div className="w-full text-left">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex items-end gap-2 rounded-[26px] border border-line bg-shell p-2 shadow-lift transition-colors duration-200 focus-within:border-teal focus-within:ring-2 focus-within:ring-teal"
      >
        <label htmlFor="home-question" className="sr-only">
          {tl(COPY.label)}
        </label>

        <div className="min-w-0 flex-1">
          <textarea
            id="home-question"
            ref={inputRef}
            rows={2}
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
              if (error) setError('')
            }}
            onKeyDown={handleKeyDown}
            placeholder={tl(COPY.placeholder)}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? 'home-question-error' : undefined}
            className="block min-h-[60px] w-full resize-none rounded-3xl border-0 bg-transparent px-3.5 py-2.5 text-[15px] leading-relaxed text-ink placeholder:text-ink-faint focus:outline-none"
          />
          <span className="hidden px-3 pb-0.5 text-xs leading-snug text-ink-faint sm:block">
            {tl(COPY.hint)}
          </span>
        </div>

        <Button
          type="submit"
          aria-label={tl(COPY.send)}
          className="h-11 w-11 flex-none rounded-full !p-0"
        >
          <IconSend size={18} />
        </Button>
      </form>

      {error ? (
        <p
          id="home-question-error"
          role="alert"
          className="mt-2 flex items-start gap-1.5 text-sm font-semibold text-saffron-ink"
        >
          <IconAlert size={16} className="mt-0.5 flex-none" />
          {error}
        </p>
      ) : null}

      <div className="mt-4">
        <p className="mono-label">{tl(COPY.tryLabel)}</p>
        <div className="mt-1 flex flex-col items-start">
          {SUGGESTED.slice(0, 3).map((item) => (
            <button
              key={item.km}
              type="button"
              onClick={() => handleSuggested(item)}
              title={tl(item)}
              className="focusable inline-flex min-h-[44px] max-w-full items-center gap-2 rounded-lg px-1.5 text-left text-sm font-medium leading-snug text-ink-soft transition-colors duration-200 hover:text-pine"
            >
              <IconArrow size={13} className="flex-none text-teal-600" />
              <span className="min-w-0 break-words">{tl(item)}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink-faint">{tl(COPY.boundary)}</p>
    </div>
  )
}
