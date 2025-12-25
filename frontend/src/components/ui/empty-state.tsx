import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Props for the EmptyState component.
 */
interface EmptyStateProps {
  /** Title text to display */
  title: string
  /** Description text to display */
  description: string
  /** Optional action button label */
  actionLabel?: string
  /** Optional callback when action button is clicked */
  onAction?: () => void
  /** Additional CSS classes to apply */
  className?: string
}

/**
 * EmptyState component for displaying helpful messages when no data is available.
 * Provides a visual indicator with optional action guidance.
 *
 * @param title - Title text to display
 * @param description - Description text to display
 * @param actionLabel - Optional action button label
 * @param onAction - Optional callback when action button is clicked
 * @param className - Additional CSS classes to apply
 * @returns An empty state component with optional action button
 */
export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="default">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
