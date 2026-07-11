import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Plus } from 'lucide-react'
import { adminEnabled } from '@/lib/admin-guard'
import { readProjects } from '@/lib/projects-store'
import { AdminProjectList } from '@/components/admin/project-list'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Project admin' }

export default async function AdminPage() {
  if (!adminEnabled()) notFound()
  const projects = await readProjects()

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Local tool
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Projects</h1>
        </div>
        <Link
          href="/admin/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
        >
          <Plus className="size-4" />
          New project
        </Link>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        {projects.length} project(s). Changes write to{' '}
        <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">
          content/projects.json
        </code>
        . Commit &amp; push to publish.
      </p>

      <div className="mt-8">
        <AdminProjectList projects={projects} />
      </div>
    </div>
  )
}
