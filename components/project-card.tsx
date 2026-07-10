'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'
import type { Project } from '@/lib/projects'
import { categoryStyles } from '@/lib/projects'
import { StatusBadge } from '@/components/status-badge'

export function ProjectCard({ project }: { project: Project }) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -6 }}
      whileTap={reduce ? undefined : { scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="h-full"
    >
      <Link
        href={`/projects/${project.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10"
      >
        <div className="shine relative aspect-[4/3] overflow-hidden bg-secondary">
          <Image
            src={project.cover || '/placeholder.svg'}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <span
            className={cn(
              'absolute left-3 top-3 rounded-full px-2.5 py-0.5 font-mono text-xs font-medium backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-0.5',
              categoryStyles[project.category],
            )}
          >
            {project.category}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold leading-tight text-balance transition-colors duration-300 group-hover:text-accent">
              {project.title}
            </h3>
            <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {project.tagline}
          </p>
          <div className="mt-auto flex items-center justify-between pt-2">
            <StatusBadge status={project.status} />
            <span className="font-mono text-xs text-muted-foreground">
              {project.year}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
