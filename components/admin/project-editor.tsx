'use client'

import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Upload, X } from 'lucide-react'
import Link from 'next/link'
import {
  categories,
  statuses,
  type Category,
  type Project,
  type Status,
} from '@/lib/projects'
import { ProjectCard } from '@/components/project-card'

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const EMPTY: Project = {
  slug: '',
  title: '',
  category: 'Drone',
  tagline: '',
  summary: '',
  status: 'In Development',
  year: String(new Date().getFullYear()),
  cover: '/placeholder.svg',
  stack: [],
  specs: [],
  sections: [],
}

const labelCls = 'block text-sm font-medium'
const inputCls =
  'mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent'

export function ProjectEditor({
  initial,
  originalSlug,
}: {
  initial?: Project
  originalSlug?: string
}) {
  const router = useRouter()
  const [form, setForm] = useState<Project>(initial ?? EMPTY)
  const [slugTouched, setSlugTouched] = useState(Boolean(initial))
  const [stackDraft, setStackDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const isEdit = Boolean(originalSlug)

  function set<K extends keyof Project>(key: K, value: Project[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const previewProject: Project = useMemo(
    () => ({
      ...form,
      slug: form.slug || slugify(form.title) || 'preview',
      title: form.title || 'Untitled project',
      tagline: form.tagline || 'Your tagline appears here.',
      cover: form.cover || '/placeholder.svg',
    }),
    [form],
  )

  function onTitleChange(value: string) {
    setForm((f) => ({
      ...f,
      title: value,
      slug: slugTouched ? f.slug : slugify(value),
    }))
  }

  function addStack() {
    const v = stackDraft.trim()
    if (!v) return
    if (!form.stack.includes(v)) set('stack', [...form.stack, v])
    setStackDraft('')
  }

  async function onUpload(file: File) {
    setUploading(true)
    setError(null)
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      set('cover', data.path)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function save() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: form, originalSlug }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
      >
        <ArrowLeft className="size-4" />
        All projects
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          {isEdit ? `Edit: ${initial?.title}` : 'New project'}
        </h1>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-50"
        >
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create project'}
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className={labelCls}>Title</label>
            <input
              className={inputCls}
              value={form.title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Vega-1 Quadcopter"
            />
          </div>

          <div>
            <label className={labelCls}>
              Slug <span className="text-muted-foreground">(URL)</span>
            </label>
            <input
              className={inputCls + ' font-mono'}
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true)
                set('slug', slugify(e.target.value))
              }}
              placeholder="vega-1-quadcopter"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              /projects/{form.slug || slugify(form.title) || '…'}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Category</label>
              <select
                className={inputCls}
                value={form.category}
                onChange={(e) => set('category', e.target.value as Category)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select
                className={inputCls}
                value={form.status}
                onChange={(e) => set('status', e.target.value as Status)}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Year</label>
              <input
                className={inputCls + ' font-mono'}
                value={form.year}
                onChange={(e) => set('year', e.target.value)}
                placeholder="2025"
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Tagline</label>
            <input
              className={inputCls}
              value={form.tagline}
              onChange={(e) => set('tagline', e.target.value)}
              placeholder="One-line hook shown on the card."
            />
          </div>

          <div>
            <label className={labelCls}>Summary</label>
            <textarea
              className={inputCls + ' min-h-24 resize-y'}
              value={form.summary}
              onChange={(e) => set('summary', e.target.value)}
              placeholder="Short paragraph shown at the top of the project page."
            />
          </div>

          {/* Cover */}
          <div>
            <label className={labelCls}>Cover image</label>
            <div className="mt-1.5 flex gap-2">
              <input
                className={inputCls + ' mt-0 font-mono'}
                value={form.cover}
                onChange={(e) => set('cover', e.target.value)}
                placeholder="/projects/my-build.png"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-50"
              >
                <Upload className="size-4" />
                {uploading ? 'Uploading…' : 'Upload'}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) onUpload(file)
                  e.target.value = ''
                }}
              />
            </div>
          </div>

          {/* Stack */}
          <div>
            <label className={labelCls}>Tech stack</label>
            <div className="mt-1.5 flex gap-2">
              <input
                className={inputCls + ' mt-0'}
                value={stackDraft}
                onChange={(e) => setStackDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addStack()
                  }
                }}
                placeholder="Add an item and press Enter"
              />
              <button
                type="button"
                onClick={addStack}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
              >
                <Plus className="size-4" />
                Add
              </button>
            </div>
            {form.stack.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {form.stack.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 rounded-md border border-sky/25 bg-sky/10 px-2 py-1 font-mono text-xs text-sky"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() =>
                        set('stack', form.stack.filter((s) => s !== item))
                      }
                      className="text-sky/70 hover:text-sky"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Specs */}
          <div>
            <div className="flex items-center justify-between">
              <label className={labelCls}>Specifications</label>
              <button
                type="button"
                onClick={() => set('specs', [...form.specs, { label: '', value: '' }])}
                className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
              >
                <Plus className="size-4" /> Add spec
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {form.specs.map((spec, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className={inputCls + ' mt-0'}
                    value={spec.label}
                    onChange={(e) => {
                      const specs = [...form.specs]
                      specs[i] = { ...specs[i], label: e.target.value }
                      set('specs', specs)
                    }}
                    placeholder="Label (e.g. Flight time)"
                  />
                  <input
                    className={inputCls + ' mt-0 font-mono'}
                    value={spec.value}
                    onChange={(e) => {
                      const specs = [...form.specs]
                      specs[i] = { ...specs[i], value: e.target.value }
                      set('specs', specs)
                    }}
                    placeholder="Value (e.g. ~6.5 min)"
                  />
                  <button
                    type="button"
                    onClick={() => set('specs', form.specs.filter((_, j) => j !== i))}
                    className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div>
            <div className="flex items-center justify-between">
              <label className={labelCls}>Write-up sections</label>
              <button
                type="button"
                onClick={() =>
                  set('sections', [...form.sections, { heading: '', body: [] }])
                }
                className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
              >
                <Plus className="size-4" /> Add section
              </button>
            </div>
            <div className="mt-2 space-y-4">
              {form.sections.map((section, i) => (
                <div key={i} className="rounded-lg border border-border p-3">
                  <div className="flex gap-2">
                    <input
                      className={inputCls + ' mt-0 font-medium'}
                      value={section.heading}
                      onChange={(e) => {
                        const sections = [...form.sections]
                        sections[i] = { ...sections[i], heading: e.target.value }
                        set('sections', sections)
                      }}
                      placeholder="Section heading"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        set('sections', form.sections.filter((_, j) => j !== i))
                      }
                      className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <textarea
                    className={inputCls + ' min-h-28 resize-y'}
                    value={section.body.join('\n\n')}
                    onChange={(e) => {
                      const sections = [...form.sections]
                      sections[i] = {
                        ...sections[i],
                        body: e.target.value.split(/\n\s*\n/),
                      }
                      set('sections', sections)
                    }}
                    placeholder="Body paragraphs — separate each paragraph with a blank line."
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live preview */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Card preview
          </p>
          <div className="pointer-events-none">
            <ProjectCard project={previewProject} />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            The full page (specs, stack, sections) renders at{' '}
            <code className="font-mono">/projects/{previewProject.slug}</code> after
            you save.
          </p>
        </aside>
      </div>
    </div>
  )
}
