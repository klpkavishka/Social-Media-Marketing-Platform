'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Share2, Eye, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface TopPost {
  id: string
  platform: string
  content: string
  image?: string
  engagement: number
  reach: number
  likes: number
  comments: number
  shares: number
  timestamp: string
}

interface TopPerformingPostsProps {
  posts?: TopPost[]
  limit?: number
  className?: string
}

const platformColors = {
  Instagram: 'bg-pink-100 text-pink-700',
  Facebook: 'bg-blue-100 text-blue-700',
  Twitter: 'bg-sky-100 text-sky-700',
  LinkedIn: 'bg-blue-100 text-blue-800',
}

export function TopPerformingPosts({ 
  posts = [], 
  limit = 5,
  className 
}: TopPerformingPostsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const displayedPosts = posts.slice(0, limit)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Top Performing Posts</CardTitle>
        <CardDescription>
          Your best content from the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedPosts.map((post, index) => {
            const platformColor = platformColors[post.platform as keyof typeof platformColors] || 'bg-gray-100 text-gray-700'
            
            return (
              <div
                key={post.id}
                className="flex space-x-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                {/* Ranking Badge */}
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-muted text-muted-foreground'
                  )}>
                    {index + 1}
                  </div>
                </div>

                {/* Post Image */}
                {post.image && (
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={post.image}
                      alt="Post thumbnail"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        // Fallback for missing images
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}

                {/* Post Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className={cn('text-xs', platformColor)}>
                          {post.platform}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(post.timestamp)}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm">
                        {post.content}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Engagement Metrics */}
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3" />
                      <span>{formatNumber(post.likes)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{formatNumber(post.comments)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Share2 className="h-3 w-3" />
                      <span>{formatNumber(post.shares)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{formatNumber(post.reach)}</span>
                    </div>
                    <div className="ml-auto font-semibold text-primary">
                      {formatNumber(post.engagement)} total
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {posts.length === 0 && (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No posts data available
          </div>
        )}

        {posts.length > limit && (
          <Button variant="outline" className="mt-4 w-full">
            View All Posts
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
