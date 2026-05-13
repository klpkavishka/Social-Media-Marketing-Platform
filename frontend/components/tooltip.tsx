'use client'

import { ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Tooltip component for complex features
 */
interface TooltipProps {
  children: ReactNode
  content: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  delayMs?: number
  className?: string
}

export function Tooltip({
  children,
  content,
  side = 'top',
  delayMs = 200,
  className,
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsOpen(true), delayMs)
    setTimeoutId(id)
  }

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId)
    setIsOpen(false)
  }

  const sideClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
  }

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 px-3 py-2 text-sm font-medium rounded-md shadow-lg',
            'bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-100',
            'border border-gray-700 dark:border-gray-600',
            'pointer-events-none whitespace-nowrap',
            sideClasses[side],
            className
          )}
          role="tooltip"
        >
          {content}
          <div
            className={cn(
              'absolute w-2 h-2 bg-gray-900 dark:bg-gray-800 border-l-2 border-r-2 border-b-2 border-gray-700 dark:border-gray-600',
              arrowClasses[side]
            )}
          />
        </div>
      )}
    </div>
  )
}

/**
 * Inline tooltip with question mark icon
 */
interface InlineTooltipProps {
  content: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
}

export function InlineTooltip({ content, side = 'top', className }: InlineTooltipProps) {
  return (
    <Tooltip content={content} side={side}>
      <button
        className={cn(
          'inline-flex h-5 w-5 items-center justify-center rounded-full',
          'border border-border bg-muted text-muted-foreground hover:bg-accent',
          'text-xs font-bold cursor-help focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          'dark:focus:ring-offset-background',
          className
        )}
        aria-label="More information"
        tabIndex={0}
      >
        ?
      </button>
    </Tooltip>
  )
}
