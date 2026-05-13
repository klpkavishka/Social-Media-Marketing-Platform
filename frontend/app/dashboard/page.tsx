'use client'

import { useEffect, useState } from 'react'
import { WelcomeSection } from '@/components/dashboard/welcome-section'
import { QuickStatsCards } from '@/components/dashboard/quick-stats-cards'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { RecentActivityFeed } from '@/components/dashboard/recent-activity-feed'
import { PerformanceChart } from '@/components/dashboard/performance-chart'
import { ComingUpScheduledPosts } from '@/components/dashboard/coming-up-scheduled-posts'
import { RecentlyUsed } from '@/components/dashboard/recently-used'
import { GeneratorPage } from '@/components/generator/generator-page'
import { SkeletonCard, SkeletonText, SkeletonTable } from '@/components/loading-states'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sparkles, BarChart3 } from 'lucide-react'

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('generator')

  // Simulate data loading
  useEffect(() => {
    // In production, replace with actual API call
    // setIsLoading(true)
    // const timer = setTimeout(() => setIsLoading(false), 2000)
    // return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Welcome Section Skeleton */}
        <SkeletonCard />

        {/* Quick Stats Skeleton - 4 columns */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>

        {/* Quick Actions Skeleton */}
        <SkeletonCard />

        {/* Main Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SkeletonCard />
          </div>
          <div className="lg:col-span-1">
            <SkeletonCard />
          </div>
        </div>

        {/* Recent Activity and Recently Used Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SkeletonTable rows={4} columns={1} />
          </div>
          <div className="lg:col-span-1">
            <SkeletonCard />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tabs: Generator vs Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Generator</span>
            <span className="sm:hidden">Create</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: CONTENT GENERATOR (Primary Feature) */}
        <TabsContent value="generator" className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content Generator</h1>
            <p className="text-muted-foreground">
              Upload images and let AI generate captions, hashtags, and optimized content for your social media
            </p>
          </div>
          <GeneratorPage />
        </TabsContent>

        {/* TAB 2: ANALYTICS & OVERVIEW */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Welcome Section */}
          <WelcomeSection />

          {/* Quick Stats */}
          <QuickStatsCards />

          {/* Quick Actions */}
          <QuickActions />

          {/* Main Grid - Performance Chart and Coming Up */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PerformanceChart />
            </div>
            <div className="lg:col-span-1">
              <ComingUpScheduledPosts />
            </div>
          </div>

          {/* Recent Activity and Recently Used */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentActivityFeed />
            </div>
            <div className="lg:col-span-1">
              <RecentlyUsed />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
