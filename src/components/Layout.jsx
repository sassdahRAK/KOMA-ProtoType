import { Link, NavLink } from 'react-router-dom'
import { useI18n } from '../lib/i18n.jsx'
import komaLogo from '../assets/koma-logo-removed-bg.png'
import {
  IconAsk,
  IconBook,
  IconDoctor,
  IconMap,
  IconMedicine,
  IconShield,
} from './icons.jsx'

function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}

const NAV_ITEMS = [
  { to: '/ask', km: 'សួរ', en: 'Ask', shortKm: 'សួរ', Icon: IconAsk },
  { to: '/map', km: 'ផែនទី', en: 'Map', shortKm: 'ផែនទី', Icon: IconMap },
  { to: '/medicine', km: 'ឱសថ', en: 'Medicine', shortKm: 'ឱសថ', Icon: IconMedicine },
  { to: '/doctor', km: 'វេជ្ជបណ្ឌិត', en: 'Doctor', shortKm: 'ពេទ្យ', Icon: IconDoctor },
]

const TABS = [
  { to: '/', km: 'ទំព័រដើម', en: 'Home', shortKm: 'ដើម', Icon: IconBook, end: true },
  ...NAV_ITEMS,
]

/* ------------------------------------------------------------------ */
/* Language toggle                                                     */
/* ------------------------------------------------------------------ */

function LanguageToggle({ className }) {
  const { lang, setLang, t } = useI18n()
  const base =
    'focusable inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full px-2.5 text-[12px] font-bold uppercase tracking-[0.08em] transition-colors'

  return (
    <div
      role="group"
      aria-label={t('common.language')}
      className={cx(
        'inline-flex flex-none items-center rounded-full border border-line bg-paper-deep/70 p-0.5',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setLang('km')}
        aria-pressed={lang === 'km'}
        aria-label={`KM — ${t('common.khmer')}`}
        className={cx(
          base,
          lang === 'km'
            ? 'bg-shell text-ink shadow-sm'
            : 'text-ink-soft hover:text-ink',
        )}
      >
        KM
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        aria-label={`EN — ${t('common.english')}`}
        className={cx(
          base,
          lang === 'en'
            ? 'bg-shell text-ink shadow-sm'
            : 'text-ink-soft hover:text-ink',
        )}
      >
        EN
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Wordmark                                                            */
/* ------------------------------------------------------------------ */

function Wordmark() {
  const { lang } = useI18n()
  const tagline =
    lang === 'km'
      ? 'ការថែទាំកូន ចាប់ផ្តើមពីព័ត៌មានត្រឹមត្រូវ'
      : 'Child-health information you can trust'

  return (
    <Link
      to="/"
      className="focusable flex min-h-[44px] min-w-0 items-center gap-2.5 rounded-lg pr-1"
    >
      <img
        src={komaLogo}
        alt=""
        aria-hidden="true"
        width={32}
        height={32}
        className="h-8 w-8 flex-none select-none object-contain"
      />
      <span className="flex min-w-0 flex-col justify-center">
        <span className="font-display text-[20px] font-semibold leading-none tracking-[-0.02em] text-ink">
          KOMA
        </span>
        <span
          className={cx(
            'hidden truncate text-[10px] font-medium leading-tight text-ink-faint md:block',
            lang === 'km' && 'font-khmer',
          )}
        >
          {tagline}
        </span>
      </span>
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/* Shell                                                               */
/* ------------------------------------------------------------------ */

export function AppShell({ children }) {
  const { t, lang } = useI18n()

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only z-[60] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-full focus:bg-pine focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        {t('common.skipToContent')}
      </a>

      {/* ---------------- Slim sticky top bar ---------------- */}
      <header className="sticky top-0 z-40 border-b border-line bg-shell/95 backdrop-blur supports-[backdrop-filter]:bg-shell/85">
        <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between gap-3 px-4 sm:px-6">
          <Wordmark />

          <nav
            aria-label="Main"
            className="hidden items-center gap-0.5 self-stretch md:flex"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                aria-label={`${item.km} — ${item.en}`}
                className={({ isActive }) =>
                  cx(
                    'focusable relative flex min-h-[44px] items-center justify-center rounded-md px-2.5 text-center transition-colors xl:px-3.5',
                    isActive ? 'text-ink' : 'text-ink-soft hover:text-ink',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cx(
                        'font-semibold leading-none',
                        lang === 'km'
                          ? 'font-khmer text-[15px]'
                          : 'text-[13px] tracking-[0.01em]',
                      )}
                    >
                      {lang === 'km' ? item.km : item.en}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cx(
                        'absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-teal transition-opacity duration-200',
                        isActive ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <LanguageToggle />
        </div>
      </header>

      {/* ---------------- Main ---------------- */}
      <main
        id="main"
        className="mx-auto w-full max-w-[1120px] px-4 pb-12 pt-6 sm:px-6 lg:pb-16 lg:pt-10"
      >
        {children}
      </main>

      {/* ---------------- Footer ---------------- */}
      <footer className="border-t border-line/80 px-4 pb-28 pt-6 sm:px-6 lg:pb-10">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-2 text-xs leading-relaxed text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p className="measure">{t('common.notMedicalAdvice')}</p>
          <Link
            to="/safety"
            className="focusable inline-flex min-h-[44px] flex-none items-center gap-1.5 rounded-full px-3 font-semibold text-teal-600 hover:bg-teal-50"
          >
            <IconShield size={15} />
            {t('nav.safety')}
          </Link>
        </div>
      </footer>

      {/* ---------------- Mobile bottom tabs ---------------- */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-shell lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="mx-auto grid max-w-[1120px] grid-cols-5">
          {TABS.map((item) => {
            const { Icon } = item
            const isHome = item.to === '/'
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={isHome || item.end}
                aria-label={`${item.km} — ${item.en}`}
                className={({ isActive }) =>
                  cx(
                    'focusable flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 py-1.5 text-[11px] font-semibold',
                    isActive ? 'text-pine' : 'text-ink-soft',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cx(
                        'flex h-7 w-9 items-center justify-center rounded-full transition-colors',
                        isActive ? 'bg-teal-50' : 'bg-transparent',
                      )}
                    >
                      <Icon size={19} />
                    </span>
                    <span
                      className={cx('leading-none', lang === 'km' && 'font-khmer')}
                    >
                      {lang === 'km' ? item.shortKm : item.en}
                    </span>
                  </>
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
