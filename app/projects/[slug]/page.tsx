import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { StatusBadge } from '@/components/status-badge'
import { ProjectCard } from '@/components/project-card'
import { cn } from '@/lib/utils'
import { getProject, projects, categoryStyles } from '@/lib/projects'

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return { title: 'Project not found — Brian Wong' }
  return {
    title: `${project.title} — Brian Wong`,
    description: project.summary,
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  const related = projects
    .filter((p) => p.slug !== project.slug && p.category === project.category)
    .slice(0, 3)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <article>
          {/* Header */}
          <div className="relative overflow-hidden border-b border-border">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_120%_at_10%_0%,color-mix(in_oklch,var(--sky)_16%,transparent),transparent_60%),radial-gradient(45%_100%_at_100%_0%,color-mix(in_oklch,var(--accent)_14%,transparent),transparent_55%)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(70%_90%_at_50%_10%,black,transparent)]"
            />
            <div className="mx-auto max-w-4xl px-5 py-12">
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
              >
                <ArrowLeft className="size-4" />
                All projects
              </Link>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className={cn('rounded-full px-2.5 py-0.5 font-mono text-xs font-medium', categoryStyles[project.category])}>
                  {project.category}
                </span>
                <StatusBadge status={project.status} />
                <span className="font-mono text-xs text-muted-foreground">
                  {project.year}
                </span>
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                {project.title}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
                {project.summary}
              </p>
            </div>
          </div>

          {/* Cover */}
          <div className="border-b border-border bg-secondary/40">
            <div className="mx-auto max-w-4xl px-5 py-10">
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border bg-secondary">
                <Image
                  src={project.cover || '/placeholder.svg'}
                  alt={project.title}
                  fill
                  sizes="(max-width: 896px) 100vw, 896px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="mx-auto grid max-w-4xl gap-12 px-5 py-14 lg:grid-cols-[1fr_260px]">
            <div className="order-2 space-y-10 lg:order-1">
              {project.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-xl font-semibold tracking-tight">
                    {section.heading}
                  </h2>
                  <div className="mt-3 space-y-4 leading-relaxed text-muted-foreground">
                    {section.body.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* Spec sidebar */}
            <aside className="order-1 lg:order-2">
              <div className="rounded-lg border border-border bg-card p-5 lg:sticky lg:top-24">
                <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
                  Specifications
                </h2>
                <dl className="mt-4 divide-y divide-border">
                  {project.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-baseline justify-between gap-4 py-2.5"
                    >
                      <dt className="text-sm text-muted-foreground">{spec.label}</dt>
                      <dd className="text-right font-mono text-sm font-medium">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <h3 className="mt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Stack
                </h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-sky/25 bg-sky/10 px-2 py-1 font-mono text-xs text-sky"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </article>

        {/* Related */}
        {related.length > 0 && (
          <section className="border-t border-border bg-secondary/40">
            <div className="mx-auto max-w-6xl px-5 py-14">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold tracking-tight">
                  More {project.category} builds
                </h2>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  All projects
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <ProjectCard key={p.slug} project={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
