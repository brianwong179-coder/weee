import { notFound } from 'next/navigation'
import { adminEnabled } from '@/lib/admin-guard'
import { ProjectEditor } from '@/components/admin/project-editor'

export const metadata = { title: 'New project' }

export default function NewProjectPage() {
  if (!adminEnabled()) notFound()
  return <ProjectEditor />
}
