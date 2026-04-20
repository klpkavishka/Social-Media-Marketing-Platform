'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Users, Heart, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Metric {
  title: string
  value: string | number
  change: number
  trend: 'up' | 'down'
  icon: React.ElementType
  description?: string
}

interface MetricsOverviewProps {
  metrics?: Metric[]
  className?: string
}

const defaultMetrics: Metric[] = [
  {
    title: 'Total Engagement',
    value: '45.2K',
    change: 25,
    trend: 'up',
    icon: Heart,
    description: 'Likes, comments, shares',
  },
  {
    title: 'Total Reach',
    value: '125.6K',
    change: 18,
    trend: 'up',
    icon: Users,
    description: 'Unique accounts reached',
  },
  {
    title: 'Followers Growth',
    value: '15.4K',
    change: 12,
    trend: 'up',
    icon: TrendingUp,
    description: 'New followers this month',
  },
  {
    title: 'Engagement Rate',
    value: '4.8%',
    change: 8,
    trend: 'up',
    icon: Target,
    description: 'Average across platforms',
  },
]

export function MetricsOverview({ metrics = defaultMetrics, className }: MetricsOverviewProps) {
  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        const isPositive = metric.trend === 'up'
        
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span className={cn(
                  'flex items-center',
                  isPositive ? 'text-green-600' : 'text-red-600'
                )}>
                  {isPositive ? (
                    <TrendingUp className="mr-1 h-3 w-3" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3" />
                  )}
                  {metric.change}%
                </span>
                <span>from last month</span>
              </div>
              {metric.description && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {metric.description}
                </p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
