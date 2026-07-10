import Link from 'next/link'
import { Reveal } from '@/components/motion'

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <Reveal className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-sm font-semibold tracking-tight">BRIAN WONG</p>
          <p className="mt-1 text-sm text-muted-foreground">
            A personal build log for drones, rockets, and the code that flies them.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link
            href="/projects"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Projects
          </Link>
          <a
            href="https://github.com"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href="mailto:hello@brianwong.dev"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </a>
        </div>
      </Reveal>
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Brian Wong. Built and flown in the garage.
          </p>
        </div>
      </div>
    </footer>
  )
}
