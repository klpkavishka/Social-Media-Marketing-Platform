'use client'

import { Button } from '@/components/ui/button'
import { Calendar, Download, Filter, Heart, Users, TrendingUp, Target } from 'lucide-react'
import {
  MetricsOverview,
  EngagementChart,
  PlatformBreakdown,
  TopPerformingPosts,
  EngagementBreakdown,
  AudienceDemographics,
} from '@/components/analytics'
import {
  mockMetricsData,
  mockPlatformStats,
  mockEngagementByType,
  mockTopPosts,
  mockAudienceData,
  mockTimeSeriesData,
} from '@/lib/mock/analytics-data'

export default function AnalyticsDashboardPage() {
  // Transform mock data for components
  const metrics = [
    {
      title: 'Total Engagement',
      value: mockMetricsData.totalEngagement.value.toLocaleString(),
      change: mockMetricsData.totalEngagement.change,
      trend: mockMetricsData.totalEngagement.trend,
      icon: Heart,
      description: 'Likes, comments, shares',
    },
    {
      title: 'Total Reach',
      value: mockMetricsData.totalReach.value.toLocaleString(),
      change: mockMetricsData.totalReach.change,
      trend: mockMetricsData.totalReach.trend,
      icon: Users,
      description: 'Unique accounts reached',
    },
    {
      title: 'Total Followers',
      value: mockMetricsData.totalFollowers.value.toLocaleString(),
      change: mockMetricsData.totalFollowers.change,
      trend: mockMetricsData.totalFollowers.trend,
      icon: TrendingUp,
      description: 'Follower count',
    },
    {
      title: 'Engagement Rate',
      value: `${mockMetricsData.avgEngagementRate.value}%`,
      change: mockMetricsData.avgEngagementRate.change,
      trend: mockMetricsData.avgEngagementRate.trend,
      icon: Target,
      description: 'Average across platforms',
    },
  ]

  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your social media performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <MetricsOverview metrics={metrics} />

      {/* Engagement Chart */}
      <EngagementChart
        data={mockTimeSeriesData}
        title="Engagement Trends"
        description="Daily engagement over the last 30 days"
      />

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Platform Breakdown */}
        <PlatformBreakdown platforms={mockPlatformStats} />

        {/* Engagement Breakdown */}
        <EngagementBreakdown data={mockEngagementByType} />
      </div>

      {/* Top Performing Posts */}
      <TopPerformingPosts posts={mockTopPosts} limit={5} />

      {/* Audience Demographics */}
      <AudienceDemographics
        ageGroups={mockAudienceData.demographics.ageGroups}
        gender={mockAudienceData.demographics.gender}
        topLocations={mockAudienceData.topLocations}
        activeHours={mockAudienceData.activeHours}
      />
    </div>
  )
}
