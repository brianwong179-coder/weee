'use client'

import type { ReactNode } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  type Variants,
} from 'motion/react'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

function offset(direction: Direction, distance: number) {
  switch (direction) {
    case 'up':
      return { y: distance }
    case 'down':
      return { y: -distance }
    case 'left':
      return { x: distance }
    case 'right':
      return { x: -distance }
    default:
      return {}
  }
}

/**
 * Reveal — fades/slides content in. By default it triggers when scrolled into
 * view; pass `immediate` for above-the-fold content that should play on mount.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.6,
  direction = 'up',
  distance = 24,
  immediate = false,
  once = true,
}: {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: Direction
  distance?: number
  immediate?: boolean
  once?: boolean
}) {
  const reduce = useReducedMotion()

  const hidden = reduce
    ? { opacity: 0 }
    : { opacity: 0, ...offset(direction, distance) }
  const shown = { opacity: 1, x: 0, y: 0 }

  return (
    <motion.div
      className={className}
      initial="hidden"
      variants={{ hidden, show: shown }}
      transition={{ duration, ease: EASE, delay }}
      {...(immediate
        ? { animate: 'show' }
        : { whileInView: 'show', viewport: { once, margin: '-80px' } })}
    >
      {children}
    </motion.div>
  )
}

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
}

/**
 * Stagger — a container that reveals its <StaggerItem> children in sequence.
 */
export function Stagger({
  children,
  className,
  immediate = false,
  once = true,
}: {
  children: ReactNode
  className?: string
  immediate?: boolean
  once?: boolean
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      variants={containerVariants}
      {...(immediate
        ? { animate: 'show' }
        : { whileInView: 'show', viewport: { once, margin: '-80px' } })}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
  direction = 'up',
  distance = 22,
}: {
  children: ReactNode
  className?: string
  direction?: Direction
  distance?: number
}) {
  const reduce = useReducedMotion()
  const hidden = reduce
    ? { opacity: 0 }
    : { opacity: 0, ...offset(direction, distance) }

  return (
    <motion.div
      className={className}
      variants={{
        hidden,
        show: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration: 0.6, ease: EASE },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

/** ScrollProgress — a thin accent bar showing page scroll progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-accent to-sky"
    />
  )
}

/** MotionLink-friendly wrapper that lifts on hover with a spring. */
export function Lift({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={cn(className)}
      whileHover={reduce ? undefined : { y: -6 }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      {children}
    </motion.div>
  )
}
