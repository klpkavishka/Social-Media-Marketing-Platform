'use client'

import { Check, AlertCircle, AlertTriangle, Zap } from 'lucide-react'

export type ConnectionStatus = 'active' | 'warning' | 'error' | 'connecting'

interface ConnectionStatusIndicatorProps {
  status: ConnectionStatus
  lastSync?: string
  detailed?: boolean
}

const statusConfig = {
  active: {
    icon: Check,
    label: 'Active',
    description: 'Connected and syncing',
    className: 'bg-green-100 text-green-700 border-green-300',
    dotClassName: 'bg-green-500',
    animation: '',
  },
  warning: {
    icon: AlertTriangle,
    label: 'Needs Attention',
    description: 'Sync issues detected',
    className: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    dotClassName: 'bg-yellow-500',
    animation: 'animate-pulse',
  },
  error: {
    icon: AlertCircle,
    label: 'Disconnected',
    description: 'Connection failed',
    className: 'bg-red-100 text-red-700 border-red-300',
    dotClassName: 'bg-red-500',
    animation: 'animate-pulse',
  },
  connecting: {
    icon: Zap,
    label: 'Connecting',
    description: 'Establishing connection',
    className: 'bg-blue-100 text-blue-700 border-blue-300',
    dotClassName: 'bg-blue-500',
    animation: 'animate-pulse',
  },
}

export function ConnectionStatusIndicator({
  status,
  lastSync,
  detailed = true,
}: ConnectionStatusIndicatorProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  if (!detailed) {
    return (
      <div className="flex items-center gap-2">
        <div className={`relative h-3 w-3 rounded-full ${config.dotClassName} ${config.animation}`}>
          <div className="absolute inset-0 rounded-full bg-white/20" />
        </div>
        <span className="text-xs font-medium">{config.label}</span>
      </div>
    )
  }

  return (
    <div className={`rounded-lg border p-3 ${config.className}`}>
      <div className="flex items-start gap-2">
        <div className="mt-0.5 flex-shrink-0">
          <div className={`relative h-4 w-4 rounded-full ${config.dotClassName} ${config.animation}`}>
            <div className="absolute inset-0 rounded-full bg-white/20" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <p className="font-semibold text-sm">{config.label}</p>
          </div>
          <p className="text-xs opacity-90">{config.description}</p>
          {lastSync && (
            <p className="text-xs opacity-75 mt-1">Last synced: {lastSync}</p>
          )}
        </div>
      </div>
    </div>
  )
}
