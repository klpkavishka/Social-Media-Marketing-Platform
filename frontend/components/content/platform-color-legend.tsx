'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'

interface LegendItem {
  id: string
  label: string
  color: string
  icon: React.ReactNode
}

interface PlatformColorLegendProps {
  includeStatus?: boolean
  compact?: boolean
}

const platforms: LegendItem[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    color: 'bg-gradient-to-r from-pink-500 to-rose-500',
    icon: <Instagram size={16} />
  },
  {
    id: 'facebook',
    label: 'Facebook',
    color: 'bg-blue-600',
    icon: <Facebook size={16} />
  },
  {
    id: 'twitter',
    label: 'Twitter',
    color: 'bg-cyan-500',
    icon: <Twitter size={16} />
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    color: 'bg-blue-700',
    icon: <Linkedin size={16} />
  }
]

const statuses: LegendItem[] = [
  {
    id: 'scheduled',
    label: 'Scheduled',
    color: 'bg-green-500',
    icon: <div className="w-4 h-4 rounded bg-green-500" />
  },
  {
    id: 'published',
    label: 'Published',
    color: 'bg-blue-500',
    icon: <div className="w-4 h-4 rounded bg-blue-500" />
  },
  {
    id: 'draft',
    label: 'Draft',
    color: 'bg-gray-400',
    icon: <div className="w-4 h-4 rounded bg-gray-400" />
  },
  {
    id: 'in-review',
    label: 'In Review',
    color: 'bg-yellow-500',
    icon: <div className="w-4 h-4 rounded bg-yellow-500" />
  }
]

export function PlatformColorLegend({ includeStatus = true, compact = false }: PlatformColorLegendProps) {
  const [visiblePlatforms, setVisiblePlatforms] = useState<Set<string>>(
    new Set(platforms.map((p) => p.id))
  )
  const [visibleStatuses, setVisibleStatuses] = useState<Set<string>>(
    new Set(statuses.map((s) => s.id))
  )

  const togglePlatform = (id: string) => {
    const newVisible = new Set(visiblePlatforms)
    if (newVisible.has(id)) {
      newVisible.delete(id)
    } else {
      newVisible.add(id)
    }
    setVisiblePlatforms(newVisible)
  }

  const toggleStatus = (id: string) => {
    const newVisible = new Set(visibleStatuses)
    if (newVisible.has(id)) {
      newVisible.delete(id)
    } else {
      newVisible.add(id)
    }
    setVisibleStatuses(newVisible)
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-4">
        {platforms.map((item) => (
          <div key={item.id} className="flex items-center gap-2 text-xs">
            <div className={`w-3 h-3 rounded ${item.color}`} />
            <span className="text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="p-4 space-y-4 bg-gradient-to-br from-background to-muted/20">
      {/* Platforms Section */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <span className="text-violet-600">●</span>
          Platforms
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => togglePlatform(platform.id)}
              className={`flex items-center gap-2 p-2 rounded-lg transition-all text-sm ${
                visiblePlatforms.has(platform.id)
                  ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                  : 'bg-slate-100 dark:bg-slate-700 opacity-50'
              }`}
            >
              <div className={`w-4 h-4 rounded ${platform.color} text-white flex items-center justify-center`}>
                <div className="text-white">{platform.icon}</div>
              </div>
              <span className="text-xs">{platform.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Status Section */}
      {includeStatus && (
        <div className="pt-2 border-t">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <span className="text-cyan-600">●</span>
            Status
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {statuses.map((status) => (
              <button
                key={status.id}
                onClick={() => toggleStatus(status.id)}
                className={`flex items-center gap-2 p-2 rounded-lg transition-all text-sm ${
                  visibleStatuses.has(status.id)
                    ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                    : 'bg-slate-100 dark:bg-slate-700 opacity-50'
                }`}
              >
                <div className={`w-4 h-4 rounded ${status.color}`} />
                <span className="text-xs">{status.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Info Text */}
      <div className="text-xs text-muted-foreground pt-2 border-t italic">
        Click to toggle visibility
      </div>
    </Card>
  )
}
