'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { projects, categories } from '@/lib/projects'
import { ProjectCard } from '@/components/project-card'

const filters = ['All', ...categories] as const

export function ProjectsExplorer() {
  const [active, setActive] = useState<(typeof filters)[number]>('All')

  const visible =
    active === 'All'
      ? projects
      : projects.filter((project) => project.category === active)

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={active === filter}
            onClick={() => setActive(filter)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
              active === filter
                ? 'border-accent bg-accent text-accent-foreground'
                : 'border-border text-muted-foreground hover:border-accent/40 hover:bg-accent/5 hover:text-foreground',
            )}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  )
}
