'use client'

import { AlertCircle } from 'lucide-react'
import { formatNumber } from '@/lib/utils/format'

interface AccountLimitsDisplayProps {
  postsRemaining: number
  postsLimit: number
  resetDate?: string
  highlightWarning?: boolean
}

export function AccountLimitsDisplay({
  postsRemaining,
  postsLimit,
  resetDate,
  highlightWarning = true,
}: AccountLimitsDisplayProps) {
  const percentageUsed = ((postsLimit - postsRemaining) / postsLimit) * 100
  const percentageRemaining = (postsRemaining / postsLimit) * 100
  
  // Determine status based on remaining posts
  const isWarning = postsRemaining < postsLimit * 0.2 // Less than 20%
  const isCritical = postsRemaining < postsLimit * 0.1 // Less than 10%

  const getProgressColor = () => {
    if (isCritical) return 'bg-red-500'
    if (isWarning) return 'bg-yellow-500'
    return 'bg-violet-500'
  }

  const getTextColor = () => {
    if (isCritical) return 'text-red-700'
    if (isWarning) return 'text-yellow-700'
    return 'text-muted-foreground'
  }

  const getBackgroundColor = () => {
    if (isCritical) return 'bg-red-50'
    if (isWarning) return 'bg-yellow-50'
    return 'bg-muted/50'
  }

  return (
    <div className={`rounded-lg border p-4 ${getBackgroundColor()}`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm">Post Limit</h4>
            {highlightWarning && (isWarning || isCritical) && (
              <div className="flex items-center gap-1 rounded-full px-2 py-1 bg-white/50">
                <AlertCircle className={`h-3 w-3 ${getTextColor()}`} />
                <span className={`text-xs font-medium ${getTextColor()}`}>
                  {isCritical ? 'Critical' : 'Warning'}
                </span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getTextColor()}`}>
              {formatNumber(postsRemaining)}
            </div>
            <p className="text-xs text-muted-foreground">
              of {formatNumber(postsLimit)} posts
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full ${getProgressColor()} transition-all duration-300`}
              style={{ width: `${percentageUsed}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{percentageUsed.toFixed(0)}% used</span>
            <span>{percentageRemaining.toFixed(0)}% remaining</span>
          </div>
        </div>

        {/* Reset Information */}
        {resetDate && (
          <div className="rounded-md bg-white/50 px-2 py-1">
            <p className="text-xs text-muted-foreground">
              Resets on <span className="font-medium">{resetDate}</span>
            </p>
          </div>
        )}

        {/* Status Message */}
        {isCritical && (
          <div className="rounded-md bg-red-100 px-2 py-1">
            <p className="text-xs font-medium text-red-800">
              You are approaching your monthly post limit. Consider scheduling posts in advance.
            </p>
          </div>
        )}
        {isWarning && !isCritical && (
          <div className="rounded-md bg-yellow-100 px-2 py-1">
            <p className="text-xs font-medium text-yellow-800">
              You have limited posts remaining this month.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
