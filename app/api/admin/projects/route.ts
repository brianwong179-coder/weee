import { NextResponse } from 'next/server'
import { adminEnabled } from '@/lib/admin-guard'
import {
  readProjects,
  validateProject,
  upsertProject,
} from '@/lib/projects-store'

function guard() {
  if (!adminEnabled()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return null
}

export async function GET() {
  const blocked = guard()
  if (blocked) return blocked
  return NextResponse.json({ projects: await readProjects() })
}

export async function POST(request: Request) {
  const blocked = guard()
  if (blocked) return blocked

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { project, originalSlug } = (body ?? {}) as {
    project?: unknown
    originalSlug?: string
  }

  const result = validateProject(project)
  if (!result.ok) {
    return NextResponse.json({ error: result.errors.join('; ') }, { status: 400 })
  }

  const saved = await upsertProject(result.project, originalSlug || undefined)
  if (!saved.ok) {
    return NextResponse.json({ error: saved.error }, { status: 409 })
  }

  return NextResponse.json({ project: saved.project })
}
