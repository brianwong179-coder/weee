import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ProjectCard } from '@/components/project-card'
import { projects } from '@/lib/projects'

const stats = [
  { value: '5', label: 'Active projects' },
  { value: '10.2k', label: 'Feet apogee' },
  { value: '8 kHz', label: 'Control loop' },
  { value: '42 min', label: 'Longest flight' },
]

export default function HomePage() {
  const featured = projects.slice(0, 3)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
            <p className="font-mono text-sm text-accent">// engineering log</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl">
              Building drones and rockets, and the flight control systems that fly them.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
              I&apos;m Brian, currently a Year 12 High School student in Sydney working on
              robotics and aerospace projects. You&apos;ll find all my current projects on this
              blog, everything from high power rockets to self flying drones, and even
              the autopilot systems within.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Browse projects
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/#about"
                className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
              >
                About the log
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-border bg-secondary/40">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="px-5 py-8">
                <p className="font-mono text-3xl font-semibold tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured projects */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Featured builds</h2>
              <p className="mt-2 text-muted-foreground">
                A selection of what&apos;s currently on the bench and in the air.
              </p>
            </div>
            <Link
              href="/projects"
              className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              View all
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="border-t border-border bg-secondary/40">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:py-20 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="font-mono text-sm text-accent">// about</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-balance">
                Notes from the workbench.
              </h2>
            </div>
            <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
              <p>
                This site is my open engineering notebook. Every project here is
                something I&apos;ve designed, soldered, tuned, and flown myself — usually
                breaking a few propellers and fins along the way.
              </p>
              <p>
                I care most about flight control: the sensor fusion, the tuning, and
                the firmware that turns a pile of carbon and lithium into something
                that flies predictably. Each writeup includes the specs, the design
                decisions, and the mistakes worth remembering.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
