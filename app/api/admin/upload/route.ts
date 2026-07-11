import { NextResponse } from 'next/server'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { adminEnabled } from '@/lib/admin-guard'
import { slugify } from '@/lib/projects-store'

const ALLOWED = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'avif'])

export async function POST(request: Request) {
  if (!adminEnabled()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const form = await request.formData()
  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const ext = (file.name.split('.').pop() || '').toLowerCase()
  if (!ALLOWED.has(ext)) {
    return NextResponse.json(
      { error: `Unsupported file type ".${ext}"` },
      { status: 400 },
    )
  }

  const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'image'
  const filename = `${base}.${ext}`
  const dir = path.join(process.cwd(), 'public', 'projects')
  await fs.mkdir(dir, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(path.join(dir, filename), buffer)

  return NextResponse.json({ path: `/projects/${filename}` })
}
