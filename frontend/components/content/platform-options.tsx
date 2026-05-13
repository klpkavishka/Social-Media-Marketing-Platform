'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'

interface PlatformOption {
  id: string
  name: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  limit: number
  recommendation: string
  enabled: boolean
}

interface PlatformOptionsProps {
  onPlatformChange?: (platforms: string[]) => void
}

export function PlatformOptions({ onPlatformChange }: PlatformOptionsProps) {
  const [platforms, setPlatforms] = useState<PlatformOption[]>([
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      limit: 2200,
      recommendation: 'Visual content, carousel posts',
      enabled: true,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      limit: 63206,
      recommendation: 'Long-form content, engagement',
      enabled: true,
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      icon: Twitter,
      limit: 280,
      recommendation: 'Quick updates, news',
      enabled: false,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      limit: 3000,
      recommendation: 'Professional content, insights',
      enabled: false,
    },
  ])

  const handleToggle = (platformId: string) => {
    const updated = platforms.map((p) =>
      p.id === platformId ? { ...p, enabled: !p.enabled } : p
    )
    setPlatforms(updated)
    onPlatformChange?.(updated.filter(p => p.enabled).map(p => p.id))
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Publish To</h3>
      <div className="space-y-3 bg-accent/30 rounded-lg p-3">
        {platforms.map((platform) => (
          <label
            key={platform.id}
            className="flex items-start gap-3 cursor-pointer p-2 rounded hover:bg-accent/50 transition-colors"
          >
            <Checkbox
              checked={platform.enabled}
              onCheckedChange={() => handleToggle(platform.id)}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <platform.icon className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="font-medium text-sm">{platform.name}</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {platform.limit} chars
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{platform.recommendation}</p>
            </div>
          </label>
        ))}
      </div>

      {platforms.filter(p => p.enabled).length === 0 && (
        <p className="text-xs text-amber-600 dark:text-amber-400 flex gap-2">
          <span>⚠️</span>
          <span>Select at least one platform to publish</span>
        </p>
      )}
    </div>
  )
}
