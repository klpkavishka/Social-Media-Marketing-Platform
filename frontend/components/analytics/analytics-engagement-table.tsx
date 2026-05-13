'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronUp, ChevronDown, Heart, MessageCircle, Share2 } from 'lucide-react'

interface EngagementMetric {
  id: string
  postTitle: string
  platform: string
  date: string
  engagement: number
  reach: number
  likes: number
  comments: number
  shares: number
  engagementRate: number
}

interface AnalyticsEngagementTableProps {
  data?: EngagementMetric[]
}

const defaultData: EngagementMetric[] = [
  {
    id: '1',
    postTitle: 'Summer Product Launch Announcement',
    platform: 'Instagram',
    date: '2026-05-10',
    engagement: 1250,
    reach: 18500,
    likes: 950,
    comments: 185,
    shares: 115,
    engagementRate: 6.8
  },
  {
    id: '2',
    postTitle: 'Behind the Scenes: Team Culture',
    platform: 'Facebook',
    date: '2026-05-09',
    engagement: 892,
    reach: 14200,
    likes: 650,
    comments: 142,
    shares: 100,
    engagementRate: 6.3
  },
  {
    id: '3',
    postTitle: 'Weekly Tips: Social Media Best Practices',
    platform: 'Twitter',
    date: '2026-05-08',
    engagement: 645,
    reach: 9800,
    likes: 480,
    comments: 125,
    shares: 40,
    engagementRate: 6.6
  },
  {
    id: '4',
    postTitle: 'Company Milestone: 50K Followers!',
    platform: 'LinkedIn',
    date: '2026-05-07',
    engagement: 1520,
    reach: 22300,
    likes: 1100,
    comments: 320,
    shares: 100,
    engagementRate: 6.8
  },
  {
    id: '5',
    postTitle: 'New Feature Release Blog Post',
    platform: 'Instagram',
    date: '2026-05-06',
    engagement: 756,
    reach: 11200,
    likes: 580,
    comments: 98,
    shares: 78,
    engagementRate: 6.7
  }
]

type SortField = 'engagement' | 'reach' | 'engagementRate' | 'date'

export function AnalyticsEngagementTable({ data = defaultData }: AnalyticsEngagementTableProps) {
  const [sortBy, setSortBy] = useState<SortField>('engagement')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]
    return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1)
  })

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortBy !== field) return <div className="w-4 h-4" />
    return sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
  }

  const platformColors = {
    Instagram: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-200',
    Facebook: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
    Twitter: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200',
    LinkedIn: 'bg-blue-700/10 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Metrics by Post</CardTitle>
        <CardDescription>Detailed performance data for your recent posts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Post Title</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Platform</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Date</th>
                <th>
                  <button
                    onClick={() => toggleSort('reach')}
                    className="flex items-center gap-1 font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Reach
                    <SortIcon field="reach" />
                  </button>
                </th>
                <th>
                  <button
                    onClick={() => toggleSort('engagement')}
                    className="flex items-center gap-1 font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Engagement
                    <SortIcon field="engagement" />
                  </button>
                </th>
                <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Breakdown</th>
                <th>
                  <button
                    onClick={() => toggleSort('engagementRate')}
                    className="flex items-center gap-1 font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Rate
                    <SortIcon field="engagementRate" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="max-w-xs">
                      <p className="font-medium line-clamp-2">{item.postTitle}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        platformColors[item.platform as keyof typeof platformColors] ||
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.platform}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold">
                    {item.reach.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-violet-600 dark:text-violet-400">
                    {item.engagement.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex items-center gap-0.5 text-xs" title={`${item.likes} likes`}>
                        <Heart size={14} className="text-red-500" />
                        <span>{(item.likes / 1000).toFixed(1)}K</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-xs" title={`${item.comments} comments`}>
                        <MessageCircle size={14} className="text-blue-500" />
                        <span>{item.comments}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-xs" title={`${item.shares} shares`}>
                        <Share2 size={14} className="text-green-500" />
                        <span>{item.shares}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-green-600 dark:text-green-400">
                    {item.engagementRate.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900/30 rounded-lg">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs font-medium">Total Reach</p>
              <p className="text-lg font-bold">{(data.reduce((sum, item) => sum + item.reach, 0) / 1000).toFixed(0)}K</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium">Total Engagement</p>
              <p className="text-lg font-bold">{(data.reduce((sum, item) => sum + item.engagement, 0) / 1000).toFixed(1)}K</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium">Avg Rate</p>
              <p className="text-lg font-bold">
                {(data.reduce((sum, item) => sum + item.engagementRate, 0) / data.length).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium">Posts</p>
              <p className="text-lg font-bold">{data.length}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
