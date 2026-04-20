'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUp, ArrowDown, TrendingUp, Eye, MousePointer, Heart, Target } from 'lucide-react'
import { CampaignAnalytics } from '@/lib/api/campaigns'

interface CampaignStatsProps {
  analytics: CampaignAnalytics
  isLoading?: boolean
}

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  description?: string
}

function StatCard({ title, value, change, icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {change !== undefined && (
          <div className="flex items-center text-xs mt-1">
            {change >= 0 ? (
              <>
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-green-500">{change}%</span>
              </>
            ) : (
              <>
                <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                <span className="text-red-500">{Math.abs(change)}%</span>
              </>
            )}
            <span className="text-muted-foreground ml-1">from last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function CampaignStats({ analytics, isLoading }: CampaignStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const engagementRate = analytics.performance.impressions > 0
    ? ((analytics.performance.engagements / analytics.performance.impressions) * 100).toFixed(2)
    : '0.00'

  const ctr = analytics.performance.impressions > 0
    ? ((analytics.performance.clicks / analytics.performance.impressions) * 100).toFixed(2)
    : '0.00'

  const conversionRate = analytics.performance.clicks > 0
    ? ((analytics.performance.conversions / analytics.performance.clicks) * 100).toFixed(2)
    : '0.00'

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Impressions"
        value={analytics.performance.impressions}
        icon={<Eye className="h-4 w-4 text-muted-foreground" />}
        description="Total views"
      />
      <StatCard
        title="Clicks"
        value={analytics.performance.clicks}
        icon={<MousePointer className="h-4 w-4 text-muted-foreground" />}
        description={`${ctr}% CTR`}
      />
      <StatCard
        title="Engagement"
        value={analytics.performance.engagements}
        icon={<Heart className="h-4 w-4 text-muted-foreground" />}
        description={`${engagementRate}% rate`}
      />
      <StatCard
        title="Conversions"
        value={analytics.performance.conversions}
        icon={<Target className="h-4 w-4 text-muted-foreground" />}
        description={`${conversionRate}% conversion rate`}
      />

      {analytics.metrics.cpe && (
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Per Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${analytics.metrics.cpe.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average cost per user interaction
            </p>
          </CardContent>
        </Card>
      )}

      {analytics.metrics.roi !== undefined && (
        <Card className={analytics.metrics.roi > 0 ? 'md:col-span-2' : 'md:col-span-2'}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${analytics.metrics.roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.metrics.roi > 0 ? '+' : ''}{analytics.metrics.roi.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Return on investment
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
