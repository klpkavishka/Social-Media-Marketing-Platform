'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { PlatformStats } from '@/lib/types/analytics'
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlatformBreakdownProps {
  platforms?: PlatformStats[]
  className?: string
}

const platformIcons = {
  Instagram: Instagram,
  Facebook: Facebook,
  Twitter: Twitter,
  LinkedIn: Linkedin,
}

const platformColors = {
  Instagram: 'text-pink-600 bg-pink-50',
  Facebook: 'text-blue-600 bg-blue-50',
  Twitter: 'text-sky-600 bg-sky-50',
  LinkedIn: 'text-blue-700 bg-blue-50',
}

export function PlatformBreakdown({ platforms = [], className }: PlatformBreakdownProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const maxEngagement = Math.max(...platforms.map(p => p.engagement))

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Platform Performance</CardTitle>
        <CardDescription>
          Your content performance across social platforms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {platforms.map((platform) => {
            const Icon = platformIcons[platform.platform as keyof typeof platformIcons] || Instagram
            const colorClass = platformColors[platform.platform as keyof typeof platformColors] || 'text-gray-600 bg-gray-50'
            const engagementPercentage = (platform.engagement / maxEngagement) * 100

            return (
              <div key={platform.platform} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', colorClass)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{platform.platform}</p>
                      <p className="text-sm text-muted-foreground">
                        {platform.posts} posts
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {platform.engagementRate}% rate
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 pl-13">
                  <div>
                    <p className="text-xs text-muted-foreground">Engagement</p>
                    <p className="text-sm font-semibold">
                      {formatNumber(platform.engagement)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Reach</p>
                    <p className="text-sm font-semibold">
                      {formatNumber(platform.reach)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Followers</p>
                    <p className="text-sm font-semibold">
                      {formatNumber(platform.followers)}
                    </p>
                  </div>
                </div>
                
                <Progress value={engagementPercentage} className="h-2" />
              </div>
            )
          })}
        </div>

        {platforms.length === 0 && (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No platform data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}
