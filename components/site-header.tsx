'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Rocket } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { ScrollProgress } from '@/components/motion'

const nav = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/#about', label: 'About' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const reduce = useReducedMotion()

  return (
    <motion.header
      initial={reduce ? false : { y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md"
    >
      <ScrollProgress />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="group flex items-center gap-2.5">
          <motion.span
            whileHover={reduce ? undefined : { rotate: -12, scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 320, damping: 14 }}
            className="bg-gradient-warm flex size-8 items-center justify-center rounded-md text-white shadow-sm shadow-accent/20"
          >
            <Rocket className="size-4" aria-hidden="true" />
          </motion.span>
          <span className="font-mono text-sm font-semibold tracking-tight">
            BRIAN WONG
          </span>
        </Link>
        <nav className="flex items-center gap-1" aria-label="Primary">
          {nav.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href.replace('/#about', '/'))
                  ? item.href !== '/'
                  : false
            return (
              <Link
                key={item.label}
                href={item.href}
                data-active={active}
                className="nav-underline rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[active=true]:text-foreground"
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </motion.header>
  )
}
