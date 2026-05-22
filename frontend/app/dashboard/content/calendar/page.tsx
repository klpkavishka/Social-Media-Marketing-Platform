'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Filter,
  Grid3x3,
  Calendar,
  Clock,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ContentDetailSheet } from '@/components/content/content-detail-sheet'
import { CalendarGridView } from '@/components/content/calendar-grid-view'
import { CalendarWeekView } from '@/components/content/calendar-week-view'
import { CalendarDayView } from '@/components/content/calendar-day-view'
import { PlatformColorLegend } from '@/components/content/platform-color-legend'
import { CalendarQuickAddModal } from '@/components/content/calendar-quick-add-modal'
import { useCalendarContent, useDeleteContent, useCreateContent } from '@/lib/hooks/use-content'

interface Content {
  id: string
  title: string
  body: string
  type: 'post' | 'story' | 'reel' | 'video' | 'image'
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  media?: Record<string, unknown>
  platforms: string[]
  scheduledDate?: string
  publishedDate?: string
  aiSuggestions?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

interface ScheduledPost {
  id: string
  title: string
  platforms: ('facebook' | 'instagram' | 'twitter' | 'linkedin')[]
  status: 'scheduled' | 'draft' | 'published' | 'in-review'
  scheduledDate: Date
  engagement?: number
  reach?: number
  preview?: string
  media?: Record<string, unknown>
  imageBase64?: string
}

type ViewMode = 'month' | 'week' | 'day'

export default function CalendarPage() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [quickAddDate, setQuickAddDate] = useState<Date>(new Date())
  const [generations, setGenerations] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/hashtags/generations')
      .then((res) => {
        if (res.ok) return res.json()
        throw new Error('Failed to fetch')
      })
      .then((data) => setGenerations(data))
      .catch((err) => console.error('Error fetching generations:', err))
  }, [])

  const dateLabel = useMemo(() => {
    if (viewMode === 'month') {
      return currentDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    } else if (viewMode === 'week') {
      const start = new Date(currentDate)
      const day = start.getDay()
      start.setDate(start.getDate() - day)
      const end = new Date(start)
      end.setDate(end.getDate() + 6)
      
      const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      return `${startStr} - ${endStr}`
    } else {
      return currentDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    }
  }, [currentDate, viewMode])

  // Filters
  const [statusFilter, setStatusFilter] = useState<string[]>([
    'draft',
    'scheduled',
    'published',
    'failed',
  ])
  const [platformFilter, setPlatformFilter] = useState<string[]>([
    'facebook',
    'twitter',
    'instagram',
    'linkedin',
    'tiktok',
  ])

  // Calculate date range for API
  const dateRange = useMemo(() => {
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    
    // Add extra days for previous and next month to fill calendar grid
    const firstDayOfMonth = start.getDay()
    start.setDate(start.getDate() - firstDayOfMonth)
    
    const lastDayOfMonth = end.getDay()
    if (lastDayOfMonth !== 6) {
      end.setDate(end.getDate() + (6 - lastDayOfMonth))
    }

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    }
  }, [currentDate])

  // Fetch calendar data
  const { data: calendarData, isLoading } = useCalendarContent(dateRange)
  const deleteContent = useDeleteContent()
  const createContent = useCreateContent()

  // Filter content
  const filteredContent = useMemo(() => {
    if (!calendarData?.data || !Array.isArray(calendarData.data)) return []
    return calendarData.data.filter(
      (content) =>
        statusFilter.includes(content.status) &&
        content.platforms?.some((p: string) => platformFilter.includes(p.toLowerCase()))
    )
  }, [calendarData, statusFilter, platformFilter])

  const previousMonth = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    } else if (viewMode === 'week') {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))
    } else {
      setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000))
    }
  }

  const nextMonth = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    } else if (viewMode === 'week') {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))
    } else {
      setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000))
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const handleEditContent = (content: Content) => {
    router.push(`/dashboard/content/${content.id}/edit`)
  }

  const handleDeleteContent = (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      deleteContent.mutate(id, {
        onSuccess: () => {
          setIsDetailOpen(false)
          setSelectedContent(null)
        },
      })
    }
  }

  const handleCreatePost = (date?: Date) => {
    const params = date ? `?scheduledDate=${date.toISOString()}` : ''
    router.push(`/dashboard/content/new${params}`)
  }

  // Convert backend content to ScheduledPost format
  const scheduledPosts: ScheduledPost[] = useMemo(() => {
    const genMap: Record<string, string> = {}
    generations.forEach((gen) => {
      if (gen._id && gen.imageBase64) {
        genMap[gen._id] = gen.imageBase64
      }
    })

    return filteredContent.map((content) => {
      const genId = (content.media as any)?.generationId
      const imageBase64 = genId ? genMap[genId] : undefined

      return {
        id: content.id,
        title: content.title,
        platforms: (content.platforms || [])
          .map((p: string) => p.toLowerCase() as 'facebook' | 'instagram' | 'twitter' | 'linkedin')
          .filter((p: 'facebook' | 'instagram' | 'twitter' | 'linkedin') =>
            ['facebook', 'instagram', 'twitter', 'linkedin'].includes(p)
          ),
        status: (content.status === 'scheduled' ? 'scheduled' : content.status) as
          | 'scheduled'
          | 'draft'
          | 'published'
          | 'in-review',
        scheduledDate: new Date(content.scheduledDate || new Date()),
        engagement: Math.floor(Math.random() * 500),
        reach: Math.floor(Math.random() * 50),
        preview: content.body,
        media: content.media,
        imageBase64
      }
    })
  }, [filteredContent, generations])

  const handleAddPost = (post: {
    title: string
    preview: string
    platforms: ('facebook' | 'instagram' | 'twitter' | 'linkedin')[]
    scheduledDate: Date
    generationId?: string
  }) => {
    createContent.mutate({
      title: post.title,
      body: post.preview,
      type: 'post',
      status: 'scheduled',
      platforms: post.platforms,
      scheduledDate: post.scheduledDate.toISOString(),
      media: post.generationId ? { generationId: post.generationId } : undefined
    })
  }

  const handlePostClick = (post: ScheduledPost) => {
    const content = filteredContent.find((c) => c.id === post.id)
    if (content) {
      setSelectedContent(content)
      setIsDetailOpen(true)
    }
  }

  const handleReschedule = (post: ScheduledPost, newDate: Date) => {
    // In a real app, this would update the backend
    // For now, just show the new create form with the new date
    const params = `?scheduledDate=${newDate.toISOString()}`
    router.push(`/dashboard/content/new${params}`)
  }

  const openQuickAdd = (date: Date) => {
    setQuickAddDate(date)
    setQuickAddOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Calendar</h1>
          <p className="text-muted-foreground">
            View and manage your scheduled content
          </p>
        </div>
        <Button onClick={() => handleCreatePost()} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Post
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Date Navigation */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={goToToday} className="min-w-[80px]">
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 px-3">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="min-w-[160px] font-semibold">
              {dateLabel}
            </span>
          </div>
        </div>

        {/* View Mode and Filters */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex rounded-lg border">
            <Button
              variant={viewMode === 'month' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('month')}
              className="rounded-r-none gap-2"
            >
              <Grid3x3 className="h-4 w-4" />
              <span className="hidden sm:inline">Month</span>
            </Button>
            <Button
              variant={viewMode === 'week' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('week')}
              className="rounded-none gap-2 hidden sm:flex"
            >
              <Calendar className="h-4 w-4" />
              <span>Week</span>
            </Button>
            <Button
              variant={viewMode === 'day' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('day')}
              className="rounded-l-none gap-2 hidden sm:flex"
            >
              <Clock className="h-4 w-4" />
              <span>Day</span>
            </Button>
          </div>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Status
                {statusFilter.length < 4 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1">
                    {statusFilter.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['draft', 'scheduled', 'published', 'failed'].map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={statusFilter.includes(status)}
                  onCheckedChange={(checked) => {
                    setStatusFilter((prev) =>
                      checked
                        ? [...prev, status]
                        : prev.filter((s) => s !== status)
                    )
                  }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Platform Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Platforms
                {platformFilter.length < 5 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1">
                    {platformFilter.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by Platform</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['facebook', 'twitter', 'instagram', 'linkedin', 'tiktok'].map(
                (platform) => (
                  <DropdownMenuCheckboxItem
                    key={platform}
                    checked={platformFilter.includes(platform)}
                    onCheckedChange={(checked) => {
                      setPlatformFilter((prev) =>
                        checked
                          ? [...prev, platform]
                          : prev.filter((p) => p !== platform)
                      )
                    }}
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </DropdownMenuCheckboxItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading calendar...</p>
          </CardContent>
        </Card>
      )}

      {/* Calendar Views */}
      {!isLoading && (
        <div className="space-y-4">
          {/* Month View */}
          {viewMode === 'month' && (
            <Card>
              <CardContent className="p-4">
                <CalendarGridView
                  posts={scheduledPosts}
                  currentDate={currentDate}
                  onAddPost={openQuickAdd}
                  onPostClick={handlePostClick}
                  onReschedule={handleReschedule}
                />
              </CardContent>
            </Card>
          )}

          {/* Week View */}
          {viewMode === 'week' && (
            <Card>
              <CardContent className="p-4">
                <CalendarWeekView
                  posts={scheduledPosts}
                  currentDate={currentDate}
                  onAddPost={openQuickAdd}
                  onPostClick={handlePostClick}
                  onReschedule={handleReschedule}
                />
              </CardContent>
            </Card>
          )}

          {/* Day View */}
          {viewMode === 'day' && (
            <Card>
              <CardContent className="p-4">
                <CalendarDayView
                  posts={scheduledPosts}
                  currentDate={currentDate}
                  onAddPost={openQuickAdd}
                  onPostClick={handlePostClick}
                  onReschedule={handleReschedule}
                />
              </CardContent>
            </Card>
          )}

          {/* Platform Legend */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              {/* Info Card */}
              <Card className="bg-gradient-to-br from-violet-50 to-cyan-50 dark:from-violet-950/20 dark:to-cyan-950/20">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <span className="text-lg">💡</span>
                      Calendar Features
                    </h3>
                    <ul className="text-xs text-muted-foreground space-y-1 ml-6">
                      <li>✓ Drag and drop posts to reschedule</li>
                      <li>✓ Click + button to add new post</li>
                      <li>✓ Filter by platform and status</li>
                      <li>✓ Switch between Month, Week, and Day views</li>
                      <li>✓ See performance metrics on hover</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <PlatformColorLegend includeStatus={true} compact={false} />
            </div>
          </div>
        </div>
      )}

      {/* Content Detail Sheet */}
      <ContentDetailSheet
        content={selectedContent}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onEdit={() => {
          if (selectedContent) {
            handleEditContent(selectedContent)
          }
        }}
        onDelete={() => {
          if (selectedContent) {
            handleDeleteContent(selectedContent.id)
          }
        }}
      />

      {/* Quick Add Modal */}
      <CalendarQuickAddModal
        open={quickAddOpen}
        onOpenChange={setQuickAddOpen}
        selectedDate={quickAddDate}
        onAdd={handleAddPost}
      />
    </div>
  )
}

