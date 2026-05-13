'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { FOCUS_STYLES, isEnterKey, isSpaceKey } from '@/lib/accessibility-utils'

/**
 * Accessible button component with proper ARIA and keyboard support
 */
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  icon?: ReactNode
  disabled?: boolean
  ariaLabel?: string
  ariaDescription?: string
  ariaPressed?: boolean
  ariaExpanded?: boolean
  ariaHasPopup?: boolean
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void
}

export function AccessibleButton({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  disabled = false,
  ariaLabel,
  ariaDescription,
  ariaPressed,
  ariaExpanded,
  ariaHasPopup,
  className,
  onKeyDown,
  ...props
}: AccessibleButtonProps) {
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/50',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:bg-secondary/50',
    outline: 'border border-input bg-background hover:bg-accent disabled:border-muted',
    ghost: 'hover:bg-accent disabled:text-muted-foreground',
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:bg-destructive/50',
  }

  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    // Allow Enter and Space to activate button
    if ((isEnterKey(event) || isSpaceKey(event)) && !disabled && !isLoading) {
      event.preventDefault()
      event.currentTarget.click()
    }

    onKeyDown?.(event)
  }

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        FOCUS_STYLES.default,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      aria-label={ariaLabel}
      aria-description={ariaDescription}
      aria-pressed={ariaPressed}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHasPopup}
      aria-busy={isLoading}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {isLoading && (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      )}
    </button>
  )
}

/**
 * Accessible icon button
 */
interface AccessibleIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  ariaLabel: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  isActive?: boolean
}

export function AccessibleIconButton({
  icon,
  ariaLabel,
  size = 'md',
  variant = 'ghost',
  isActive = false,
  className,
  ...props
}: AccessibleIconButtonProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md transition-colors',
        FOCUS_STYLES.default,
        variant === 'ghost' && 'hover:bg-accent',
        variant === 'outline' && 'border border-input hover:bg-accent',
        isActive && 'bg-accent',
        sizeClasses[size],
        className
      )}
      aria-label={ariaLabel}
      aria-pressed={isActive}
      type="button"
      {...props}
    >
      {icon}
    </button>
  )
}
