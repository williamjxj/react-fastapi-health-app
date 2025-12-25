import { cn } from '@/lib/utils'

/**
 * Skeleton component for displaying loading states.
 * Provides a visual placeholder that pulses while content is loading.
 *
 * @param className - Additional CSS classes to apply
 * @param props - Standard HTML div attributes
 * @returns A skeleton loading indicator
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
}

export { Skeleton }
