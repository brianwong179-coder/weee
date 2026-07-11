import { cn } from '@/lib/utils'

/**
 * Dreamy, grainy "sunrise" gradient wash — large soft blurred color blobs
 * blending warm (amber / coral / rose) into cool (blue / violet / pink),
 * finished with a film-grain overlay. Inspired by atmospheric festival sites.
 *
 * Renders as an absolutely-positioned, aria-hidden layer. Place inside a
 * `relative overflow-hidden` parent.
 */
export function SunriseBackdrop({
  className,
  intensity = 'full',
}: {
  className?: string
  /** `full` for hero-scale washes, `soft` for calmer section headers */
  intensity?: 'full' | 'soft'
}) {
  const soft = intensity === 'soft'
  const blur = soft ? 'blur-[70px]' : 'blur-[90px]'
  const alpha = soft ? 0.6 : 0.9

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 z-0 overflow-hidden',
        className,
      )}
    >
      {/* base vertical wash: warm top → cool bottom (opaque so it reads
          as a consistent light dreamy surface in both themes) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(175deg, oklch(0.9 0.11 80), oklch(0.86 0.1 350) 48%, oklch(0.8 0.13 285))',
        }}
      />

      {/* warm amber blob, top-left */}
      <div
        className={cn('absolute rounded-full animate-blob-a', blur)}
        style={{
          top: '-12%',
          left: '-8%',
          width: '55%',
          height: '70%',
          background: `radial-gradient(circle at 50% 50%, oklch(0.85 0.16 78 / ${alpha}), transparent 70%)`,
        }}
      />
      {/* coral / rose blob, right */}
      <div
        className={cn('absolute rounded-full animate-blob-b', blur)}
        style={{
          top: '-6%',
          right: '-12%',
          width: '55%',
          height: '75%',
          background: `radial-gradient(circle at 50% 50%, oklch(0.74 0.19 32 / ${alpha}), transparent 70%)`,
        }}
      />
      {/* cool blue blob, bottom-left */}
      <div
        className={cn('absolute rounded-full animate-blob-c', blur)}
        style={{
          bottom: '-20%',
          left: '5%',
          width: '55%',
          height: '75%',
          background: `radial-gradient(circle at 50% 50%, oklch(0.7 0.15 250 / ${alpha}), transparent 70%)`,
        }}
      />
      {/* violet / pink blob, bottom-right */}
      <div
        className={cn('absolute rounded-full animate-blob-a', blur)}
        style={{
          bottom: '-18%',
          right: '0%',
          width: '50%',
          height: '70%',
          animationDelay: '-8s',
          background: `radial-gradient(circle at 50% 50%, oklch(0.72 0.16 320 / ${alpha}), transparent 70%)`,
        }}
      />
      {/* soft pink center glow */}
      <div
        className={cn('absolute rounded-full animate-blob-b', blur)}
        style={{
          top: '30%',
          left: '35%',
          width: '40%',
          height: '45%',
          animationDelay: '-14s',
          background: `radial-gradient(circle at 50% 50%, oklch(0.85 0.1 350 / ${alpha * 0.8}), transparent 70%)`,
        }}
      />

      {/* film grain */}
      <div className="grain-overlay absolute inset-0" />
    </div>
  )
}
