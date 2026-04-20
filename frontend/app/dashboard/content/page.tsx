'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, MoreVertical } from 'lucide-react'
import { useContent } from '@/lib/hooks/use-content'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function ContentPage() {
  const [statusFilter, setStatusFilter] = useState<string>()
  const { data, isLoading } = useContent({ status: statusFilter })
  const contents: any = data ? (('data' in data) ? data.data : []) : []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'variant-secondary'
      case 'scheduled':
        return 'variant-default'
      case 'published':
        return 'variant-success'
      case 'failed':
        return 'variant-destructive'
      default:
        return 'variant-outline'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not scheduled'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content</h1>
          <p className="text-muted-foreground">Manage your social media posts and content</p>
        </div>
        <Link href="/dashboard/content/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button 
          variant={!statusFilter ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setStatusFilter(undefined)}
        >
          All
        </Button>
        <Button 
          variant={statusFilter === 'published' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setStatusFilter('published')}
        >
          Published
        </Button>
        <Button 
          variant={statusFilter === 'scheduled' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setStatusFilter('scheduled')}
        >
          Scheduled
        </Button>
        <Button 
          variant={statusFilter === 'draft' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setStatusFilter('draft')}
        >
          Draft
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      )}

      {/* Content Grid */}
      {!isLoading && contents.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">No content found</p>
              <Link href="/dashboard/content/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Post
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contents.map((content: any) => (
            <Card key={content.id} className="overflow-hidden">
              <div className="aspect-video bg-muted" />
              <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-base line-clamp-2">{content.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {new Date(content.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={getStatusColor(content.status) as any}>
                    {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {content.scheduledDate
                      ? `${formatDate(content.scheduledDate)} at ${new Date(content.scheduledDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
                      : formatDate(content.createdAt)}
                  </span>
                </div>
                <div className="mt-2 flex gap-1 flex-wrap">
                  {content.platforms?.map((platform: string) => (
                    <Badge key={platform} variant="outline" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
