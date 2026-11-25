/**
 * Display labels for the medicine categories that exist in the demo data.
 * This is a presentation-only map: unknown categories fall back to the raw
 * catalogue value, and nothing here adds health content.
 */
const KM_CATEGORY = {
  'Pain & fever': 'ការឈឺចាប់ និងគ្រុនក្តៅ',
  Rehydration: 'ជំនួសជាតិទឹក',
  Antibiotic: 'ថ្នាំអង់ទីប៊ីយ៉ូទិក',
  Allergy: 'អាឡែស៊ី',
  Respiratory: 'ផ្លូវដង្ហើម',
  Vitamin: 'វីតាមីន',
}

export function categoryLabel(category, lang = 'km') {
  if (category == null) return ''
  if (lang === 'km' && KM_CATEGORY[category]) return KM_CATEGORY[category]
  return category
}
