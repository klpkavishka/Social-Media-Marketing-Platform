'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Filter, Heart, Users, TrendingUp, Target } from 'lucide-react'
import {
  MetricsOverview,
  EngagementChart,
  PlatformBreakdown,
  TopPerformingPosts,
  EngagementBreakdown,
  AudienceDemographics,
} from '@/components/analytics'
import { AnalyticsKPICards } from '@/components/analytics/analytics-kpi-cards'
import { AnalyticsChartsContainer } from '@/components/analytics/analytics-charts-container'
import { AnalyticsHeatmap } from '@/components/analytics/analytics-heatmap'
import { AnalyticsEngagementTable } from '@/components/analytics/analytics-engagement-table'
import { AnalyticsDateRangePicker } from '@/components/analytics/analytics-date-range-picker'
import { AnalyticsComparisonView } from '@/components/analytics/analytics-comparison-view'
import { AnalyticsExport } from '@/components/analytics/analytics-export'
import { Tooltip } from '@/components/tooltip'
import {
  mockMetricsData,
  mockPlatformStats,
  mockEngagementByType,
  mockTopPosts,
  mockAudienceData,
  mockTimeSeriesData,
} from '@/lib/mock/analytics-data'

export default function AnalyticsPage() {
  const [selectedDateRange, setSelectedDateRange] = useState({ start: '2026-04-11', end: '2026-05-11' })

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

  const handleDateRangeChange = (start: string, end: string) => {
    setSelectedDateRange({ start, end })
  }

  const handleExport = (format: 'pdf' | 'csv') => {
    console.log(`Exporting analytics as ${format}`)
  }

  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your social media performance
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Date Range</label>
            <AnalyticsDateRangePicker
              onDateRangeChange={handleDateRangeChange}
              defaultStartDate={selectedDateRange.start}
              defaultEndDate={selectedDateRange.end}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <AnalyticsExport onExport={handleExport} />
          </div>
        </div>
      </div>

      {/* Phase 2.8: New KPI Cards */}
      <Tooltip content="Key Performance Indicators - Track your most important metrics at a glance" side="top">
        <div>
          <AnalyticsKPICards />
        </div>
      </Tooltip>

      {/* Original Metrics Overview */}
      <Tooltip content="Summary of your engagement, reach, followers, and engagement rate across all platforms" side="top">
        <div>
          <MetricsOverview metrics={metrics} />
        </div>
      </Tooltip>

      {/* Phase 2.8: Advanced Charts Container */}
      <Tooltip content="Detailed performance charts and visualizations of your content performance" side="top">
        <div>
          <AnalyticsChartsContainer />
        </div>
      </Tooltip>

      {/* Engagement Chart */}
      <Tooltip content="Track how your engagement changes over time and identify trends in your audience interactions" side="top">
        <div>
          <EngagementChart
            data={mockTimeSeriesData}
            title="Engagement Trends"
            description="Daily engagement over the last 30 days"
          />
        </div>
      </Tooltip>

      {/* Phase 2.8: Heatmap - Best Posting Times */}
      <Tooltip content="Visualize the best times to post based on when your audience is most active and engaged" side="top">
        <div>
          <AnalyticsHeatmap />
        </div>
      </Tooltip>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Platform Breakdown */}
        <PlatformBreakdown platforms={mockPlatformStats} />

        {/* Engagement Breakdown */}
        <EngagementBreakdown data={mockEngagementByType} />
      </div>

      {/* Phase 2.8: Detailed Engagement Table */}
      <AnalyticsEngagementTable />

      {/* Top Performing Posts */}
      <TopPerformingPosts posts={mockTopPosts} limit={5} />

      {/* Phase 2.8: Comparison View */}
      <AnalyticsComparisonView
        period1="Current Period (May 1-11)"
        period2="Previous Period (Apr 20-30)"
      />

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
