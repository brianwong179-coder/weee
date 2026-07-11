'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion, type Variants } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1] as const

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

function itemVariants(reduce: boolean | null): Variants {
  return {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  }
}

export function HomeHero() {
  const reduce = useReducedMotion()
  const item = itemVariants(reduce)

  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* colored backdrop, slowly drifting */}
      <div
        aria-hidden="true"
        className="animate-aurora pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_110%_at_12%_0%,color-mix(in_oklch,var(--teal)_22%,transparent),transparent_55%),radial-gradient(45%_90%_at_85%_10%,color-mix(in_oklch,var(--sky)_20%,transparent),transparent_55%),radial-gradient(50%_100%_at_100%_100%,color-mix(in_oklch,var(--accent)_20%,transparent),transparent_55%),radial-gradient(45%_90%_at_25%_100%,color-mix(in_oklch,var(--rose)_16%,transparent),transparent_55%)]"
      />
      {/* grid lines, gently panning */}
      <div
        aria-hidden="true"
        className="animate-grid-pan pointer-events-none absolute inset-0 -z-10 opacity-[0.4] [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(80%_80%_at_50%_20%,black,transparent)]"
      />
      <motion.div
        className="mx-auto max-w-6xl px-5 py-20 sm:py-28"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.p
          variants={item}
          className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-sm text-accent"
        >
          <span
            className="animate-pulse-ring size-1.5 rounded-full bg-accent"
            aria-hidden="true"
          />
          engineering log
        </motion.p>
        <motion.h1
          variants={item}
          className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl"
        >
          Building drones and rockets, and the{' '}
          <span className="text-gradient-warm">flight control systems</span> that fly them.
        </motion.h1>
        <motion.p
          variants={item}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty"
          style={{ fontFamily: '"Montserrat", sans-serif' }}
        >
          I&apos;m Brian, currently a Year 12 High School student in Sydney working on
          robotics and aerospace projects. You&apos;ll find all my current projects on this
          blog, everything from high power rockets to self flying drones, and even the
          autopilot systems within.
        </motion.p>
        <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
          <motion.div
            whileHover={reduce ? undefined : { scale: 1.03 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 20 }}
          >
            <Link
              href="/projects"
              className="shine group inline-flex items-center gap-2 rounded-md bg-gradient-warm px-5 py-2.5 text-sm font-medium text-accent-foreground shadow-sm shadow-accent/20"
            >
              Browse projects
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
          <motion.div
            whileHover={reduce ? undefined : { scale: 1.03 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 20 }}
          >
            <Link
              href="/#about"
              className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            >
              About the log
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
