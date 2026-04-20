'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  Heart,
  Eye,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { formatNumber } from '@/lib/utils/format'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ElementType
  color: string
}

function MetricCard({ title, value, change, icon: Icon, color }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">
              {typeof value === 'number' ? formatNumber(value) : value}
            </p>
            {change !== undefined && (
              <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                <span className="font-medium">{Math.abs(change)}%</span>
                <span className="text-muted-foreground">vs last period</span>
              </div>
            )}
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface AccountMetricsSummaryProps {
  totalFollowers: number
  totalPosts: number
  totalEngagement: number
  totalReach: number
  engagementRate: number
  followerChange?: number
  engagementChange?: number
  reachChange?: number
}

export function AccountMetricsSummary({
  totalFollowers,
  totalPosts,
  totalEngagement,
  totalReach,
  followerChange,
  engagementChange,
  reachChange,
}: AccountMetricsSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Followers"
        value={totalFollowers}
        change={followerChange}
        icon={Users}
        color="bg-blue-500"
      />
      <MetricCard
        title="Total Posts"
        value={totalPosts}
        icon={BarChart3}
        color="bg-purple-500"
      />
      <MetricCard
        title="Total Engagement"
        value={totalEngagement}
        change={engagementChange}
        icon={Heart}
        color="bg-pink-500"
      />
      <MetricCard
        title="Total Reach"
        value={totalReach}
        change={reachChange}
        icon={Eye}
        color="bg-green-500"
      />
    </div>
  )
}

interface RecentActivityProps {
  activities: Array<{
    id: string
    platform: string
    action: string
    time: string
    value?: string
  }>
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
              <div className="space-y-1">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.platform} • {activity.time}
                </p>
              </div>
              {activity.value && (
                <span className="text-sm font-semibold">{activity.value}</span>
              )}
            </div>
          ))}
          {activities.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No recent activity
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
