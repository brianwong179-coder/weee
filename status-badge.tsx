import { cn } from '@/lib/utils'
import type { Project } from '@/lib/projects'

const styles: Record<Project['status'], string> = {
  Flying: 'bg-accent/10 text-accent border-accent/30',
  'In Development': 'bg-secondary text-foreground border-border',
  'Bench Testing': 'bg-secondary text-foreground border-border',
  Retired: 'bg-muted text-muted-foreground border-border',
}

export function StatusBadge({
  status,
  className,
}: {
  status: Project['status']
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-xs font-medium',
        styles[status],
        className,
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          status === 'Flying' ? 'bg-accent' : 'bg-muted-foreground',
        )}
        aria-hidden="true"
      />
      {status}
    </span>
  )
}
