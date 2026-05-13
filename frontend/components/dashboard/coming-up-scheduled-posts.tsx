'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'

interface ScheduledPost {
  id: string
  title: string
  platforms: string[]
  scheduledTime: Date
  status: 'scheduled' | 'in-review'
}

export function ComingUpScheduledPosts() {
  const scheduledPosts: ScheduledPost[] = [
    {
      id: '1',
      title: 'Summer Sale Announcement',
      platforms: ['instagram', 'facebook'],
      scheduledTime: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
      status: 'scheduled',
    },
    {
      id: '2',
      title: 'Product Launch Event',
      platforms: ['twitter', 'linkedin'],
      scheduledTime: new Date(Date.now() + 1000 * 60 * 60 * 48), // In 2 days
      status: 'scheduled',
    },
    {
      id: '3',
      title: 'Team Achievement Highlight',
      platforms: ['linkedin', 'facebook'],
      scheduledTime: new Date(Date.now() + 1000 * 60 * 60 * 72), // In 3 days
      status: 'in-review',
    },
  ]

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-4 w-4" />
      case 'instagram':
        return <Instagram className="h-4 w-4" />
      case 'twitter':
        return <Twitter className="h-4 w-4" />
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === 'scheduled') {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400">Scheduled</span>
    }
    return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">In Review</span>
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Coming Up</h3>
        <Link href="/dashboard/content/calendar">
          <Button variant="ghost" size="sm">
            View Calendar
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {scheduledPosts.length > 0 ? (
          scheduledPosts.map((post) => (
            <div
              key={post.id}
              className="flex items-start gap-4 p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-accent/30 transition-colors"
            >
              <div className="p-2 rounded-lg bg-accent/50 h-fit">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm">{post.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1">
                    {post.platforms.map((platform) => (
                      <div
                        key={platform}
                        className="p-1 rounded bg-accent/50"
                        title={platform}
                      >
                        {getPlatformIcon(platform)}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(post.scheduledTime)}
                  </span>
                </div>
              </div>
              {getStatusBadge(post.status)}
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <p>No posts scheduled yet</p>
            <Link href="/dashboard/content/new">
              <Button variant="ghost" size="sm" className="mt-2">
                Create One
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function formatTime(date: Date): string {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
