/**
 * Small, storage-safe persistence helpers.
 * Uses localStorage when available and silently degrades otherwise — nothing
 * here may throw, including in private browsing or server-side checks.
 */

const FEEDBACK_KEY = 'koma.feedback'
const RECENT_KEY = 'koma.recent'
const RECENT_LIMIT = 20

function getStorage() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    return window.localStorage
  } catch {
    return null
  }
}

function readArray(key) {
  const storage = getStorage()
  if (!storage) return []
  try {
    const raw = storage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeArray(key, value) {
  const storage = getStorage()
  if (!storage) return false
  try {
    storage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

/**
 * @param {{ feature: string, rating: string|number, comment?: string }} input
 * @returns {{ accepted: true }}
 */
export function addFeedback({ feature, rating, comment } = {}) {
  try {
    const entry = {
      feature: String(feature ?? 'unknown'),
      rating: rating ?? null,
      comment: comment ? String(comment).slice(0, 500) : '',
      createdAt: new Date().toISOString(),
    }
    const current = readArray(FEEDBACK_KEY)
    current.unshift(entry)
    writeArray(FEEDBACK_KEY, current.slice(0, 200))
  } catch {
    /* never throw */
  }
  return { accepted: true }
}

/** @returns {Array<{feature: string, rating: string|number|null, comment: string, createdAt: string}>} */
export function listFeedback() {
  return readArray(FEEDBACK_KEY)
}

/** @param {string} question */
export function addRecent(question) {
  try {
    const text = String(question ?? '').trim()
    if (!text) return
    const current = readArray(RECENT_KEY).filter(
      (item) => typeof item === 'string' && item !== text,
    )
    current.unshift(text.slice(0, 400))
    writeArray(RECENT_KEY, current.slice(0, RECENT_LIMIT))
  } catch {
    /* never throw */
  }
}

/**
 * @param {number} [limit]
 * @returns {string[]}
 */
export function listRecent(limit = 5) {
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 5
  return readArray(RECENT_KEY)
    .filter((item) => typeof item === 'string' && item.trim())
    .slice(0, safeLimit)
}
