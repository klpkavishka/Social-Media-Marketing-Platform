'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RecentItem {
  id: string
  name: string
  type: 'content' | 'campaign' | 'workflow'
  href: string
  timestamp: Date
  icon: string
}

export function RecentlyUsed() {
  const [recentItems, setRecentItems] = useState<RecentItem[]>([
    {
      id: '1',
      name: 'Summer Campaign 2026',
      type: 'campaign',
      href: '/dashboard/campaigns/1',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      icon: '📢',
    },
    {
      id: '2',
      name: 'Product Launch Post',
      type: 'content',
      href: '/dashboard/content/2',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      icon: '📝',
    },
    {
      id: '3',
      name: 'Auto-Post Workflow',
      type: 'workflow',
      href: '/dashboard/workflows/3',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      icon: '⚙️',
    },
  ])

  const handleRemove = (id: string) => {
    setRecentItems(prev => prev.filter(item => item.id !== id))
  }

  const handleClearAll = () => {
    setRecentItems([])
  }

  if (recentItems.length === 0) {
    return null
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Recently Used</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearAll}
          className="text-xs"
        >
          Clear
        </Button>
      </div>

      <div className="space-y-2">
        {recentItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors group"
          >
            <Link
              href={item.href}
              className="flex items-center gap-3 flex-1 min-w-0"
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <div className="min-w-0">
                <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                  {item.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(item.timestamp)}
                </p>
              </div>
            </Link>
            <button
              onClick={() => handleRemove(item.id)}
              className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
              title="Remove"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </button>
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
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return date.toLocaleDateString()
}
