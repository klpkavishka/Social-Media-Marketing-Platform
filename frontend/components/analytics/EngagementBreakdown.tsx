'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Heart, MessageCircle, Share2, MousePointer } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EngagementType {
  label: string
  value: number
  percentage: number
  icon?: React.ElementType
  color?: string
}

interface EngagementBreakdownProps {
  data?: EngagementType[]
  className?: string
}

const defaultIcons = {
  Likes: Heart,
  Comments: MessageCircle,
  Shares: Share2,
  Clicks: MousePointer,
}

const defaultColors = {
  Likes: 'text-red-600',
  Comments: 'text-blue-600',
  Shares: 'text-green-600',
  Clicks: 'text-purple-600',
}

export function EngagementBreakdown({ data = [], className }: EngagementBreakdownProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const totalEngagement = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Engagement Breakdown</CardTitle>
        <CardDescription>
          Distribution of engagement types
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => {
            const Icon = item.icon || defaultIcons[item.label as keyof typeof defaultIcons]
            const color = item.color || defaultColors[item.label as keyof typeof defaultColors]
            
            return (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {Icon && (
                      <div className={cn('rounded-full p-2', color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatNumber(item.value)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{item.percentage}%</p>
                    <p className="text-xs text-muted-foreground">of total</p>
                  </div>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            )
          })}
        </div>

        {data.length === 0 && (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No engagement data available
          </div>
        )}

        {data.length > 0 && (
          <div className="mt-6 rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Total Engagement</p>
              <p className="text-2xl font-bold">{formatNumber(totalEngagement)}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
