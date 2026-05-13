'use client'

import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Error message component with suggested solutions
 */
interface ErrorMessageProps {
  title: string
  message: string
  solutions?: string[]
  onDismiss?: () => void
  onRetry?: () => void
  code?: string
  className?: string
}

export function ErrorMessage({
  title,
  message,
  solutions,
  onDismiss,
  onRetry,
  code,
  className,
}: ErrorMessageProps) {
  return (
    <div
      className={cn(
        'rounded-lg border-l-4 border-red-500 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950 space-y-3',
        className
      )}
      role="alert"
      aria-labelledby="error-title"
      aria-describedby="error-message"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3
              id="error-title"
              className="font-semibold text-red-900 dark:text-red-100"
            >
              {title}
            </h3>
            <p
              id="error-message"
              className="text-sm text-red-800 dark:text-red-200 mt-1"
            >
              {message}
            </p>
          </div>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="h-6 w-6 flex-shrink-0"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Error code */}
      {code && (
        <div className="bg-red-100 dark:bg-red-900/30 rounded px-3 py-2 font-mono text-xs text-red-900 dark:text-red-100">
          Error Code: {code}
        </div>
      )}

      {/* Solutions */}
      {solutions && solutions.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-red-900 dark:text-red-100 mb-2">
            Suggested solutions:
          </p>
          <ul className="space-y-1 text-xs text-red-800 dark:text-red-200">
            {solutions.map((solution, index) => (
              <li key={index} className="flex gap-2 ml-6">
                <span className="text-red-500 dark:text-red-400">•</span>
                {solution}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      {(onRetry || onDismiss) && (
        <div className="flex gap-2 pt-2">
          {onRetry && (
            <Button
              size="sm"
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
            >
              Try Again
            </Button>
          )}
          {onDismiss && !onRetry && (
            <Button
              size="sm"
              variant="outline"
              onClick={onDismiss}
              className="border-red-200 dark:border-red-800"
            >
              Dismiss
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Success message
 */
interface SuccessMessageProps {
  title: string
  message: string
  onDismiss?: () => void
  className?: string
}

export function SuccessMessage({ title, message, onDismiss, className }: SuccessMessageProps) {
  return (
    <div
      className={cn(
        'rounded-lg border-l-4 border-green-500 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950 space-y-3',
        className
      )}
      role="alert"
      aria-labelledby="success-title"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 id="success-title" className="font-semibold text-green-900 dark:text-green-100">
              {title}
            </h3>
            <p className="text-sm text-green-800 dark:text-green-200 mt-1">{message}</p>
          </div>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="h-6 w-6 flex-shrink-0"
            aria-label="Dismiss message"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

/**
 * Warning message
 */
interface WarningMessageProps {
  title: string
  message: string
  onDismiss?: () => void
  className?: string
}

export function WarningMessage({ title, message, onDismiss, className }: WarningMessageProps) {
  return (
    <div
      className={cn(
        'rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950 space-y-3',
        className
      )}
      role="alert"
      aria-labelledby="warning-title"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 id="warning-title" className="font-semibold text-amber-900 dark:text-amber-100">
              {title}
            </h3>
            <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">{message}</p>
          </div>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="h-6 w-6 flex-shrink-0"
            aria-label="Dismiss warning"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

/**
 * Info message
 */
interface InfoMessageProps {
  title: string
  message: string
  onDismiss?: () => void
  className?: string
}

export function InfoMessage({ title, message, onDismiss, className }: InfoMessageProps) {
  return (
    <div
      className={cn(
        'rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950 space-y-3',
        className
      )}
      role="status"
      aria-labelledby="info-title"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 id="info-title" className="font-semibold text-blue-900 dark:text-blue-100">
              {title}
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">{message}</p>
          </div>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="h-6 w-6 flex-shrink-0"
            aria-label="Dismiss message"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
