'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { categoryStyles, type Project } from '@/lib/projects'

export function AdminProjectList({ projects }: { projects: Project[] }) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function remove(project: Project) {
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return
    setBusy(project.slug)
    setError(null)
    try {
      const res = await fetch(`/api/admin/projects/${project.slug}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Delete failed')
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setBusy(null)
    }
  }

  if (!projects.length) {
    return (
      <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        No projects yet. Create your first one.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      {projects.map((project) => (
        <div
          key={project.slug}
          className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4"
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 font-mono text-[11px] font-medium',
                  categoryStyles[project.category],
                )}
              >
                {project.category}
              </span>
              <h2 className="truncate font-medium">{project.title}</h2>
            </div>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {project.tagline}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              /projects/{project.slug} · {project.status} · {project.year}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Link
              href={`/projects/${project.slug}`}
              target="_blank"
              title="View live page"
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ExternalLink className="size-4" />
            </Link>
            <Link
              href={`/admin/${project.slug}`}
              title="Edit"
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Pencil className="size-4" />
            </Link>
            <button
              type="button"
              onClick={() => remove(project)}
              disabled={busy === project.slug}
              title="Delete"
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
