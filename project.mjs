#!/usr/bin/env node
/**
 * Project tool CLI — create, edit, list, and delete projects for the site.
 *
 *   node scripts/project.mjs            interactive menu
 *   node scripts/project.mjs list
 *   node scripts/project.mjs new
 *   node scripts/project.mjs edit [slug]
 *   node scripts/project.mjs delete [slug]
 *
 * Also available via package.json scripts: pnpm project, pnpm project:new, etc.
 * Writes content/projects.json. Review the diff and `git push` to publish.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATA_FILE = path.join(ROOT, 'content', 'projects.json')

const CATEGORIES = ['Drone', 'Rocket', 'Flight Control']
const STATUSES = ['Flying', 'In Development', 'Retired', 'Bench Testing']

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
}

const rl = readline.createInterface({ input, output })

// Buffered line reader that works with both an interactive TTY and piped/
// redirected stdin. readline/promises' rl.question rejects pending questions
// when a piped stream hits EOF; queuing 'line' events avoids that race.
const lineQueue = []
const waiters = []
let inputClosed = false
rl.on('line', (line) => {
  const w = waiters.shift()
  if (w) w({ value: line, done: false })
  else lineQueue.push(line)
})
rl.on('close', () => {
  inputClosed = true
  while (waiters.length) waiters.shift()({ value: '', done: true })
})

/** Print a prompt and resolve with the next line (done=true at EOF). */
function readLineRaw(promptText) {
  output.write(promptText)
  if (lineQueue.length) return Promise.resolve({ value: lineQueue.shift(), done: false })
  if (inputClosed) return Promise.resolve({ value: '', done: true })
  return new Promise((resolve) => waiters.push(resolve))
}

async function readLine(promptText) {
  const { value } = await readLineRaw(promptText)
  return value
}

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function readProjects() {
  return JSON.parse(await readFile(DATA_FILE, 'utf8'))
}

async function writeProjects(projects) {
  await writeFile(DATA_FILE, JSON.stringify(projects, null, 2) + '\n', 'utf8')
}

/** Free-text prompt with an optional default (Enter keeps it). */
async function ask(label, def) {
  const hint = def !== undefined && def !== '' ? c.dim(` [${def}]`) : ''
  const answer = (await readLine(`${label}${hint}: `)).trim()
  return answer === '' && def !== undefined ? def : answer
}

/** Required free-text prompt — re-asks until non-empty. */
async function askRequired(label, def) {
  for (;;) {
    const v = await ask(label, def)
    if (v && v.trim()) return v.trim()
    if (inputClosed) return def ? String(def).trim() : ''
    console.log(c.red('  This field is required.'))
  }
}

/** Numbered single choice. */
async function askChoice(label, options, def) {
  console.log(c.bold(label))
  options.forEach((o, i) => {
    const marker = o === def ? c.cyan(' (current)') : ''
    console.log(`  ${i + 1}) ${o}${marker}`)
  })
  for (;;) {
    const raw = await ask('  choose #', def ? String(options.indexOf(def) + 1) : undefined)
    const n = Number(raw)
    if (Number.isInteger(n) && n >= 1 && n <= options.length) return options[n - 1]
    if (inputClosed) return def ?? options[0]
    console.log(c.red('  Enter a number from the list.'))
  }
}

/** Collect a list of single-line values; blank line ends the list. */
async function askList(label, existing = []) {
  console.log(c.bold(label) + c.dim(' (one per line, blank line to finish)'))
  if (existing.length) {
    console.log(c.dim('  current: ' + existing.join(', ')))
    const keep = await ask('  keep current? (Y/n)', 'Y')
    if (keep.toLowerCase() !== 'n') return existing
  }
  const items = []
  for (;;) {
    const v = (await readLine(`  - `)).trim()
    if (v === '') break
    items.push(v)
  }
  return items
}

async function askSpecs(existing = []) {
  console.log(c.bold('Specifications') + c.dim(' (label + value; blank label to finish)'))
  if (existing.length) {
    existing.forEach((s) => console.log(c.dim(`  current: ${s.label} = ${s.value}`)))
    const keep = await ask('  keep current specs? (Y/n)', 'Y')
    if (keep.toLowerCase() !== 'n') return existing
  }
  const specs = []
  for (;;) {
    const label = (await readLine('  spec label: ')).trim()
    if (label === '') break
    const value = (await readLine('  spec value: ')).trim()
    specs.push({ label, value })
  }
  return specs
}

async function askSections(existing = []) {
  console.log(c.bold('Write-up sections') + c.dim(' (heading + paragraphs; blank heading to finish)'))
  if (existing.length) {
    existing.forEach((s) => console.log(c.dim(`  current: "${s.heading}" (${s.body.length} paragraph(s))`)))
    const keep = await ask('  keep current sections? (Y/n)', 'Y')
    if (keep.toLowerCase() !== 'n') return existing
  }
  const sections = []
  for (;;) {
    const heading = (await readLine('  section heading: ')).trim()
    if (heading === '') break
    console.log(c.dim('    paragraphs (blank line to finish this section):'))
    const body = []
    for (;;) {
      const p = (await readLine('    > ')).trim()
      if (p === '') break
      body.push(p)
    }
    sections.push({ heading, body })
  }
  return sections
}

async function promptProject(existing) {
  const isEdit = Boolean(existing)
  const base = existing ?? {}

  const title = await askRequired('Title', base.title)
  const suggestedSlug = base.slug ?? slugify(title)
  const slug = slugify(await ask('Slug (URL)', suggestedSlug)) || suggestedSlug
  const category = await askChoice('Category', CATEGORIES, base.category)
  const status = await askChoice('Status', STATUSES, base.status)
  const year = await askRequired('Year', base.year ?? String(new Date().getFullYear()))
  const tagline = await askRequired('Tagline (one line)', base.tagline)
  const summary = await askRequired('Summary (short paragraph)', base.summary)
  const cover = await ask(
    'Cover image path (e.g. /projects/my-build.png)',
    base.cover ?? '/placeholder.svg',
  )
  const stack = await askList('Tech stack', base.stack ?? [])
  const specs = await askSpecs(base.specs ?? [])
  const sections = await askSections(base.sections ?? [])

  return { slug, title, category, tagline, summary, status, year, cover, stack, specs, sections }
}

function printList(projects) {
  if (!projects.length) return console.log(c.dim('  (no projects yet)'))
  projects.forEach((p, i) => {
    console.log(
      `  ${c.dim(String(i + 1).padStart(2))}  ${c.bold(p.title)} ${c.dim('· ' + p.slug)}`,
    )
    console.log(`      ${c.cyan(p.category)} · ${p.status} · ${p.year}`)
  })
}

async function cmdList() {
  const projects = await readProjects()
  console.log(c.bold(`\n${projects.length} project(s):\n`))
  printList(projects)
}

async function pickSlug(projects, provided, action) {
  if (provided) return provided
  printList(projects)
  const raw = await ask(`\nWhich project to ${action}? (number or slug)`)
  const n = Number(raw)
  if (Number.isInteger(n) && n >= 1 && n <= projects.length) return projects[n - 1].slug
  return raw
}

async function cmdNew() {
  const projects = await readProjects()
  console.log(c.bold('\nNew project\n') + c.dim('Press Enter to accept a [default].\n'))
  const project = await promptProject(null)
  if (projects.some((p) => p.slug === project.slug)) {
    console.log(c.red(`\nA project with slug "${project.slug}" already exists. Aborting.`))
    return
  }
  projects.push(project)
  await writeProjects(projects)
  console.log(c.green(`\n✓ Created "${project.title}" (/projects/${project.slug})`))
  reminder(project.cover)
}

async function cmdEdit(slugArg) {
  const projects = await readProjects()
  const slug = await pickSlug(projects, slugArg, 'edit')
  const existing = projects.find((p) => p.slug === slug)
  if (!existing) return console.log(c.red(`\nNo project with slug "${slug}".`))
  console.log(c.bold(`\nEditing "${existing.title}"\n`) + c.dim('Press Enter to keep the current value.\n'))
  const updated = await promptProject(existing)
  if (updated.slug !== slug && projects.some((p) => p.slug === updated.slug)) {
    console.log(c.red(`\nSlug "${updated.slug}" is already taken. Aborting.`))
    return
  }
  projects[projects.findIndex((p) => p.slug === slug)] = updated
  await writeProjects(projects)
  console.log(c.green(`\n✓ Updated "${updated.title}" (/projects/${updated.slug})`))
  reminder(updated.cover)
}

async function cmdDelete(slugArg) {
  const projects = await readProjects()
  const slug = await pickSlug(projects, slugArg, 'delete')
  const existing = projects.find((p) => p.slug === slug)
  if (!existing) return console.log(c.red(`\nNo project with slug "${slug}".`))
  const confirm = await ask(c.yellow(`Delete "${existing.title}"? This cannot be undone. (y/N)`), 'N')
  if (confirm.toLowerCase() !== 'y') return console.log(c.dim('Cancelled.'))
  await writeProjects(projects.filter((p) => p.slug !== slug))
  console.log(c.green(`\n✓ Deleted "${existing.title}"`))
}

function reminder(cover) {
  if (cover && cover.startsWith('/projects/')) {
    console.log(
      c.dim(`  Reminder: drop the cover image at public${cover} if it isn't there yet.`),
    )
  }
  console.log(c.dim('  Run `pnpm dev` to preview, then commit & push to publish.'))
}

async function menu() {
  console.log(c.bold('\nProject tool') + c.dim(' — mrwongsshenanigans.com\n'))
  const choice = await askChoice('What would you like to do?', [
    'List projects',
    'Create a new project',
    'Edit a project',
    'Delete a project',
    'Quit',
  ])
  switch (choice) {
    case 'List projects': return cmdList()
    case 'Create a new project': return cmdNew()
    case 'Edit a project': return cmdEdit()
    case 'Delete a project': return cmdDelete()
    default: return
  }
}

async function main() {
  const [cmd, arg] = process.argv.slice(2)
  try {
    switch (cmd) {
      case 'list': await cmdList(); break
      case 'new': await cmdNew(); break
      case 'edit': await cmdEdit(arg); break
      case 'delete': await cmdDelete(arg); break
      case undefined: await menu(); break
      default:
        console.log(c.red(`Unknown command "${cmd}".`))
        console.log('Usage: node scripts/project.mjs [list|new|edit|delete]')
    }
  } catch (err) {
    console.error(c.red('\nError: ' + (err?.message ?? err)))
    process.exitCode = 1
  } finally {
    rl.close()
  }
}

main()
