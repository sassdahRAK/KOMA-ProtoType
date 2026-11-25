import { KNOWLEDGE, SUGGESTED } from './data.js'

/**
 * Rule-based, synchronous, offline "ask" engine.
 *
 * It keyword-scores the approved KNOWLEDGE set, never invents facts, and never
 * diagnoses. Urgent-symptom phrases short-circuit to an escalation answer that
 * cites the emergency knowledge document's source.
 */

const KHMER_RE = /[\u1780-\u17FF]/

const URGENT_PHRASES = [
  // English
  'seizure',
  'seizures',
  'convulsion',
  'convulsions',
  'unconscious',
  'unresponsive',
  "can't breathe",
  'cannot breathe',
  'not breathing',
  'stopped breathing',
  'blue lips',
  'blue tongue',
  'turning blue',
  // Khmer
  'ប្រកាច់',
  'សន្លប់',
  'មិនដឹងខ្លួន',
  'ដកដង្ហើមមិនចេញ',
  'ឈប់ដកដង្ហើម',
  'បបូរមាត់ស្វាយ',
]

const NEWBORN_TERMS = [
  'newborn',
  'new born',
  'baby',
  'babies',
  'infant',
  'ទារក',
  'ទារកទើបកើត',
  'ទារកតូច',
]
const FEVER_TERMS = ['fever', 'feverish', 'temperature', 'គ្រុន', 'គ្រុនក្តៅ', 'ក្តៅខ្លួន', 'កម្តៅ']

const URGENT_TEXT = {
  km: 'សញ្ញានេះអាចជាស្ថានភាពបន្ទាន់។ សូមនាំកុមារទៅមណ្ឌលសុខភាព ឬមន្ទីរពេទ្យដែលជិតបំផុតឥឡូវនេះ។ KOMA មិនអាចវិនិច្ឆ័យថាកុមារមានសុវត្ថិភាពទេ ហើយក៏មិនអាចជំនួសការវាយតម្លៃរបស់គ្រូពេទ្យបានដែរ។',
  en: 'These signs can be an emergency. Take your child to the nearest health centre or hospital now. KOMA cannot decide that a child is safe, and cannot replace an assessment by a clinician.',
}

const NOT_FOUND_TEXT = {
  km: 'ខ្ញុំមិនមានព័ត៌មានអប់រំដែលត្រូវនឹងសំណួរនេះទេ។ សូមព្យាយាមសួរអំពីគ្រុនក្តៅ ក្អក រាគ វ៉ាក់សាំង ឬការថែទាំទារក ឬពិគ្រោះជាមួយបុគ្គលិកសុខភាព។',
  en: 'I do not have educational information that matches this question. Try asking about fever, cough, diarrhoea, vaccination or newborn care — or speak with a health worker.',
}

const URGENT_DOC = KNOWLEDGE.find((doc) => doc.urgent) || KNOWLEDGE[0]

function normalise(message) {
  return String(message || '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function includesTerm(haystack, term) {
  const needle = term.toLowerCase().trim()
  if (!needle) return false
  if (KHMER_RE.test(needle)) return haystack.includes(needle)
  // Latin terms match on word boundaries so "hot" does not match "hotel".
  // A trailing plural is allowed so "vaccination" also finds "vaccinations".
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(^|[^a-z0-9])${escaped}(s|es)?([^a-z0-9]|$)`).test(haystack)
}

function detectsUrgent(normalised) {
  if (URGENT_PHRASES.some((term) => includesTerm(normalised, term))) return true
  const hasNewborn = NEWBORN_TERMS.some((term) => includesTerm(normalised, term))
  const hasFever = FEVER_TERMS.some((term) => includesTerm(normalised, term))
  return hasNewborn && hasFever
}

function scoreDoc(normalised, doc) {
  let score = 0
  for (const keyword of doc.keywords) {
    if (includesTerm(normalised, keyword)) {
      score += 2 + Math.min(keyword.split(/\s+/).length, 3)
    }
  }
  // Title matches are strong signals, especially for Khmer (no word breaks).
  if (normalised.includes(doc.titleEn.toLowerCase())) score += 7
  if (KHMER_RE.test(doc.titleKm) && normalised.includes(doc.titleKm.toLowerCase())) {
    score += 7
  }
  return score
}

function followUpsFor(doc, limit = 3) {
  return KNOWLEDGE.filter((item) => item.id !== doc.id)
    .slice(0, limit)
    .map((item) => ({ km: item.titleKm, en: item.titleEn }))
}

function hashString(value) {
  let hash = 5381
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) + hash + value.charCodeAt(i)) >>> 0
  }
  return hash.toString(36)
}

/**
 * @param {string} message
 * @returns {{ requestId: string, urgent: boolean, found: boolean,
 *   text: { km: string, en: string }, sourceIds: string[],
 *   followUps: Array<{ km: string, en: string }> }}
 */
export function ask(message) {
  const normalised = normalise(message)
  const requestId = `req-${hashString(normalised)}`

  if (detectsUrgent(normalised)) {
    return {
      requestId,
      urgent: true,
      found: true,
      text: { ...URGENT_TEXT },
      sourceIds: [URGENT_DOC.sourceId],
      followUps: followUpsFor(URGENT_DOC),
    }
  }

  let best = null
  let bestScore = 0
  for (const doc of KNOWLEDGE) {
    const score = scoreDoc(normalised, doc)
    if (score > bestScore) {
      best = doc
      bestScore = score
    }
  }

  if (!best || bestScore < 2) {
    return {
      requestId,
      urgent: false,
      found: false,
      text: { ...NOT_FOUND_TEXT },
      sourceIds: [],
      followUps: SUGGESTED.slice(0, 3).map((item) => ({ km: item.km, en: item.en })),
    }
  }

  return {
    requestId,
    urgent: false,
    found: true,
    text: { km: best.bodyKm, en: best.bodyEn },
    sourceIds: [best.sourceId],
    followUps: followUpsFor(best),
  }
}

/* ------------------------------------------------------------------ */
/* Streaming helper                                                    */
/* ------------------------------------------------------------------ */

function prefersReducedMotion() {
  try {
    return (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  } catch {
    return false
  }
}

function segment(text) {
  try {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
      return Array.from(seg.segment(text), (part) => part.segment)
    }
  } catch {
    /* fall through */
  }
  return Array.from(text)
}

/**
 * Reveal `text` progressively through `onChunk` (each call receives the next
 * piece of text, not the accumulated string), then resolve. Resolves at once
 * when the signal is aborted or the user prefers reduced motion (the whole
 * text is delivered in a single chunk in that case).
 *
 * @param {string} text
 * @param {(chunk: string) => void} onChunk
 * @param {{ intervalMs?: number, signal?: AbortSignal }} [options]
 * @returns {Promise<void>}
 */
export function streamify(text, onChunk, { intervalMs = 18, signal } = {}) {
  const full = typeof text === 'string' ? text : String(text ?? '')
  const emit = typeof onChunk === 'function' ? onChunk : () => {}

  if (!full) return Promise.resolve()

  if (signal?.aborted || prefersReducedMotion()) {
    if (!signal?.aborted) emit(full)
    return Promise.resolve()
  }

  const parts = segment(full)
  // Aim for roughly 140 reveals regardless of answer length.
  const chunkSize = Math.max(1, Math.ceil(parts.length / 140))
  const delay = Number.isFinite(intervalMs) && intervalMs >= 0 ? intervalMs : 18

  return new Promise((resolve) => {
    let index = 0
    let timer = null

    const finish = () => {
      if (timer) clearTimeout(timer)
      timer = null
      if (signal) signal.removeEventListener('abort', onAbort)
      resolve()
    }

    const onAbort = () => {
      if (timer) clearTimeout(timer)
      timer = null
      resolve()
    }

    signal?.addEventListener('abort', onAbort, { once: true })

    const step = () => {
      if (signal?.aborted) {
        finish()
        return
      }
      const next = parts.slice(index, index + chunkSize).join('')
      index += chunkSize
      if (next) {
        try {
          emit(next)
        } catch {
          /* a consumer callback must not hang the promise */
        }
      }
      if (index >= parts.length) {
        finish()
        return
      }
      timer = setTimeout(step, delay)
    }

    timer = setTimeout(step, delay)
  })
}
