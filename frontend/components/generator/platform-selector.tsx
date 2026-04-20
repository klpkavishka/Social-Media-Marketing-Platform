'use client'

import { Button } from '@/components/ui/button'
import { Instagram, Facebook, Twitter, Linkedin } from 'lucide-react'
import type { SocialPlatform } from '@/lib/api/campaigns'

interface PlatformSelectorProps {
  selectedPlatform: SocialPlatform
  onPlatformChange: (platform: SocialPlatform) => void
}

const PLATFORMS: { id: SocialPlatform; name: string; icon: React.ReactNode; color: string }[] = [
  { id: 'instagram', name: 'Instagram', icon: <Instagram className="h-5 w-5" />, color: 'bg-gradient-to-br from-purple-400 to-pink-600' },
  { id: 'facebook', name: 'Facebook', icon: <Facebook className="h-5 w-5" />, color: 'bg-blue-600' },
  { id: 'twitter', name: 'Twitter', icon: <Twitter className="h-5 w-5" />, color: 'bg-sky-500' },
  { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="h-5 w-5" />, color: 'bg-blue-700' },
]

export function PlatformSelector({ selectedPlatform, onPlatformChange }: PlatformSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Choose Platform</h3>
      <div className="grid grid-cols-2 gap-2">
        {PLATFORMS.map((platform) => (
          <Button
            key={platform.id}
            variant={selectedPlatform === platform.id ? 'default' : 'outline'}
            className="justify-start gap-2"
            onClick={() => onPlatformChange(platform.id)}
          >
            {platform.icon}
            <span className="text-sm">{platform.name}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
