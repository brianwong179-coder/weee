'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
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
  // Parse once so the pieces are stable primitives (a fresh `value.match()`
  // array on every render would retrigger the effect and stop the animation
  // partway, leaving the wrong final number).
  const { target, prefix, suffix, decimals, parsed } = useMemo(() => {
    const m = value.match(/^(\D*)([\d.]+)(.*)$/)
    return {
      parsed: Boolean(m),
      prefix: m ? m[1] : '',
      target: m ? parseFloat(m[2]) : 0,
      suffix: m ? m[3] : '',
      decimals: m && m[2].includes('.') ? 1 : 0,
    }
  }, [value])

  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(
    !parsed || reduce ? value : `${prefix}0${decimals ? '.0' : ''}${suffix}`,
  )

  useEffect(() => {
    if (!inView || reduce || !parsed) return
    const controls = animate(0, target, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (v) => setDisplay(`${prefix}${v.toFixed(decimals)}${suffix}`),
      // guarantee the animation lands on the exact target value
      onComplete: () => setDisplay(value),
    })
    return () => controls.stop()
  }, [inView, reduce, parsed, target, prefix, suffix, decimals, value])

  return <span ref={ref}>{display}</span>
}

export function HomeStats() {
  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  }

  return (
    <section className="sunrise-tint border-b border-border bg-secondary/40">
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
