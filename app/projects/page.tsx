import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ProjectsExplorer } from '@/components/projects-explorer'
import { Reveal } from '@/components/motion'
import { SunriseBackdrop } from '@/components/sunrise-backdrop'

export const metadata: Metadata = {
  title: 'Projects — Brian Wong',
  description: 'Drones, rockets, and flight control systems, documented build by build.',
}

export default function ProjectsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-black/10 text-neutral-900">
          <SunriseBackdrop intensity="soft" />
          <div className="relative z-10 mx-auto max-w-6xl px-5 py-20 sm:py-24">
            <Reveal immediate>
              <p className="font-mono text-sm text-neutral-700">// all projects</p>
              <h1 className="mt-3 text-4xl font-bold tracking-[-0.02em] sm:text-6xl">
                The full flight log
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-neutral-700 text-pretty">
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
