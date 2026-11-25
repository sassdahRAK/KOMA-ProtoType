import { useState } from 'react'
import { addFeedback } from '../../lib/store.js'
import { useI18n } from '../../lib/i18n.jsx'
import { Button, Field, SectionHeading } from '../ui.jsx'
import { IconAlert, IconCheck, IconClose, IconSend } from '../icons.jsx'

const COPY = {
  legend: {
    km: 'តើព័ត៌មាននៅទំព័រនេះមានប្រយោជន៍ទេ?',
    en: 'Was the information on this page helpful?',
  },
  commentLabel: {
    km: 'មតិបន្ថែម (ស្រេចចិត្ត)',
    en: 'Additional comment (optional)',
  },
  commentHint: {
    km: 'អតិបរមា 500 តួអក្សរ។ សូមមិនបញ្ចូលឈ្មោះ ឬព័ត៌មានផ្ទាល់ខ្លួន។',
    en: 'Maximum 500 characters. Please do not include names or personal details.',
  },
  submit: { km: 'ផ្ញើមតិយោបល់', en: 'Send feedback' },
  empty: {
    km: 'សូមជ្រើសរើសចម្លើយមួយជាមុនសិន។',
    en: 'Please choose an answer first.',
  },
}

const OPTIONS = [
  { value: 'helpful', Icon: IconCheck, label: 'common.helpful' },
  { value: 'not-helpful', Icon: IconClose, label: 'common.notHelpful' },
]

/**
 * Anonymous feedback form with a helpful / not-helpful rating. Persists
 * through the shared store helper and never asks for a name or child details.
 */
export default function FeedbackForm() {
  const { t, tl } = useI18n()
  const [rating, setRating] = useState('')
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!rating) {
      setError(tl(COPY.empty))
      setDone(false)
      return
    }
    addFeedback({ feature: 'safety', rating, comment: comment.trim() })
    setRating('')
    setComment('')
    setError('')
    setDone(true)
  }

  return (
    <section
      className="space-y-5"
      aria-label={tl({ km: 'មតិយោបល់', en: 'Feedback' })}
    >
      <SectionHeading
        eyebrow={tl({ km: 'មតិយោបល់', en: 'Feedback' })}
        title={tl({ km: 'ជួយយើងកែលម្អ', en: 'Help us improve' })}
        lead={tl({
          km: 'មតិរបស់អ្នកមិនបង្ហាញឈ្មោះ ហើយរក្សាទុកក្នុងកម្មវិធីរុករកនេះតែប៉ុណ្ណោះ។',
          en: 'Your feedback is anonymous and stored only in this browser.',
        })}
      />

      <form onSubmit={handleSubmit} noValidate className="card space-y-5 p-4 sm:p-6">
        <fieldset
          className="space-y-2.5"
          aria-describedby={error ? 'safety-rating-error' : undefined}
        >
          <legend className="text-sm font-semibold text-ink">{tl(COPY.legend)}</legend>

          <div className="flex flex-wrap gap-2">
            {OPTIONS.map((option) => {
              const { Icon } = option
              const selected = rating === option.value
              return (
                <label
                  key={option.value}
                  className={
                    'focusable relative inline-flex min-h-[44px] cursor-pointer select-none items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors focus-within:ring-2 focus-within:ring-teal focus-within:ring-offset-2 focus-within:ring-offset-paper ' +
                    (selected
                      ? 'border-teal-600 bg-teal-600 text-white'
                      : 'border-line bg-shell text-ink-soft hover:border-teal/45 hover:bg-teal-50 hover:text-pine')
                  }
                >
                  <input
                    type="radio"
                    name="safety-rating"
                    value={option.value}
                    checked={selected}
                    onChange={() => {
                      setRating(option.value)
                      setError('')
                      setDone(false)
                    }}
                    className="sr-only"
                  />
                  <Icon size={15} strokeWidth={2.25} />
                  {t(option.label)}
                </label>
              )
            })}
          </div>

          {error ? (
            <p
              id="safety-rating-error"
              role="alert"
              className="flex items-start gap-1.5 text-sm font-semibold text-saffron-ink"
            >
              <IconAlert size={16} className="mt-0.5 flex-none" />
              {error}
            </p>
          ) : null}
        </fieldset>

        <Field
          label={tl(COPY.commentLabel)}
          htmlFor="safety-comment"
          hint={tl(COPY.commentHint)}
        >
          <textarea
            id="safety-comment"
            rows={4}
            maxLength={500}
            value={comment}
            onChange={(event) => {
              setComment(event.target.value)
              setDone(false)
            }}
            className="focusable w-full resize-y rounded-2xl border border-line bg-paper px-4 py-3 text-[15px] leading-relaxed text-ink placeholder:text-ink-faint"
          />
        </Field>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="md">
            <IconSend size={17} />
            {tl(COPY.submit)}
          </Button>
          <span className="font-mono text-xs text-ink-faint">{comment.length}/500</span>
        </div>

        {done ? (
          <p
            role="status"
            className="flex items-center gap-2 text-sm font-semibold text-teal-600"
          >
            <IconCheck size={16} strokeWidth={2.25} />
            {t('common.feedbackThanks')}
          </p>
        ) : null}
      </form>
    </section>
  )
}
