'use client'

import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Plus, Search, Inbox, Frown } from 'lucide-react'

/**
 * Empty state component with helpful guidance
 */
interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    icon?: ReactNode
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = 'md',
}: EmptyStateProps) {
  const sizeClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-20',
  }

  const iconSizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label={title}
    >
      {icon ? (
        <div className={cn('text-muted-foreground mb-4', iconSizeClasses[size])}>
          {icon}
        </div>
      ) : (
        <Inbox className={cn('text-muted-foreground mb-4', iconSizeClasses[size])} />
      )}

      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>

      {description && (
        <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      )}

      {(action || secondaryAction) && (
        <div className="flex gap-3 flex-col sm:flex-row">
          {action && (
            <Button onClick={action.onClick} className="gap-2">
              {action.icon || <Plus className="h-4 w-4" />}
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Search empty state
 */
interface SearchEmptyStateProps {
  query: string
  onClear?: () => void
  suggestions?: string[]
}

export function SearchEmptyState({ query, onClear, suggestions }: SearchEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Search className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No results found
      </h3>
      <p className="text-muted-foreground max-w-sm mb-6">
        No results for &quot;<strong>{query}</strong>&quot;
      </p>

      {suggestions && suggestions.length > 0 && (
        <div className="mb-6 text-left">
          <p className="text-sm font-medium text-foreground mb-3">Try searching for:</p>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index}>
                <button
                  className="text-sm text-primary hover:underline"
                  onClick={() => {
                    // Trigger search with suggestion
                    // This would be implemented by the parent component
                  }}
                >
                  • {suggestion}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {onClear && (
        <Button variant="outline" onClick={onClear}>
          Clear search
        </Button>
      )}
    </div>
  )
}

/**
 * Error empty state
 */
interface ErrorEmptyStateProps {
  title: string
  description?: string
  onRetry?: () => void
  onBack?: () => void
}

export function ErrorEmptyState({ title, description, onRetry, onBack }: ErrorEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Frown className="h-16 w-16 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      )}

      <div className="flex gap-3">
        {onRetry && (
          <Button onClick={onRetry}>Try again</Button>
        )}
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Go back
          </Button>
        )}
      </div>
    </div>
  )
}

/**
 * No permission empty state
 */
interface NoPermissionStateProps {
  title?: string
  description?: string
  onContact?: () => void
}

export function NoPermissionState({
  title = 'Access Denied',
  description = 'You do not have permission to view this content.',
  onContact,
}: NoPermissionStateProps) {
  return (
    <EmptyState
      icon={<Frown className="h-full w-full" />}
      title={title}
      description={description}
      action={
        onContact
          ? { label: 'Contact Support', onClick: onContact }
          : undefined
      }
    />
  )
}
