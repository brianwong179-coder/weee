import { notFound } from 'next/navigation'
import { adminEnabled } from '@/lib/admin-guard'
import { getProject } from '@/lib/projects'
import { readProjects } from '@/lib/projects-store'
import { ProjectEditor } from '@/components/admin/project-editor'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Edit project' }

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  if (!adminEnabled()) notFound()
  const { slug } = await params
  // Read fresh from disk so edits made this session show up without a rebuild.
  const projects = await readProjects()
  const project = projects.find((p) => p.slug === slug) ?? getProject(slug)
  if (!project) notFound()

  return <ProjectEditor initial={project} originalSlug={project.slug} />
}
