import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { KNOWLEDGE } from '../lib/data.js'
import { useI18n } from '../lib/i18n.jsx'
import { ask, streamify } from '../lib/askEngine.js'
import { addRecent, listRecent } from '../lib/store.js'
import { DemoBadge, PageHeader, Tag } from '../components/ui.jsx'
import { IconShield } from '../components/icons.jsx'
import AskComposer from '../components/ask/AskComposer.jsx'
import ContextRail from '../components/ask/ContextRail.jsx'
import EmptyConversation from '../components/ask/EmptyConversation.jsx'
import MessageList from '../components/ask/MessageList.jsx'
import { ASK_COPY, ASK_MAX } from '../components/ask/copy.js'

let messageSeq = 0

function makeId(prefix) {
  messageSeq += 1
  return `${prefix}-${Date.now().toString(36)}-${messageSeq}`
}

/**
 * Best-effort last-checked date: the reviewed knowledge note that produced the
 * answer. Provenance falls back to the source's own accessedAt when undefined.
 */
function resolveCheckedAt(result) {
  if (!result.found) return undefined
  if (result.urgent) {
    const urgentDoc = KNOWLEDGE.find((doc) => doc.urgent)
    return urgentDoc?.reviewedAt
  }
  const doc = KNOWLEDGE.find(
    (item) => item.bodyEn === result.text.en || item.bodyKm === result.text.km,
  )
  return doc?.reviewedAt
}

export default function Ask() {
  const { t, tl, lang } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()

  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [error, setError] = useState(null)
  const [streaming, setStreaming] = useState(false)
  const [recents, setRecents] = useState(() => listRecent(4))

  const activeRef = useRef(null)
  const inputRef = useRef(null)
  const sendAnchorRef = useRef(null)
  const bottomRef = useRef(null)
  const nearBottomRef = useRef(true)
  const scrollRafRef = useRef(0)
  const prefilledRef = useRef(false)
  const prevLangRef = useRef(lang)
  const wasStreamingRef = useRef(false)

  const focusSend = useCallback(() => {
    const anchor = sendAnchorRef.current
    const button =
      anchor && typeof anchor.querySelector === 'function'
        ? anchor.querySelector('[data-koma-send]')
        : anchor
    if (button && typeof button.focus === 'function') button.focus()
  }, [])

  const abortActive = useCallback((stopped) => {
    const active = activeRef.current
    if (!active) return
    activeRef.current = null
    active.controller.abort()
    setStreaming(false)
    setMessages((prev) =>
      prev.map((message) =>
        message.id === active.id
          ? {
              ...message,
              streaming: false,
              stopped: stopped || message.stopped,
            }
          : message,
      ),
    )
  }, [])

  const send = useCallback(
    (raw) => {
      const rawText = String(raw ?? '')
      const text = rawText.trim()

      if (!text) {
        setError('empty')
        return
      }
      if (rawText.length > ASK_MAX) {
        setError('tooLong')
        return
      }

      // A new question interrupts any answer still streaming (keep partial).
      abortActive(true)
      setError(null)
      setDraft('')
      addRecent(text)
      setRecents(listRecent(4))

      const answer = ask(text)
      const answerId = makeId('a')
      const userTurn = { id: makeId('u'), role: 'user', text }
      const note = {
        id: answerId,
        role: 'assistant',
        text: answer.text,
        found: answer.found,
        urgent: answer.urgent,
        sourceIds: answer.sourceIds,
        followUps: answer.followUps,
        requestId: answer.requestId,
        checkedAt: resolveCheckedAt(answer),
        streaming: Boolean(answer.found),
        stopped: false,
        streamedLang: lang,
        shown: answer.found ? '' : (answer.text[lang] ?? answer.text.en ?? ''),
      }

      setMessages((prev) => [...prev, userTurn, note])

      if (!answer.found) {
        // The not-covered state is static; no simulated streaming.
        return
      }

      const full = answer.text[lang] ?? answer.text.en ?? ''
      setStreaming(true)
      const controller = new AbortController()
      activeRef.current = { id: answerId, controller }

      streamify(
        full,
        (chunk) => {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === answerId
                ? { ...message, shown: message.shown + chunk }
                : message,
            ),
          )
        },
        { signal: controller.signal },
      ).then(() => {
        if (activeRef.current && activeRef.current.id === answerId) {
          activeRef.current = null
          setMessages((prev) =>
            prev.map((message) =>
              message.id === answerId
                ? { ...message, streaming: false, shown: full }
                : message,
            ),
          )
          setStreaming(false)
        }
      })
    },
    [abortActive, focusSend, lang],
  )

  const stopStreaming = useCallback(() => {
    abortActive(true)
  }, [abortActive])

  const handleDraftChange = useCallback((next) => {
    setDraft(next)
    setError((current) => {
      if (current === 'empty' && next.trim()) return null
      if (current === 'tooLong' && next.length <= ASK_MAX) return null
      return current
    })
  }, [])

  /* ---- Prefill from the home composer (/ask?q=…), once --------------- */
  useEffect(() => {
    if (prefilledRef.current) return
    const query = searchParams.get('q')
    if (!query || !query.trim()) return
    prefilledRef.current = true
    setSearchParams({}, { replace: true })
    const question = query.trim()
    if (question.length > ASK_MAX) {
      // Keep the over-long text editable instead of silently dropping it.
      setDraft(question)
      setError('tooLong')
      requestAnimationFrame(() => inputRef.current?.focus())
      return
    }
    send(question)
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [searchParams, setSearchParams, send])

  /* ---- Language switch: re-render stored text, do not re-run ask ---- */
  useEffect(() => {
    if (prevLangRef.current === lang) return
    prevLangRef.current = lang
    abortActive(false)
  }, [lang, abortActive])

  /* ---- Focus returns to the send button when an answer finishes ----- */
  useEffect(() => {
    if (wasStreamingRef.current && !streaming) {
      wasStreamingRef.current = false
      const raf = requestAnimationFrame(focusSend)
      return () => cancelAnimationFrame(raf)
    }
    wasStreamingRef.current = streaming
    return undefined
  }, [streaming, focusSend])

  /* ---- Abort in-flight streaming on unmount ------------------------- */
  useEffect(
    () => () => {
      const active = activeRef.current
      if (!active) return
      activeRef.current = null
      active.controller.abort()
      setStreaming(false)
      setMessages((prev) =>
        prev.map((message) =>
          message.id === active.id
            ? {
                ...message,
                streaming: false,
                shown: message.text?.[message.streamedLang] ?? message.shown,
              }
            : message,
        ),
      )
    },
    [],
  )

  /* ---- Auto-scroll only when the reader is near the bottom ---------- */
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const distance = doc.scrollHeight - window.scrollY - window.innerHeight
      nearBottomRef.current = distance < 260
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!nearBottomRef.current || scrollRafRef.current) return
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = 0
      try {
        bottomRef.current?.scrollIntoView({ block: 'end', behavior: 'instant' })
      } catch {
        bottomRef.current?.scrollIntoView()
      }
    })
  }, [messages])

  useEffect(
    () => () => {
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current)
    },
    [],
  )

  return (
    <div className="space-y-6 sm:space-y-7">
      <PageHeader
        eyebrow={tl(ASK_COPY.eyebrow)}
        title={tl(ASK_COPY.title)}
        lead={
          <>
            {tl(ASK_COPY.lead)}
            <span className="mt-3 flex items-start gap-1.5 text-[13px] leading-relaxed text-ink-faint">
              <IconShield size={14} className="mt-0.5 flex-none" />
              <span>{t('common.notMedicalAdvice')}</span>
            </span>
          </>
        }
        aside={
          <div className="flex flex-wrap items-center gap-2">
            <DemoBadge label={t('common.demo')} />
            <Tag tone="mint">
              {KNOWLEDGE.length} {tl(ASK_COPY.topicCount)}
            </Tag>
          </div>
        }
      />

      <div className="mx-auto grid w-full min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-8">
        {/* ---------------- Conversation + composer ---------------- */}
        <div className="mx-auto flex w-full min-w-0 max-w-[780px] flex-col">
          {messages.length ? (
            <MessageList messages={messages} onAsk={send} />
          ) : (
            <EmptyConversation recents={recents.slice(0, 3)} onAsk={send} />
          )}

          <div
            ref={bottomRef}
            aria-hidden="true"
            className="scroll-mb-52 lg:scroll-mb-40"
          />

          <AskComposer
            value={draft}
            onChange={handleDraftChange}
            onSend={() => send(draft)}
            onStop={stopStreaming}
            streaming={streaming}
            error={error}
            inputRef={inputRef}
            sendButtonRef={sendAnchorRef}
          />
        </div>

        {/* ---------------- Context rail (after on mobile) ---------- */}
        <aside
          aria-label={tl(ASK_COPY.railEyebrow)}
          className="mx-auto w-full min-w-0 max-w-[780px] lg:sticky lg:top-24 lg:mx-0 lg:max-w-none lg:self-start"
        >
          <ContextRail recents={recents} onAsk={send} />
        </aside>
      </div>
    </div>
  )
}
