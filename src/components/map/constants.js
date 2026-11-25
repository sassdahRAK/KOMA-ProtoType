/**
 * Bilingual display labels for the facility directory.
 *
 * These map the data slugs in `src/lib/data.js` to Khmer/English copy. They
 * never introduce clinical guidance — facilities are navigation only.
 */

export const FACILITY_TYPE_LABELS = {
  hospital: { km: 'មន្ទីរពេទ្យ', en: 'Hospital' },
  'health-center': { km: 'មណ្ឌលសុខភាព', en: 'Health centre' },
  clinic: { km: 'គ្លីនិក', en: 'Clinic' },
}

export const FACILITY_TYPE_OPTIONS = [
  { id: 'all', km: 'ទាំងអស់', en: 'All' },
  { id: 'hospital', ...FACILITY_TYPE_LABELS.hospital },
  { id: 'health-center', ...FACILITY_TYPE_LABELS['health-center'] },
  { id: 'clinic', ...FACILITY_TYPE_LABELS.clinic },
]

const SERVICE_LABELS = {
  emergency: { km: 'សង្គ្រោះបន្ទាន់', en: 'Emergency' },
  surgery: { km: 'វះកាត់', en: 'Surgery' },
  pediatrics: { km: 'ពេទ្យកុមារ', en: 'Paediatrics' },
  laboratory: { km: 'មន្ទីរពិសោធន៍', en: 'Laboratory' },
  inpatient: { km: 'សម្រាកព្យាបាល', en: 'Inpatient' },
  outpatient: { km: 'ពិគ្រោះអ្នកជំងឺក្រៅ', en: 'Outpatient' },
  vaccination: { km: 'ចាក់វ៉ាក់សាំង', en: 'Vaccination' },
  nutrition: { km: 'អាហារូបត្ថម្ភ', en: 'Nutrition' },
  pharmacy: { km: 'ឱសថស្ថាន', en: 'Pharmacy' },
  maternal: { km: 'សុខភាពម្តាយ', en: 'Maternal care' },
  'child-health': { km: 'សុខភាពកុមារ', en: 'Child health' },
}

export function facilityTypeLabel(type) {
  return FACILITY_TYPE_LABELS[type] || { km: type || '', en: type || '' }
}

/**
 * Standard English names for the 25 provinces in `PROVINCES`, keyed by the
 * Khmer value stored on each facility record (which stays the filter value).
 * Unknown keys fall back to the Khmer name — a proper noun — rather than an
 * invented translation.
 */
export const PROVINCE_LABELS = {
  'ភ្នំពេញ': 'Phnom Penh',
  'បន្ទាយមានជ័យ': 'Banteay Meanchey',
  'បាត់ដំបង': 'Battambang',
  'កំពង់ចាម': 'Kampong Cham',
  'កំពង់ឆ្នាំង': 'Kampong Chhnang',
  'កំពង់ស្ពឺ': 'Kampong Speu',
  'កំពង់ធំ': 'Kampong Thom',
  'កំពត': 'Kampot',
  'កណ្តាល': 'Kandal',
  'កែប': 'Kep',
  'កោះកុង': 'Koh Kong',
  'ក្រចេះ': 'Kratie',
  'មណ្ឌលគិរី': 'Mondulkiri',
  'ឧត្តរមានជ័យ': 'Oddar Meanchey',
  'ប៉ៃលិន': 'Pailin',
  'ព្រះសីហនុ': 'Preah Sihanouk',
  'ព្រះវិហារ': 'Preah Vihear',
  'ពោធិ៍សាត់': 'Pursat',
  'ព្រៃវែង': 'Prey Veng',
  'រតនគិរី': 'Ratanakiri',
  'សៀមរាប': 'Siem Reap',
  'ស្ទឹងត្រែង': 'Stung Treng',
  'ស្វាយរៀង': 'Svay Rieng',
  'តាកែវ': 'Takeo',
  'ត្បូងឃ្មុំ': 'Tboung Khmum',
}

export function provinceLabel(province) {
  return { km: province, en: PROVINCE_LABELS[province] || province }
}

export function serviceLabel(service) {
  return SERVICE_LABELS[service] || { km: service, en: service }
}

/** Format stored decimal coordinates without inventing precision. */
export function formatCoords(lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  const latHemisphere = lat >= 0 ? 'N' : 'S'
  const lngHemisphere = lng >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(4)}° ${latHemisphere} · ${Math.abs(lng).toFixed(4)}° ${lngHemisphere}`
}

/** Build a safe tel: href from a display phone number, or null if absent. */
export function telHref(phone) {
  if (!phone) return null
  const cleaned = String(phone).replace(/[^\d+]/g, '')
  return cleaned ? `tel:${cleaned}` : null
}
