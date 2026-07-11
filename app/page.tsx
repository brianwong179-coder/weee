import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ProjectCard } from '@/components/project-card'
import { HomeHero } from '@/components/home-hero'
import { HomeStats } from '@/components/home-stats'
import { Reveal, Stagger, StaggerItem } from '@/components/motion'
import { projects } from '@/lib/projects'

export default function HomePage() {
  const featured = projects.slice(0, 3)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <HomeHero />

        {/* Stats */}
        <HomeStats />

        {/* Featured projects */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <Reveal className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Featured <span className="text-gradient-warm">builds</span>
              </h2>
              <p className="mt-2 text-muted-foreground">
                A selection of what&apos;s currently on the bench and in the air.
              </p>
            </div>
            <Link
              href="/projects"
              className="group hidden shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              View all
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
          <Stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((project) => (
              <StaggerItem key={project.slug}>
                <ProjectCard project={project} />
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* About */}
        <section id="about" className="sunrise-tint border-t border-border bg-secondary/40">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:py-20 lg:grid-cols-[1fr_1.4fr]">
            <Reveal direction="right">
              <p className="font-mono text-sm text-sky">// about</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-balance">
                Notes from the <span className="text-gradient-cool">workbench.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
                <p style={{ fontFamily: '"Montserrat", sans-serif' }}>
                  This site is essentially my engineering build log. It contains almost
                  all of my projects and will be continually updated as more come.
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
