'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { SunriseBackdrop } from '@/components/sunrise-backdrop'

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
    <section className="relative overflow-hidden border-b border-black/10 font-[family-name:var(--font-montserrat)] text-neutral-900">
      <SunriseBackdrop />

      <motion.div
        className="relative z-10 mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-5 py-24 sm:py-32"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.p
          variants={item}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-black/15 bg-white/30 px-3 py-1 font-mono text-sm text-neutral-800 backdrop-blur-sm"
        >
          <span
            className="size-1.5 rounded-full bg-neutral-900"
            aria-hidden="true"
          />
          engineering log
        </motion.p>

        <motion.h1
          variants={item}
          className="mt-6 max-w-5xl text-5xl font-bold leading-[0.98] tracking-[-0.03em] text-balance sm:text-7xl lg:text-[5.5rem]"
        >
          Building drones and rockets, and the{' '}
          <span className="text-gradient-warm">flight control systems</span> that fly
          them.
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-neutral-700 text-pretty sm:text-xl"
        >
          I&apos;m Brian, a Year 12 student in Sydney building robotics and aerospace
          projects. This is my open build log — high-power rockets, self-flying drones,
          and the autopilot systems behind them.
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-3">
          <motion.div
            whileHover={reduce ? undefined : { scale: 1.03 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 20 }}
          >
            <Link
              href="/projects"
              className="shine group inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/10"
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
              className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white/40 px-6 py-3 text-sm font-medium text-neutral-900 backdrop-blur-sm transition-colors hover:bg-white/70"
            >
              About the log
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
