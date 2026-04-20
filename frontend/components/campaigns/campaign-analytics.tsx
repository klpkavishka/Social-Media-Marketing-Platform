'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CampaignAnalytics } from '@/lib/api/campaigns'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  MousePointer,
  Heart,
  Target,
  Calendar,
  CheckCircle2,
  FileText,
} from 'lucide-react'

interface CampaignAnalyticsProps {
  analytics: CampaignAnalytics
}

export function CampaignAnalyticsComponent({ analytics }: CampaignAnalyticsProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num)
  }

  const formatPercentage = (num: number) => {
    return `${num.toFixed(2)}%`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'paused':
        return 'bg-yellow-500'
      case 'completed':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getRoiColor = (roi: number) => {
    if (roi >= 100) return 'text-green-600'
    if (roi >= 0) return 'text-blue-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            {analytics.metrics.roi >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getRoiColor(analytics.metrics.roi)}`}>
              {formatPercentage(analytics.metrics.roi)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Return on investment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Budget Used</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analytics.budget.spent)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              of {formatCurrency(analytics.budget.allocated)}
            </p>
            <Progress
              value={analytics.budget.utilizationPercentage}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(analytics.performance.impressions)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(analytics.metrics.engagementRate)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatNumber(analytics.performance.engagements)} engagements
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators for this campaign</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MousePointer className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Clicks</span>
              </div>
              <span className="font-semibold">{formatNumber(analytics.performance.clicks)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Reach</span>
              </div>
              <span className="font-semibold">{formatNumber(analytics.performance.reach)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Conversions</span>
              </div>
              <span className="font-semibold">
                {formatNumber(analytics.performance.conversions)}
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Click-Through Rate</span>
              </div>
              <span className="font-semibold">{formatPercentage(analytics.metrics.ctr)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Cost Per Click</span>
              </div>
              <span className="font-semibold">{formatCurrency(analytics.metrics.cpc)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Cost Per Engagement</span>
              </div>
              <span className="font-semibold">{formatCurrency(analytics.metrics.cpe)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Timeline</CardTitle>
            <CardDescription>Duration and progress tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Status</span>
              </div>
              <Badge className={getStatusColor(analytics.status)}>
                {analytics.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Total Days</span>
              <span className="font-semibold">{analytics.period.daysTotal}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Days Elapsed</span>
              <span className="font-semibold">{analytics.period.daysElapsed}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Days Remaining</span>
              <span className="font-semibold">{analytics.period.daysRemaining}</span>
            </div>

            {analytics.period.daysTotal > 0 && (
              <div className="pt-2">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>
                    {formatPercentage(
                      (analytics.period.daysElapsed / analytics.period.daysTotal) * 100
                    )}
                  </span>
                </div>
                <Progress
                  value={(analytics.period.daysElapsed / analytics.period.daysTotal) * 100}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Goals and Content */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Goals</CardTitle>
            <CardDescription>Objectives for this campaign</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.goals.length > 0 ? (
              <ul className="space-y-2">
                {analytics.goals.map((goal, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{goal}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No goals defined</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Overview</CardTitle>
            <CardDescription>Associated content pieces</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Total Content</span>
              </div>
              <span className="font-semibold">{analytics.content.totalPieces}</span>
            </div>

            {Object.keys(analytics.content.byStatus).length > 0 && (
              <div className="space-y-2 pt-2 border-t">
                <p className="text-sm font-medium">By Status</p>
                {Object.entries(analytics.content.byStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground capitalize">{status}</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Platforms */}
      {analytics.platforms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Target Platforms</CardTitle>
            <CardDescription>Social media platforms for this campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analytics.platforms.map((platform) => (
                <Badge key={platform} variant="secondary" className="capitalize">
                  {platform}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
