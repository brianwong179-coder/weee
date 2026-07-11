import 'server-only'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import {
  categories,
  statuses,
  type Category,
  type Status,
  type Project,
} from '@/lib/projects'

const DATA_FILE = path.join(process.cwd(), 'content', 'projects.json')

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function readProjects(): Promise<Project[]> {
  const raw = await fs.readFile(DATA_FILE, 'utf8')
  return JSON.parse(raw) as Project[]
}

export async function writeProjects(projects: Project[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2) + '\n', 'utf8')
}

/** Validate an untrusted object and return a clean Project or a list of errors. */
export function validateProject(
  input: unknown,
): { ok: true; project: Project } | { ok: false; errors: string[] } {
  const errors: string[] = []
  const o = (input ?? {}) as Record<string, unknown>

  const str = (key: string, required = true): string => {
    const v = o[key]
    if (typeof v !== 'string' || (required && v.trim() === '')) {
      if (required) errors.push(`"${key}" is required`)
      return typeof v === 'string' ? v : ''
    }
    return v
  }

  const title = str('title')
  const slug = slugify(str('slug', false) || title)
  if (!slug) errors.push('"slug" could not be derived (title empty?)')

  const category = str('category') as Category
  if (category && !categories.includes(category)) {
    errors.push(`"category" must be one of: ${categories.join(', ')}`)
  }

  const status = str('status') as Status
  if (status && !statuses.includes(status)) {
    errors.push(`"status" must be one of: ${statuses.join(', ')}`)
  }

  const tagline = str('tagline')
  const summary = str('summary')
  const year = str('year')
  const cover = str('cover', false) || '/placeholder.svg'

  const stack = Array.isArray(o.stack)
    ? (o.stack as unknown[]).map(String).map((s) => s.trim()).filter(Boolean)
    : []

  const specs = Array.isArray(o.specs)
    ? (o.specs as unknown[])
        .map((s) => s as Record<string, unknown>)
        .map((s) => ({
          label: String(s?.label ?? '').trim(),
          value: String(s?.value ?? '').trim(),
        }))
        .filter((s) => s.label || s.value)
    : []

  const sections = Array.isArray(o.sections)
    ? (o.sections as unknown[])
        .map((s) => s as Record<string, unknown>)
        .map((s) => ({
          heading: String(s?.heading ?? '').trim(),
          body: Array.isArray(s?.body)
            ? (s.body as unknown[]).map(String).map((p) => p.trim()).filter(Boolean)
            : [],
        }))
        .filter((s) => s.heading || s.body.length)
    : []

  if (errors.length) return { ok: false, errors }

  return {
    ok: true,
    project: {
      slug,
      title,
      category,
      tagline,
      summary,
      status,
      year,
      cover,
      stack,
      specs,
      sections,
    },
  }
}

/**
 * Create or update a project. When `originalSlug` is provided the matching
 * project is replaced (its position is kept); otherwise the project is appended.
 * Rejects slug collisions with a different project.
 */
export async function upsertProject(
  project: Project,
  originalSlug?: string,
): Promise<{ ok: true; project: Project } | { ok: false; error: string }> {
  const projects = await readProjects()
  const collision = projects.find(
    (p) => p.slug === project.slug && p.slug !== originalSlug,
  )
  if (collision) {
    return { ok: false, error: `A project with slug "${project.slug}" already exists` }
  }

  if (originalSlug) {
    const idx = projects.findIndex((p) => p.slug === originalSlug)
    if (idx === -1) return { ok: false, error: `No project with slug "${originalSlug}"` }
    projects[idx] = project
  } else {
    projects.push(project)
  }

  await writeProjects(projects)
  return { ok: true, project }
}

export async function deleteProject(
  slug: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const projects = await readProjects()
  const idx = projects.findIndex((p) => p.slug === slug)
  if (idx === -1) return { ok: false, error: `No project with slug "${slug}"` }
  projects.splice(idx, 1)
  await writeProjects(projects)
  return { ok: true }
}
