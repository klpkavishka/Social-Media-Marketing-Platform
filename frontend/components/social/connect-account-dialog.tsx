'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Plus,
  Check,
  ArrowRight,
} from 'lucide-react'
import { SocialPlatform } from '@/lib/types/social'

interface ConnectAccountDialogProps {
  children?: React.ReactNode
  onConnect?: (platform: SocialPlatform) => void
  connectedPlatforms?: SocialPlatform[]
}

const platforms = [
  {
    name: 'Facebook',
    value: 'facebook' as SocialPlatform,
    icon: Facebook,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Connect your Facebook Page to schedule posts and view analytics',
  },
  {
    name: 'Instagram',
    value: 'instagram' as SocialPlatform,
    icon: Instagram,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    description: 'Share photos and stories with Instagram Business account',
  },
  {
    name: 'Twitter',
    value: 'twitter' as SocialPlatform,
    icon: Twitter,
    color: 'text-sky-500',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    description: 'Post tweets and engage with your Twitter audience',
  },
  {
    name: 'LinkedIn',
    value: 'linkedin' as SocialPlatform,
    icon: Linkedin,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Share professional content with LinkedIn Company Page',
  },
  {
    name: 'YouTube',
    value: 'youtube' as SocialPlatform,
    icon: Youtube,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    description: 'Upload videos and manage your YouTube channel',
  },
  {
    name: 'TikTok',
    value: 'tiktok' as SocialPlatform,
    icon: Plus,
    color: 'text-gray-900',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    description: 'Create short-form video content for TikTok',
  },
]

export function ConnectAccountDialog({
  children,
  onConnect,
  connectedPlatforms = [],
}: ConnectAccountDialogProps) {
  const [open, setOpen] = useState(false)

  const handleConnect = (platform: SocialPlatform) => {
    onConnect?.(platform)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Connect Account
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Connect Social Media Account</DialogTitle>
          <DialogDescription>
            Choose a platform to connect and start managing your social media presence.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {platforms.map((platform) => {
            const Icon = platform.icon
            const isConnected = connectedPlatforms.includes(platform.value)

            return (
              <button
                key={platform.value}
                onClick={() => !isConnected && handleConnect(platform.value)}
                disabled={isConnected}
                className={`flex items-start gap-4 rounded-lg border-2 p-4 text-left transition-all hover:border-primary ${
                  isConnected ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                } ${platform.borderColor}`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 ${platform.bgColor} ${platform.borderColor}`}>
                  <Icon className={`h-6 w-6 ${platform.color}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{platform.name}</h4>
                    {isConnected && (
                      <Badge variant="default" className="gap-1 bg-green-500">
                        <Check className="h-3 w-3" />
                        Connected
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{platform.description}</p>
                </div>
                {!isConnected && (
                  <ArrowRight className="mt-2 h-5 w-5 text-muted-foreground" />
                )}
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
