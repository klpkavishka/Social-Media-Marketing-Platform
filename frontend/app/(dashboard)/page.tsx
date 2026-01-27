'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  BarChart3,
  FileText,
  TrendingUp,
  Users,
  Clock,
  Plus,
  ArrowUpRight,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Calendar,
  Target,
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Posts',
      value: '245',
      change: '+12%',
      trend: 'up',
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: 'Total Engagement',
      value: '45.2K',
      change: '+25%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'Total Reach',
      value: '125.6K',
      change: '+18%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600',
    },
    {
      title: 'Engagement Rate',
      value: '4.8%',
      change: '+0.5%',
      trend: 'up',
      icon: BarChart3,
      color: 'text-orange-600',
    },
  ]

  const platforms = [
    { name: 'Instagram', icon: Instagram, posts: 89, engagement: '18.2K', color: 'bg-pink-500' },
    { name: 'Facebook', icon: Facebook, posts: 67, engagement: '12.5K', color: 'bg-blue-600' },
    { name: 'Twitter', icon: Twitter, posts: 52, engagement: '8.9K', color: 'bg-sky-500' },
    { name: 'LinkedIn', icon: Linkedin, posts: 37, engagement: '5.6K', color: 'bg-blue-700' },
  ]

  const recentPosts = [
    {
      id: 1,
      title: 'Welcome Week 2026 Highlights',
      platform: 'Instagram',
      status: 'published',
      engagement: 1245,
      time: '2 hours ago',
    },
    {
      id: 2,
      title: 'Spring Semester Registration Open',
      platform: 'Facebook',
      status: 'published',
      engagement: 892,
      time: '5 hours ago',
    },
    {
      id: 3,
      title: 'Research Excellence Awards',
      platform: 'LinkedIn',
      status: 'published',
      engagement: 456,
      time: '1 day ago',
    },
  ]

  const upcomingPosts = [
    {
      id: 1,
      title: 'Campus Tour Video',
      platform: 'YouTube',
      scheduledFor: 'Tomorrow, 10:00 AM',
    },
    {
      id: 2,
      title: 'Student Achievement Story',
      platform: 'Instagram',
      scheduledFor: 'Tomorrow, 3:00 PM',
    },
    {
      id: 3,
      title: 'Faculty Spotlight Interview',
      platform: 'Facebook',
      scheduledFor: 'Jan 23, 11:00 AM',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your social media performance.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/content/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="flex items-center text-xs text-muted-foreground">
                  <span
                    className={`mr-1 ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                  from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer transition-colors hover:bg-accent">
          <Link href="/content/new">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Plus className="h-5 w-5" />
                Create New Post
              </CardTitle>
              <CardDescription>Generate AI-powered content for your channels</CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="cursor-pointer transition-colors hover:bg-accent">
          <Link href="/analytics">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-5 w-5" />
                View Analytics
              </CardTitle>
              <CardDescription>Track performance and engagement metrics</CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="cursor-pointer transition-colors hover:bg-accent">
          <Link href="/campaigns">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-5 w-5" />
                Manage Campaigns
              </CardTitle>
              <CardDescription>Create and track marketing campaigns</CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>

      {/* Platform Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
          <CardDescription>Overview of your activity across social platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {platforms.map((platform) => {
              const Icon = platform.icon
              return (
                <div key={platform.name} className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${platform.color}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{platform.name}</p>
                      <p className="text-sm text-muted-foreground">{platform.engagement} engagement</p>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Progress value={(platform.posts / 100) * 100} className="h-2" />
                      <span className="text-xs text-muted-foreground">{platform.posts} posts</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent & Upcoming Posts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Posts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Posts</CardTitle>
              <CardDescription>Your latest published content</CardDescription>
            </div>
            <Link href="/dashboard/content">
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
                >
                  <div className="h-12 w-12 rounded bg-gradient-to-br from-blue-500 to-purple-500" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{post.title}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {post.platform}
                      </Badge>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{post.engagement} engagements</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{post.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Schedule */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Schedule</CardTitle>
              <CardDescription>Posts scheduled for publication</CardDescription>
            </div>
            <Link href="/dashboard/content/calendar">
              <Button variant="ghost" size="sm" className="gap-1">
                <Calendar className="h-4 w-4" />
                Calendar
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded bg-muted">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{post.title}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {post.platform}
                      </Badge>
                    </div>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {post.scheduledFor}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
