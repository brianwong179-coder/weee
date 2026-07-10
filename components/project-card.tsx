import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '@/lib/projects'
import { StatusBadge } from '@/components/status-badge'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-accent/50"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <Image
          src={project.cover || '/placeholder.svg'}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/85 px-2.5 py-0.5 font-mono text-xs font-medium backdrop-blur-sm">
          {project.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-tight text-balance">
            {project.title}
          </h3>
          <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {project.tagline}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <StatusBadge status={project.status} />
          <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
        </div>
      </div>
    </Link>
  )
}
