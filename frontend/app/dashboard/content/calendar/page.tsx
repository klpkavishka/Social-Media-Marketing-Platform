'use client'

import { useState, useMemo } from 'react'
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
  List,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CalendarEventCard } from '@/components/content/calendar-event-card'
import { ContentDetailSheet } from '@/components/content/content-detail-sheet'
import { useCalendarContent, useDeleteContent } from '@/lib/hooks/use-content'
import { cn } from '@/lib/utils'

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

type ViewMode = 'month' | 'week'

export default function CalendarPage() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

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

  // Filter content
  const filteredContent = useMemo(() => {
    if (!calendarData?.data || !Array.isArray(calendarData.data)) return []
    return calendarData.data.filter(
      (content) =>
        statusFilter.includes(content.status) &&
        content.platforms?.some((p: string) => platformFilter.includes(p.toLowerCase()))
    )
  }, [calendarData, statusFilter, platformFilter])

  // Group content by date
  const contentByDate = useMemo(() => {
    const grouped: Record<string, Content[]> = {}
    filteredContent.forEach((content) => {
      if (content.scheduledDate) {
        const date = new Date(content.scheduledDate).toDateString()
        if (!grouped[date]) {
          grouped[date] = []
        }
        grouped[date].push(content)
      }
    })
    // Sort content by time for each date
    Object.keys(grouped).forEach((date) => {
      grouped[date].sort((a, b) => {
        const timeA = new Date(a.scheduledDate!).getTime()
        const timeB = new Date(b.scheduledDate!).getTime()
        return timeA - timeB
      })
    })
    return grouped
  }, [filteredContent])

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate()

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay()

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i)

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const handleViewContent = (content: Content) => {
    setSelectedContent(content)
    setIsDetailOpen(true)
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

  const getDateContent = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    ).toDateString()
    return contentByDate[date] || []
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
              {currentDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
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
              className="rounded-r-none"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'week' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('week')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
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

      {/* Calendar Grid */}
      {!isLoading && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-2">
              {/* Day Headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-sm font-semibold text-muted-foreground"
                >
                  {day}
                </div>
              ))}

              {/* Empty days for alignment */}
              {emptyDays.map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[120px] p-2" />
              ))}

              {/* Calendar days */}
              {days.map((day) => {
                const dayContent = getDateContent(day)
                const date = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day
                )

                return (
                  <div
                    key={day}
                    className={cn(
                      'group relative min-h-[120px] rounded-lg border bg-card p-2 transition-colors hover:bg-accent',
                      isToday(day) && 'border-primary bg-primary/5'
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div
                        className={cn(
                          'flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium',
                          isToday(day) &&
                            'bg-primary text-primary-foreground'
                        )}
                      >
                        {day}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={() => handleCreatePost(date)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Content Events */}
                    <div className="space-y-1 overflow-y-auto max-h-[80px]">
                      {dayContent.map((content) => (
                        <CalendarEventCard
                          key={content.id}
                          content={content}
                          onView={handleViewContent}
                          onEdit={handleEditContent}
                          onDelete={handleDeleteContent}
                        />
                      ))}
                    </div>

                    {/* More indicator */}
                    {dayContent.length > 3 && (
                      <div className="mt-1 text-center">
                        <span className="text-xs text-muted-foreground">
                          +{dayContent.length - 3} more
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 p-4">
          <span className="text-sm font-medium">Legend:</span>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-gray-500" />
            <span className="text-sm">Draft</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-blue-500" />
            <span className="text-sm">Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-green-500" />
            <span className="text-sm">Published</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-red-500" />
            <span className="text-sm">Failed</span>
          </div>
        </CardContent>
      </Card>

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
    </div>
  )
}

