import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import komaLogo from '../assets/koma-logo-removed-bg.png'
import { DOCTORS, FACILITIES, KNOWLEDGE, MEDICINES } from '../lib/data.js'
import { useI18n } from '../lib/i18n.jsx'
import { Divider } from '../components/ui.jsx'
import HowItWorks from '../components/home/HowItWorks.jsx'
import QuestionComposer from '../components/home/QuestionComposer.jsx'
import TrustStrip from '../components/home/TrustStrip.jsx'

const HERO = {
  title: {
    km: 'ការថែទាំកូន ចាប់ផ្តើមពីព័ត៌មានត្រឹមត្រូវ',
    en: 'Caring for your child starts with information you can trust',
  },
}

const DOORS_LABEL = { km: 'ច្រកទ្វារបួន', en: 'Four doors' }

const DOORS = [
  {
    to: '/ask',
    title: { km: 'សួរ', en: 'Ask' },
    count: KNOWLEDGE.length,
    countLabel: { km: 'កំណត់ត្រាអប់រំ', en: 'education notes' },
  },
  {
    to: '/map',
    title: { km: 'ផែនទី', en: 'Map' },
    count: FACILITIES.length,
    countLabel: { km: 'កំណត់ត្រាមណ្ឌលសុខភាព', en: 'facility records' },
  },
  {
    to: '/medicine',
    title: { km: 'ឱសថ', en: 'Medicine' },
    count: MEDICINES.length,
    countLabel: { km: 'កំណត់ត្រាយោងឱសថ', en: 'medicine entries' },
  },
  {
    to: '/doctor',
    title: { km: 'វេជ្ជបណ្ឌិត', en: 'Doctor' },
    count: DOCTORS.length,
    countLabel: { km: 'កំណត់ត្រាបញ្ជីវេជ្ជបណ្ឌិត', en: 'directory listings' },
  },
]

export default function Home() {
  const { tl } = useI18n()

  return (
    <div>
      {/* ---------------- Quiet, ChatGPT-style empty state ---------------- */}
      <section
        aria-labelledby="home-hero-title"
        className="flex min-h-[62vh] flex-col items-center justify-center px-1 pb-8 pt-8 text-center sm:py-16"
      >
        <img
          src={komaLogo}
          alt="KOMA"
          width={84}
          height={84}
          className="h-20 w-20 sm:h-24 sm:w-24"
        />

        <h1
          id="home-hero-title"
          className="mt-6 max-w-[22ch] text-balance font-display text-3xl font-semibold leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-5xl"
        >
          {tl(HERO.title)}
        </h1>

        <div className="mt-7 w-full max-w-[720px] sm:mt-8">
          <QuestionComposer />
        </div>

        <nav
          aria-label={tl(DOORS_LABEL)}
          className="mt-5 flex max-w-[720px] flex-wrap items-center justify-center gap-x-1 gap-y-0.5 sm:mt-6"
        >
          {DOORS.map((door, index) => (
            <Fragment key={door.to}>
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="select-none px-0.5 font-mono text-sm text-line"
                >
                  ·
                </span>
              ) : null}
              <Link
                to={door.to}
                className="focusable inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2 text-[15px] font-semibold text-pine underline-offset-4 transition-colors duration-200 hover:underline"
              >
                {tl(door.title)}
                <span className="font-mono text-xs font-medium text-ink-faint">
                  {door.count}
                </span>
                <span className="sr-only"> {tl(door.countLabel)}</span>
              </Link>
            </Fragment>
          ))}
        </nav>
      </section>

      {/* ---------------- Supporting sections, below the fold ---------------- */}
      <div className="space-y-12 sm:space-y-16">
        <Divider label={tl({ km: 'ដំណើរការ', en: 'How it works' })} />
        <HowItWorks />

        <Divider label={tl({ km: 'ទុកចិត្ត', en: 'Trust' })} />
        <TrustStrip />
      </div>
    </div>
  )
}
