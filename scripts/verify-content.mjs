#!/usr/bin/env node
/**
 * KOMA content / build verification.
 *
 * Run after `npm run build`:
 *   node scripts/verify-content.mjs
 *
 * Exits non-zero when any check fails.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const results = []

function check(name, fn) {
  try {
    const detail = fn()
    results.push({ ok: true, name, detail: detail || '' })
  } catch (error) {
    results.push({ ok: false, name, detail: error.message })
  }
}

function mustExist(relativePath) {
  const full = path.join(root, relativePath)
  if (!existsSync(full)) throw new Error(`missing ${relativePath}`)
  return true
}

function read(relativePath) {
  const full = path.join(root, relativePath)
  if (!existsSync(full)) throw new Error(`missing ${relativePath}`)
  return readFileSync(full, 'utf8')
}

/** Recursively collect files under `dir` whose names match `pattern`. */
function walkFiles(dir, pattern, collected = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkFiles(full, pattern, collected)
    } else if (entry.isFile() && pattern.test(entry.name)) {
      collected.push(full)
    }
  }
  return collected
}

/** Return `{ line, text }` for each match of `pattern` in `source`. */
function findLineMatches(source, pattern) {
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`
  const regex = new RegExp(pattern.source, flags)
  const matches = []
  let match
  while ((match = regex.exec(source)) !== null) {
    const line = source.slice(0, match.index).split(/\r?\n/).length
    matches.push({ line, text: match[0].trim() })
    if (match.index === regex.lastIndex) regex.lastIndex += 1
  }
  return matches
}

const FOUNDATION_FILES = [
  'package.json',
  'vite.config.js',
  'tailwind.config.js',
  'postcss.config.js',
  'index.html',
  'README.md',
  'src/main.jsx',
  'src/App.jsx',
  'src/index.css',
  'src/lib/i18n.jsx',
  'src/lib/data.js',
  'src/lib/askEngine.js',
  'src/lib/store.js',
  'src/components/ui.jsx',
  'src/components/icons.jsx',
  'src/components/Layout.jsx',
  'src/pages/NotFound.jsx',
  'scripts/verify-content.mjs',
]

const PAGES = ['Home', 'Ask', 'Map', 'Medicine', 'Doctor', 'Safety']

// ---- package + foundation -------------------------------------------------
check('package.json declares dev/build/check scripts', () => {
  const pkg = JSON.parse(read('package.json'))
  const missing = ['dev', 'build', 'check'].filter((key) => !pkg.scripts?.[key])
  if (missing.length) throw new Error(`missing scripts: ${missing.join(', ')}`)
  return 'dev, build, check'
})

for (const file of FOUNDATION_FILES) {
  check(`foundation file exists: ${file}`, () => mustExist(file))
}

// ---- production build -----------------------------------------------------
check('production build output exists (dist/index.html)', () => {
  const html = read('dist/index.html')
  if (!/<div id="root">/.test(html)) {
    throw new Error('dist/index.html has no #root mount point')
  }
  return 'dist/index.html'
})

// ---- page modules ---------------------------------------------------------
for (const page of PAGES) {
  check(`page module: src/pages/${page}.jsx`, () => {
    const source = read(`src/pages/${page}.jsx`)
    if (!/export\s+default/.test(source)) {
      throw new Error('missing `export default`')
    }
    return 'export default present'
  })
}

// ---- content invariants ---------------------------------------------------
check('src/lib/data.js labels demo records (status: \'demo\')', () => {
  const source = read('src/lib/data.js')
  if (!source.includes("status: 'demo'")) {
    throw new Error("no `status: 'demo'` found")
  }
  return 'demo status present'
})

check('src/index.css defines the krama band (.krama)', () => {
  const source = read('src/index.css')
  if (!source.includes('.krama')) throw new Error('no `.krama` rule found')
  if (!source.includes('.krama-v')) throw new Error('no `.krama-v` rule found')
  return '.krama and .krama-v present'
})

check('src/App.jsx references all six journeys', () => {
  const source = read('src/App.jsx')
  const routes = ['/', '/ask', '/map', '/medicine', '/doctor', '/safety']
  const missing = routes.filter((route) => !source.includes(`path="${route}"`))
  if (missing.length) throw new Error(`missing routes: ${missing.join(', ')}`)
  return '6 routes'
})

// ---- safety and ownership invariants --------------------------------------

// Positive dosage signals only: a number followed by a strength unit or a
// frequency phrase. Negative copy ("no dosage", "គ្មានបរិមាណឱសថ", "No dosage
// information") carries no such number and must not trip this.
const DOSAGE_PATTERN =
  /(\d+(\.\d+)?\s?(mg|ml|mcg|g)\b)|(\bmg\/kg\b)|(\d+\s?times a day)/i

check('no dosage, frequency or strength values in src/', () => {
  const files = walkFiles(path.join(root, 'src'), /\.(js|jsx)$/)
  const offenders = []
  for (const file of files) {
    const source = readFileSync(file, 'utf8')
    for (const hit of findLineMatches(source, DOSAGE_PATTERN)) {
      offenders.push(`${path.relative(root, file)}:${hit.line} (${hit.text})`)
    }
  }
  if (offenders.length) {
    throw new Error(
      `${offenders.length} match(es): ${offenders.slice(0, 5).join(' | ')}`,
    )
  }
  return `${files.length} source files clean`
})

// Internal navigation must go through the router (Link / Button as="a"), never
// a raw anchor that would force a full page reload.
const RAW_INTERNAL_ANCHOR = /<a[\s>][^>]*href=["']\//

check('internal navigation uses router links, not full page loads', () => {
  const files = walkFiles(path.join(root, 'src'), /\.jsx$/)
  const offenders = []
  for (const file of files) {
    const source = readFileSync(file, 'utf8')
    for (const hit of findLineMatches(source, RAW_INTERNAL_ANCHOR)) {
      offenders.push(`${path.relative(root, file)}:${hit.line}`)
    }
  }
  if (offenders.length) {
    throw new Error(`raw internal <a href>: ${offenders.slice(0, 6).join(', ')}`)
  }
  return `${files.length} JSX files use router links`
})

let dataModule = null
let dataImportError = null
try {
  dataModule = await import(pathToFileURL(path.join(root, 'src/lib/data.js')).href)
} catch (error) {
  dataImportError = error
}

check('facilities without coordinates keep them null', () => {
  if (dataImportError) {
    throw new Error(`could not import src/lib/data.js: ${dataImportError.message}`)
  }
  const {
    FACILITIES = [],
    MEDICINES = [],
    DOCTORS = [],
    KNOWLEDGE = [],
    SOURCES = [],
  } = dataModule

  const problems = []
  for (const facility of FACILITIES) {
    const latNull = facility.lat === null || facility.lat === undefined
    const lngNull = facility.lng === null || facility.lng === undefined
    if (latNull !== lngNull) problems.push(`${facility.id}: partial coordinates`)
    if (facility.lat === 0 || facility.lng === 0) {
      problems.push(`${facility.id}: zero placeholder coordinate`)
    }
  }

  const sourceIds = new Set(SOURCES.map((source) => source.id))
  const groups = [
    ['FACILITIES', FACILITIES],
    ['MEDICINES', MEDICINES],
    ['DOCTORS', DOCTORS],
    ['KNOWLEDGE', KNOWLEDGE],
  ]
  for (const [label, records] of groups) {
    for (const record of records) {
      if (!sourceIds.has(record.sourceId)) {
        problems.push(`${label} ${record.id}: unknown sourceId ${record.sourceId}`)
      }
    }
  }

  if (problems.length) {
    throw new Error(problems.slice(0, 6).join(' | '))
  }

  const withoutCoords = FACILITIES.filter(
    (facility) => facility.lat === null && facility.lng === null,
  ).length
  return `${FACILITIES.length} facilities, ${withoutCoords} without coordinates, all sourceIds resolve`
})

// ---- report ---------------------------------------------------------------
const failed = results.filter((item) => !item.ok)
const passed = results.length - failed.length

console.log('\nKOMA content checks\n')
for (const item of results) {
  const mark = item.ok ? 'PASS' : 'FAIL'
  const detail = item.detail ? ` — ${item.detail}` : ''
  console.log(`${mark}  ${item.name}${detail}`)
}

console.log(`\n${failed.length ? 'FAILED' : 'PASS'}: ${passed}/${results.length} checks passed\n`)
process.exitCode = failed.length ? 1 : 0
