import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ProjectsExplorer } from '@/components/projects-explorer'
import { Reveal } from '@/components/motion'

export const metadata: Metadata = {
  title: 'Projects — Brian Wong',
  description: 'Drones, rockets, and flight control systems, documented build by build.',
}

export default function ProjectsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden="true"
            className="animate-aurora pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_120%_at_10%_0%,color-mix(in_oklch,var(--sky)_16%,transparent),transparent_55%),radial-gradient(50%_120%_at_95%_10%,color-mix(in_oklch,var(--accent)_14%,transparent),transparent_55%)]"
          />
          <div className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
            <Reveal immediate>
              <p className="font-mono text-sm text-accent">// all projects</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                The full <span className="text-gradient-warm">flight log</span>
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
                Every build, from freestyle quads to high-power rockets and the
                autopilots behind them. Filter by category to narrow things down.
              </p>
            </Reveal>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-5 py-12">
          <ProjectsExplorer />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
