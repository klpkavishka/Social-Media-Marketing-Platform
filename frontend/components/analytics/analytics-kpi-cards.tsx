'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface KPIMetric {
  id: string
  label: string
  value: string | number
  change: number
  trend: 'up' | 'down' | 'neutral'
  icon: React.ReactNode
  color: 'violet' | 'blue' | 'green' | 'orange'
}

interface AnalyticsKPICardsProps {
  metrics?: KPIMetric[]
}

const defaultMetrics: KPIMetric[] = [
  {
    id: 'reach',
    label: 'Total Reach',
    value: '125.4K',
    change: 12.5,
    trend: 'up',
    icon: '👥',
    color: 'blue'
  },
  {
    id: 'engagement',
    label: 'Engagement',
    value: '8,432',
    change: 23.1,
    trend: 'up',
    icon: '💬',
    color: 'green'
  },
  {
    id: 'growth',
    label: 'Follower Growth',
    value: '+2,145',
    change: 8.3,
    trend: 'up',
    icon: '📈',
    color: 'violet'
  },
  {
    id: 'avg-engagement-rate',
    label: 'Avg Engagement Rate',
    value: '6.8%',
    change: -1.2,
    trend: 'down',
    icon: '⭐',
    color: 'orange'
  }
]

const colorClasses = {
  violet: 'bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950/30 dark:to-violet-900/30 border-violet-200 dark:border-violet-800',
  blue: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800',
  green: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800',
  orange: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border-orange-200 dark:border-orange-800'
}

const iconBgClasses = {
  violet: 'bg-violet-200 dark:bg-violet-800 text-violet-700 dark:text-violet-200',
  blue: 'bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200',
  green: 'bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-200',
  orange: 'bg-orange-200 dark:bg-orange-800 text-orange-700 dark:text-orange-200'
}

export function AnalyticsKPICards({ metrics = defaultMetrics }: AnalyticsKPICardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card
          key={metric.id}
          className={`p-4 border transition-all hover:shadow-lg ${colorClasses[metric.color]}`}
        >
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-lg text-2xl ${iconBgClasses[metric.color]}`}>
                {metric.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${
                metric.trend === 'up' ? 'text-green-600' :
                metric.trend === 'down' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {metric.trend === 'up' ? (
                  <TrendingUp size={16} />
                ) : metric.trend === 'down' ? (
                  <TrendingDown size={16} />
                ) : null}
                <span>{Math.abs(metric.change)}%</span>
              </div>
            </div>

            {/* Label */}
            <div>
              <p className="text-sm text-muted-foreground font-medium">{metric.label}</p>
            </div>

            {/* Value */}
            <div>
              <p className="text-2xl md:text-3xl font-bold">{metric.value}</p>
            </div>

            {/* Trend Description */}
            <div className="text-xs text-muted-foreground">
              {metric.trend === 'up' ? (
                <span className="text-green-600 font-medium">↑ {metric.change}% from last period</span>
              ) : metric.trend === 'down' ? (
                <span className="text-red-600 font-medium">↓ {Math.abs(metric.change)}% from last period</span>
              ) : (
                <span>No change from last period</span>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
