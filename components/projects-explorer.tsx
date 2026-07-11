'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'
import { projects, categories } from '@/lib/projects'
import { ProjectCard } from '@/components/project-card'

const filters = ['All', ...categories] as const

const EASE = [0.22, 1, 0.36, 1] as const

export function ProjectsExplorer() {
  const [active, setActive] = useState<(typeof filters)[number]>('All')
  const reduce = useReducedMotion()

  const visible =
    active === 'All'
      ? projects
      : projects.filter((project) => project.category === active)

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
        {filters.map((filter) => {
          const isActive = active === filter
          return (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(filter)}
              className={cn(
                'relative rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                isActive
                  ? 'border-accent text-accent-foreground'
                  : 'border-border text-muted-foreground hover:border-accent/40 hover:bg-accent/5 hover:text-foreground',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-accent"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {filter}
            </button>
          )
        })}
      </div>

      <motion.div layout className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((project) => (
            <motion.div
              key={project.slug}
              layout
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
