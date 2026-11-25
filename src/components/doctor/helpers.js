import { FACILITIES, SPECIALTIES } from '../../lib/data.js'

/** Resolve a facility id without ever throwing on a missing record. */
export function facilityFor(id) {
  if (!id) return null
  return FACILITIES.find((facility) => facility.id === id) || null
}

/** Khmer-first specialty label, with an English fallback from SPECIALTIES. */
export function specialtyFor(doctor) {
  const meta =
    SPECIALTIES.find((specialty) => specialty.id === doctor?.specialty) || null
  return {
    km: doctor?.specialtyKm || meta?.km || '—',
    en: meta?.en || '—',
  }
}

/**
 * Only derive a tel: href from a phone that is actually present in the data.
 * No number is ever constructed, guessed or padded.
 */
export function telHref(phone) {
  if (!phone) return null
  const cleaned = String(phone).replace(/[^\d+]/g, '')
  return cleaned ? `tel:${cleaned}` : null
}

/**
 * Monogram initials derived from the name actually on screen, so the avatar
 * always matches the selected-language display name. No photos, no faces.
 */
export function doctorInitials(doctor, lang = 'en') {
  if (lang === 'km') {
    const km = String(doctor?.nameKm || '').trim()
    const kmParts = km.split(/\s+/).filter(Boolean)
    if (kmParts.length >= 2) {
      return `${kmParts[0][0]}${kmParts[kmParts.length - 1][0]}`
    }
    if (kmParts.length === 1) return kmParts[0].slice(0, 2)
    return '·'
  }

  const en = String(doctor?.nameEn || '')
    .replace(/^dr\.?\s+/i, '')
    .trim()
  const parts = en.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return '·'
}
