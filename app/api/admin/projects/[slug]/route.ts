import { NextResponse } from 'next/server'
import { adminEnabled } from '@/lib/admin-guard'
import { deleteProject } from '@/lib/projects-store'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!adminEnabled()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  const { slug } = await params
  const result = await deleteProject(slug)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
