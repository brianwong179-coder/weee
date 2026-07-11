'use client'

import { useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from 'motion/react'

const EASE = [0.22, 1, 0.36, 1] as const

const stats = [
  { value: '5', label: 'Active projects' },
  { value: '10.2k', label: 'Feet apogee' },
  { value: '8 kHz', label: 'Control loop' },
  { value: '42 min', label: 'Longest flight' },
]

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

function CountUp({ value }: { value: string }) {
  const match = value.match(/^([\d.]+)(.*)$/)
  const target = match ? parseFloat(match[1]) : 0
  const suffix = match ? match[2] : value
  const decimals = match && match[1].includes('.') ? 1 : 0

  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(reduce ? value : `0${decimals ? '.0' : ''}${suffix}`)

  useEffect(() => {
    if (!inView || reduce || !match) return
    const controls = animate(0, target, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (v) => setDisplay(`${v.toFixed(decimals)}${suffix}`),
    })
    return () => controls.stop()
  }, [inView, reduce, target, suffix, decimals, match])

  return <span ref={ref}>{display}</span>
}

export function HomeStats() {
  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  }

  return (
    <section className="border-b border-border bg-secondary/40">
      <motion.div
        className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-border border-border sm:grid-cols-4 sm:divide-y-0"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={item} className="group px-5 py-8">
            <p className="text-gradient-cool font-mono text-3xl font-semibold tracking-tight">
              <CountUp value={stat.value} />
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
