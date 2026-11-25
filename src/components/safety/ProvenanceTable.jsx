import { SOURCES } from '../../lib/data.js'
import { useI18n } from '../../lib/i18n.jsx'
import { DemoBadge, SectionHeading, VerifiedBadge } from '../ui.jsx'

const COLUMNS = {
  source: { km: 'ប្រភព', en: 'Source' },
  publisher: { km: 'អ្នកបោះពុម្ព', en: 'Publisher' },
  licence: { km: 'អាជ្ញាបណ្ណ / លក្ខខណ្ឌ', en: 'Licence / terms' },
  accessed: { km: 'កាលបរិច្ឆេទចូលមើល', en: 'Accessed' },
  status: { km: 'ស្ថានភាព', en: 'Status' },
}

/**
 * Every source behind the demo data, as a real table. The wrapper scrolls on
 * small screens so the page itself never scrolls horizontally.
 */
export default function ProvenanceTable() {
  const { t, tl, fmtDate } = useI18n()

  return (
    <section
      className="space-y-5"
      aria-label={tl({ km: 'តារាងប្រភព', en: 'Source table' })}
    >
      <SectionHeading
        eyebrow={tl({ km: 'ប្រភព', en: 'Provenance' })}
        title={tl({ km: 'ប្រភពនៃទិន្នន័យ', en: 'Where the data comes from' })}
        lead={tl({
          km: 'រាល់កំណត់ត្រាគំរូត្រូវបានដាក់ស្លាក DEMO ហើយកំណត់ត្រាដែលបានផ្ទៀងផ្ទាត់មានប្រភពសាធារណៈ។',
          en: 'Every demo record is labelled DEMO, and every verified record carries a public source.',
        })}
      />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <caption className="sr-only">
              {tl({
                km: 'តារាងប្រភពដែលប្រើក្នុងទិន្នន័យគំរូរបស់ KOMA',
                en: 'Sources used in KOMA demo data',
              })}
            </caption>
            <thead>
              <tr className="border-b border-line bg-paper-deep/60">
                {['source', 'publisher', 'licence', 'accessed', 'status'].map(
                  (key) => (
                    <th
                      key={key}
                      scope="col"
                      className="px-4 py-3 font-semibold text-ink"
                    >
                      {tl(COLUMNS[key])}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {SOURCES.map((source) => (
                <tr
                  key={source.id}
                  className="border-b border-line align-top last:border-0"
                >
                  <th scope="row" className="px-4 py-3 text-left font-normal">
                    <span className="block font-semibold text-ink">
                      {source.name}
                    </span>
                    <span className="mt-0.5 block font-mono text-[10px] font-normal tracking-wide text-ink-faint">
                      {source.id}
                    </span>
                  </th>
                  <td className="px-4 py-3 text-ink-soft">{source.publisher}</td>
                  <td className="px-4 py-3 text-ink-soft">{source.license}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[13px] text-ink-soft">
                    {fmtDate(source.accessedAt)}
                  </td>
                  <td className="px-4 py-3">
                    {source.status === 'verified' ? (
                      <VerifiedBadge />
                    ) : (
                      <DemoBadge label={t('common.demo')} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-ink-faint sm:hidden">
        {tl({
          km: 'អូសផ្ដេកលើតារាងដើម្បីមើលជួរឈរទាំងអស់។',
          en: 'Scroll the table sideways to see every column.',
        })}
      </p>
    </section>
  )
}
