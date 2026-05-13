'use client'

import { MessageSquare, Heart, CheckCircle2, Clock } from 'lucide-react'

interface Activity {
  id: string
  type: 'post' | 'engagement' | 'team' | 'system'
  title: string
  description: string
  timestamp: Date
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  color: string
}

export function RecentActivityFeed() {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'post',
      title: 'Post Published',
      description: 'Your post &quot;Summer Campaign&quot; was published to Instagram',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
      icon: CheckCircle2,
      color: 'text-green-500 bg-green-500/10',
    },
    {
      id: '2',
      type: 'engagement',
      title: 'New Engagement',
      description: '42 people liked your recent post on LinkedIn',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 min ago
      icon: Heart,
      color: 'text-red-500 bg-red-500/10',
    },
    {
      id: '3',
      type: 'team',
      title: 'Team Member Added',
      description: 'Sarah joined your team as Marketing Manager',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      icon: MessageSquare,
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      id: '4',
      type: 'system',
      title: 'Workflow Executed',
      description: 'Auto-post workflow was successfully executed',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      icon: Clock,
      color: 'text-purple-500 bg-purple-500/10',
    },
  ]

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex gap-4 pb-4 border-b last:border-0 last:pb-0 hover:bg-accent/30 p-2 rounded transition-colors"
          >
            <div className={`${activity.color} p-2 rounded-lg h-fit flex-shrink-0`}>
              <activity.icon className={`h-5 w-5 ${activity.color.split(' ')[0]}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm">{activity.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {formatTime(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  
  return date.toLocaleDateString()
}
