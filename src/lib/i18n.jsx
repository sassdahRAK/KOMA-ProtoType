import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const STORAGE_KEY = 'koma.lang'

const MONTHS = {
  km: [
    'មករា',
    'កុម្ភៈ',
    'មីនា',
    'មេសា',
    'ឧសភា',
    'មិថុនា',
    'កក្កដា',
    'សីហា',
    'កញ្ញា',
    'តុលា',
    'វិច្ឆិកា',
    'ធ្នូ',
  ],
  en: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
}

/**
 * Common UI strings. Exactly ONE language is visible at a time — the one the
 * user selected in the KM/EN toggle. English mode shows English only (no Khmer
 * glyphs). Khmer mode shows Khmer only; Latin script is allowed solely for
 * proper nouns / technical terms with no Khmer form (KOMA, ORS, WHO, the DEMO
 * status marker, medicine active ingredients, source titles, brand names) and
 * non-translatable data (phone numbers, coordinates, ISO dates, ids, and the
 * literal "KM"/"EN" toggle labels). Never render a primary + secondary pair.
 * `t(key)` and `tl({km, en})` each return that single selected-language string.
 */
const STRINGS = {
  'nav.home': { km: 'ទំព័រដើម', en: 'Home' },
  'nav.ask': { km: 'សួរ', en: 'Ask' },
  'nav.map': { km: 'ផែនទី', en: 'Map' },
  'nav.medicine': { km: 'ឱសថ', en: 'Medicine' },
  'nav.doctor': { km: 'វេជ្ជបណ្ឌិត', en: 'Doctor' },
  'nav.safety': { km: 'សុវត្ថិភាព', en: 'Safety' },

  'common.khmer': { km: 'ខ្មែរ', en: 'Khmer' },
  'common.english': { km: 'អង់គ្លេស', en: 'English' },
  'common.language': { km: 'ភាសា', en: 'Language' },
  'common.search': { km: 'ស្វែងរក', en: 'Search' },
  'common.filter': { km: 'តម្រង', en: 'Filter' },
  'common.all': { km: 'ទាំងអស់', en: 'All' },
  'common.reset': { km: 'កំណត់ឡើងវិញ', en: 'Reset' },
  'common.source': { km: 'ប្រភព', en: 'Source' },
  'common.sources': { km: 'ប្រភព', en: 'Sources' },
  'common.verified': { km: 'បានផ្ទៀងផ្ទាត់', en: 'Verified' },
  'common.demo': { km: 'ទិន្នន័យគំរូ', en: 'Demo' },
  'common.demoNotice': {
    km: 'ទិន្នន័យក្នុងគំរូនេះជាទិន្នន័យសាកល្បងសម្រាប់បង្ហាញ មិនមែនទិន្នន័យផ្លូវការទេ។',
    en: 'Records in this prototype are sample data for demonstration, not official records.',
  },
  'common.lastChecked': { km: 'ពិនិត្យចុងក្រោយ', en: 'Last checked' },
  'common.viewDetails': { km: 'មើលព័ត៌មានលម្អិត', en: 'View details' },
  'common.close': { km: 'បិទ', en: 'Close' },
  'common.back': { km: 'ត្រឡប់ក្រោយ', en: 'Back' },
  'common.loading': { km: 'កំពុងផ្ទុក', en: 'Loading' },
  'common.noResults': { km: 'រកមិនឃើញលទ្ធផល', en: 'No results' },
  'common.feedbackQuestion': {
    km: 'តើព័ត៌មាននេះមានប្រយោជន៍ទេ?',
    en: 'Was this information helpful?',
  },
  'common.feedbackThanks': {
    km: 'អរគុណសម្រាប់មតិយោបល់របស់អ្នក។',
    en: 'Thank you for your feedback.',
  },
  'common.notMedicalAdvice': {
    km: 'ព័ត៌មាននេះសម្រាប់ការអប់រំតែប៉ុណ្ណោះ មិនមែនជាការធ្វើរោគវិនិច្ឆ័យ ឬការណែនាំផ្នែកវេជ្ជសាស្ត្រទេ។',
    en: 'This information is educational only. It is not a diagnosis or medical advice.',
  },
  'common.urgent': { km: 'ស្ថានភាពបន្ទាន់', en: 'Urgent' },
  'common.seeSources': { km: 'មើលប្រភព', en: 'See sources' },
  'common.showing': { km: 'បង្ហាញ', en: 'Showing' },
  'common.results': { km: 'លទ្ធផល', en: 'results' },
  'common.clear': { km: 'សម្អាត', en: 'Clear' },
  'common.helpful': { km: 'មានប្រយោជន៍', en: 'Helpful' },
  'common.notHelpful': { km: 'មិនសូវមានប្រយោជន៍', en: 'Not helpful' },

  // Extra app-chrome strings used by the shell itself.
  'common.skipToContent': { km: 'លោតទៅខ្លឹមសារសំខាន់', en: 'Skip to content' },
  'common.home': { km: 'ទំព័រដើម', en: 'Home' },
  'common.signpost': {
    km: 'ព័ត៌មានអប់រំសម្រាប់មាតាបិតា',
    en: 'Educational information for parents',
  },
  'common.prototypeLine': {
    km: 'គំរូសាកល្បង • ទិន្នន័យគំរូ • មិនមែនឧបករណ៍វេជ្ជសាស្ត្រ',
    en: 'Prototype • Demo data • Not a medical device',
  },
  'common.notFoundTitle': { km: 'រកមិនឃើញទំព័រនេះ', en: 'Page not found' },
  'common.notFoundBody': {
    km: 'តំណភ្ជាប់នេះអាចផ្លាស់ប្តូរ ឬមិនមានទៀត។ អ្នកអាចត្រឡប់ទៅទំព័រដើម។',
    en: 'This link may have changed or no longer exists. You can return to the home page.',
  },
}

function readStoredLang() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'km' || stored === 'en') return stored
  } catch {
    /* storage unavailable — fall through */
  }
  return 'km'
}

function fmtDate(iso, lang = 'km') {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return String(iso)
  const day = date.getUTCDate()
  const month = MONTHS[lang === 'en' ? 'en' : 'km'][date.getUTCMonth()]
  const year = date.getUTCFullYear()
  return `${day} ${month} ${year}`
}

const I18nContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readStoredLang)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* storage unavailable */
    }
    document.documentElement.lang = lang
    // The document title is a visible surface: keep it in the selected
    // language only ("KOMA" is a proper noun and stays Latin in both modes).
    document.title =
      lang === 'km'
        ? 'KOMA — ការថែទាំកូន ចាប់ផ្តើមពីព័ត៌មានត្រឹមត្រូវ'
        : 'KOMA — Child-health information you can trust'
  }, [lang])

  const setLang = useCallback((next) => {
    if (next === 'km' || next === 'en') setLangState(next)
  }, [])

  const t = useCallback(
    (key) => {
      const entry = STRINGS[key]
      if (!entry) return key
      return entry[lang] ?? entry.en ?? entry.km ?? key
    },
    [lang],
  )

  const tl = useCallback(
    (value) => {
      if (value == null) return ''
      if (typeof value === 'string') return value
      return value[lang] ?? value.en ?? value.km ?? ''
    },
    [lang],
  )

  const fmt = useCallback((iso) => fmtDate(iso, lang), [lang])

  const value = useMemo(
    () => ({ lang, setLang, t, tl, fmtDate: fmt, isKm: lang === 'km' }),
    [lang, setLang, t, tl, fmt],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used inside a <LanguageProvider>')
  }
  return ctx
}
