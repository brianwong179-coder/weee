import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Montserrat, Open_Sans, Source_Sans_3 } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
})

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans-3',
})

export const metadata: Metadata = {
  title: 'Flightline — Robotics, Drones & Rocketry',
  description:
    'A personal engineering log documenting custom drones, high-power rockets, and the flight control systems that fly them.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#101418',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${openSans.variable} ${sourceSans3.variable} bg-background`}>
      <body className="antialiased font-sans">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
