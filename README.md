# KOMA — ការថែទាំកូន ចាប់ផ្តើមពីព័ត៌មានត្រឹមត្រូវ

KOMA is a bilingual Khmer/English **information and navigation assistant** for Cambodian
parents wondering about their child's health. It helps a parent ask a general question,
find a listed health facility, read a carefully referenced medicine entry, and find a
doctor or facility contact pathway.

This repository is a **Phase 1 prototype**: a React + Vite front end that runs entirely
offline with curated demo data. There is no model provider, no remote API and no map
tile service at runtime. Google Fonts is the only network request, and system fallbacks
are declared for every family.

> KOMA is not a doctor. It does not diagnose, prescribe, calculate doses, choose a
> treatment, or decide that a child is safe. Every health surface carries a
> not-medical-advice notice. Urgent symptoms always escalate to real professional care.

## Run

Requires Node 18+.

```bash
npm install
npm run dev        # local dev server, http://localhost:5173
npm run build      # production build to dist/
npm run preview    # preview the production build
npm run check      # verify build output + content invariants (run after build)
```

`npm run check` runs `scripts/verify-content.mjs`. It checks that `dist/index.html`
exists, that all six page modules exist and export a default component, that the demo
data is labelled, and that the krama band styles are present. It exits non-zero on any
failure.

## Structure

```
index.html                 Khmer-first shell, fonts, logo favicon, theme colour
src/
  main.jsx                 React root
  App.jsx                  BrowserRouter + AppShell + routes
  index.css                Tailwind layers, tokens, .krama/.krama-v, .card, .mono-label
  lib/
    i18n.jsx               LanguageProvider + useI18n (km/en, localStorage)
    data.js                SOURCES, FACILITIES, MEDICINES, DOCTORS, KNOWLEDGE, ...
    askEngine.js           rule-based ask() + streamify()
    store.js               storage-safe feedback + recent-question helpers
  components/
    Layout.jsx             AppShell: slim top bar, mobile bottom tabs, footer
    ui.jsx                 shared primitives (Button, Provenance, SafetyStripe, ...)
    icons.jsx              22 inline SVG icons
  pages/                   Home, Ask, Map, Medicine, Doctor, Safety, NotFound
scripts/verify-content.mjs build/content checks
```

Routes: `/`, `/ask`, `/map`, `/medicine`, `/doctor`, `/safety`, and `*` → NotFound.

## Data provenance policy

- Every facility, medicine, doctor and knowledge document carries a `sourceId` that
  resolves to an entry in `SOURCES` (publisher, URL, licence, accessed date).
- Records carry `status: 'demo'` or `status: 'verified'`. Demo records are always
  visibly labelled **DEMO** and must not be presented as official data.
- At most two public facility records are marked `verified`, and they intentionally keep
  `lat`, `lng` and `phone` as `null` when the prototype does not have a checked value.
  Missing data stays `null`; it is never guessed or inferred.
- Dates are shown with a "last checked" label. A citation is not proof; it is a trail.
- Medicines contain general purpose and warning information only. There is no dose,
  weight-based calculation, frequency or treatment choice anywhere in this repository.

## Design tokens

Defined in `tailwind.config.js` and mirrored as CSS custom properties in
`src/index.css`. Use only these names.

The palette is derived from the KOMA logo (`src/assets/koma-logo-removed-bg.png`):
logo teal, warm gold and heart-red on a cool white. Token names are unchanged.

| Token | Value | Use |
| --- | --- | --- |
| `paper` | `#F7FAFA` | page background (cool white) |
| `paper-deep` | `#EAF2F4` | quiet fills, inactive chips |
| `shell` | `#FFFFFF` | cards and bars |
| `pine` / `pine-800` / `pine-700` | `#14656F` / `#17555E` / `#1A6570` | body text at 6.8:1, dark accents |
| `teal` / `teal-600` / `teal-100` / `teal-50` | `#1E8E9C` / `#16707C` / `#CFE9EE` / `#EEF7F9` | UI, icons, large text only |
| `mint` | `#D8F0F3` | soft active surfaces |
| `saffron` / `saffron-tint` / `saffron-ink` | `#EE9E33` / `#FDF1DF` / `#7A4A05` | gold fills/tints; text uses saffron-ink |
| `clay` / `clay-tint` / `clay-ink` | `#D8352F` / `#FBE7E5` / `#8E2019` | urgent/emergency only |
| `ink` / `ink-soft` / `ink-faint` | `#10262B` / `#415B60` / `#5F797E` | text |
| `line` | `#DCE8EA` | hairline borders |

Contrast rule: body text meets 4.5:1 using `ink`, `ink-soft`, `pine` or `clay`;
`teal` (3.9:1) is reserved for large text, icons and UI; `saffron` is a fill only.

Fonts: `font-display` Bricolage Grotesque, `font-sans` Manrope, `font-khmer` Noto Sans
Khmer, `font-mono` IBM Plex Mono. Shadow `shadow-lift`. Card radius 22px.

Global classes: `.krama` / `.krama-v` (woven band, retained but unused in the shell),
`.card`, `.mono-label`, `.measure`, `.focusable`. Khmer is primary:
`html[lang="km"]` puts Noto Sans Khmer first.

## Accessibility and safety floors

- 4.5:1 body contrast, visible `:focus-visible` rings, real buttons and links.
- 44px touch targets, logical heading order, alt text, `prefers-reduced-motion` honoured
  (including `streamify()`, which emits the full answer at once).
- Responsive to 360px with no horizontal scrolling.
- No diagnosis, dosage, prescribing or treatment choice; no invented emergency numbers.

## Roadmap

1. Foundation and design system (this stage).
2. Journey pages: Ask, Map, Medicine, Doctor, Safety.
3. Qualified Cambodian clinical review of every knowledge document.
4. Data ingestion with per-record verification workflow; replace demo records.
5. Retrieval-backed answer adapter behind the existing `ask()` interface, with logged
   sources and a documented incident path.
6. Mobile usability and plain-language testing with Khmer-speaking parents.
