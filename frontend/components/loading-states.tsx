'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Skeleton loader components for loading states
 */

interface SkeletonProps {
  className?: string
  count?: number
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
    />
  )
}

export function SkeletonText({ count = 3, className }: { count?: number } & SkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4 w-full',
            i === count - 1 && 'w-4/5'
          )}
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn('rounded-lg border border-border bg-card p-4 space-y-4', className)}>
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2 pt-4">
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-10 flex-1 rounded-md" />
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 5, columns = 4, className }: { rows?: number; columns?: number } & SkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {/* Header */}
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-8 w-full" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-6 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonAvatar({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-10 w-10 rounded-full', className)} />
}

export function SkeletonButton({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-10 w-32 rounded-md', className)} />
}

interface SkeletonGridProps extends SkeletonProps {
  count?: number
  columns?: number
}

export function SkeletonGrid({ count = 6, columns = 3, className }: SkeletonGridProps) {
  return (
    <div className={cn(`grid gap-4 grid-cols-${columns}`, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

/**
 * Loading spinner with accessible ARIA labels
 */
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  className?: string
}

export function LoadingSpinner({ size = 'md', message = 'Loading...', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-2', className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className={cn(
          'animate-spin rounded-full border-4 border-muted border-t-primary',
          sizeClasses[size]
        )}
      />
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
      <span className="sr-only">{message}</span>
    </div>
  )
}

/**
 * Loading overlay for full-screen loading states
 */
interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
  blur?: boolean
}

export function LoadingOverlay({ isLoading, message = 'Loading...', blur = true }: LoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        blur && 'backdrop-blur-sm',
        'bg-black/10 dark:bg-black/40'
      )}
      role="status"
      aria-label={message}
      aria-live="polite"
      aria-busy="true"
    >
      <LoadingSpinner size="lg" message={message} />
    </div>
  )
}

/**
 * Skeleton section with header
 */
interface SkeletonSectionProps extends SkeletonProps {
  showHeader?: boolean
}

export function SkeletonSection({ showHeader = true, className }: SkeletonSectionProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {showHeader && (
        <>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </>
      )}
      <SkeletonText count={4} />
    </div>
  )
}
