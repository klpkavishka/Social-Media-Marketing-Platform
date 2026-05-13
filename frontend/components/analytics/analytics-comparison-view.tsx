'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface ComparisonMetric {
  label: string
  current: number | string
  previous: number | string
  change: number
  trend: 'up' | 'down' | 'neutral'
  unit?: string
}

interface AnalyticsComparisonViewProps {
  period1?: string
  period2?: string
  metrics?: ComparisonMetric[]
}

const defaultMetrics: ComparisonMetric[] = [
  {
    label: 'Total Posts',
    current: 145,
    previous: 128,
    change: 13.3,
    trend: 'up'
  },
  {
    label: 'Total Engagement',
    current: '8,432',
    previous: '6,821',
    change: 23.6,
    trend: 'up'
  },
  {
    label: 'Average Engagement Rate',
    current: '6.8%',
    previous: '5.9%',
    change: 15.3,
    trend: 'up'
  },
  {
    label: 'Total Reach',
    current: '125.4K',
    previous: '112.3K',
    change: 11.6,
    trend: 'up'
  },
  {
    label: 'Follower Growth',
    current: '2,145',
    previous: '1,890',
    change: 13.5,
    trend: 'up'
  },
  {
    label: 'Average Post Reach',
    current: '865',
    previous: '877',
    change: -1.4,
    trend: 'down'
  }
]

export function AnalyticsComparisonView({
  period1 = 'Current Period (May 1-11)',
  period2 = 'Previous Period (Apr 20-30)',
  metrics = defaultMetrics
}: AnalyticsComparisonViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Period Comparison</CardTitle>
        <CardDescription>Compare metrics between two time periods</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Period Headers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b">
            <div className="md:col-span-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase">Metric</h3>
            </div>
            <div className="md:col-span-1">
              <h3 className="text-sm font-semibold">{period1}</h3>
              <p className="text-xs text-muted-foreground">Current</p>
            </div>
            <div className="md:col-span-1">
              <h3 className="text-sm font-semibold">{period2}</h3>
              <p className="text-xs text-muted-foreground">Previous</p>
            </div>
          </div>

          {/* Comparison Rows */}
          <div className="space-y-3">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors"
              >
                {/* Label */}
                <div>
                  <p className="font-medium text-sm">{metric.label}</p>
                </div>

                {/* Current Value */}
                <div className="flex items-center justify-between md:justify-start">
                  <p className="font-bold text-lg text-violet-600 dark:text-violet-400">
                    {metric.current}
                  </p>
                </div>

                {/* Previous Value & Change */}
                <div className="flex items-center justify-between gap-2">
                  <p className="text-muted-foreground text-sm">{metric.previous}</p>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded font-semibold text-sm ${
                      metric.trend === 'up'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : metric.trend === 'down'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                    }`}
                  >
                    {metric.trend === 'up' ? (
                      <TrendingUp size={14} />
                    ) : metric.trend === 'down' ? (
                      <TrendingDown size={14} />
                    ) : (
                      <span>—</span>
                    )}
                    <span>{Math.abs(metric.change)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-gradient-to-r from-violet-50 to-cyan-50 dark:from-violet-950/30 dark:to-cyan-950/30 rounded-lg border border-violet-200 dark:border-violet-800">
            <h4 className="font-semibold mb-2">Summary</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>✓ Overall performance improved by <span className="font-semibold text-foreground">15.2%</span></li>
              <li>✓ Engagement up by <span className="font-semibold text-green-600 dark:text-green-400">23.6%</span></li>
              <li>✓ Reach increased by <span className="font-semibold text-green-600 dark:text-green-400">11.6%</span></li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
