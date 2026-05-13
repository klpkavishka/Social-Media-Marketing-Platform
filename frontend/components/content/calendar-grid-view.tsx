'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Facebook, Instagram, Linkedin, Twitter, TrendingUp, Heart } from 'lucide-react'

interface ScheduledPost {
  id: string
  title: string
  platforms: ('facebook' | 'instagram' | 'twitter' | 'linkedin')[]
  status: 'scheduled' | 'draft' | 'published' | 'in-review'
  scheduledDate: Date
  engagement?: number
  reach?: number
  preview?: string
}

interface CalendarGridViewProps {
  posts?: ScheduledPost[]
  onAddPost?: (date: Date) => void
  onPostClick?: (post: ScheduledPost) => void
  onReschedule?: (post: ScheduledPost, newDate: Date) => void
}

const platformColors = {
  facebook: 'bg-blue-100 border-l-4 border-blue-600',
  instagram: 'bg-pink-100 border-l-4 border-pink-600',
  twitter: 'bg-cyan-100 border-l-4 border-cyan-500',
  linkedin: 'bg-blue-700/10 border-l-4 border-blue-700'
}

const platformIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin
}

const statusBadgeColors = {
  scheduled: 'bg-green-100 text-green-800',
  draft: 'bg-gray-100 text-gray-800',
  published: 'bg-blue-100 text-blue-800',
  'in-review': 'bg-yellow-100 text-yellow-800'
}

export function CalendarGridView({ posts = [], onAddPost, onPostClick, onReschedule }: CalendarGridViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 11)) // May 11, 2026
  const [draggedPost, setDraggedPost] = useState<ScheduledPost | null>(null)

  const monthName = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }, [daysInMonth, startingDayOfWeek])

  const getPostsForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return posts.filter((post) => {
      const postDate = new Date(post.scheduledDate)
      return (
        postDate.getFullYear() === date.getFullYear() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getDate() === date.getDate()
      )
    })
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
          {monthName}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
            className="text-xs"
          >
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="h-10 flex items-center justify-center font-semibold text-sm text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 bg-gradient-to-br from-background to-muted/10 p-2 rounded-lg">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`min-h-32 rounded-lg p-2 border transition-all ${
              day === null
                ? 'bg-muted/30'
                : isToday(day)
                  ? 'bg-violet-50 dark:bg-violet-950 border-2 border-violet-400'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
            }`}
            onDragOver={(e) => {
              e.preventDefault()
              if (draggedPost && day !== null) {
                e.currentTarget.classList.add('ring-2', 'ring-violet-500')
              }
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove('ring-2', 'ring-violet-500')
            }}
            onDrop={(e) => {
              e.preventDefault()
              e.currentTarget.classList.remove('ring-2', 'ring-violet-500')
              if (draggedPost && day !== null) {
                const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                onReschedule?.(draggedPost, newDate)
                setDraggedPost(null)
              }
            }}
          >
            {day !== null && (
              <div className="space-y-2 h-full">
                {/* Day Number */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-semibold ${
                      isToday(day) ? 'text-violet-600 font-bold' : 'text-muted-foreground'
                    }`}
                  >
                    {day}
                  </span>
                  <button
                    onClick={() => onAddPost?.(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                    className="opacity-0 hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                  >
                    <Plus size={14} className="text-muted-foreground" />
                  </button>
                </div>

                {/* Posts */}
                <div className="space-y-1 flex-1 overflow-y-auto max-h-24">
                  {getPostsForDate(day).map((post) => (
                    <div
                      key={post.id}
                      draggable
                      onDragStart={() => setDraggedPost(post)}
                      onDragEnd={() => setDraggedPost(null)}
                      onClick={() => onPostClick?.(post)}
                      className={`p-1.5 rounded text-xs cursor-move group transition-all ${
                        platformColors[post.platforms[0] as keyof typeof platformColors] ||
                        'bg-slate-100'
                      } ${draggedPost?.id === post.id ? 'opacity-50 scale-95' : 'hover:shadow-md'}`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-0.5">
                        <span className="font-medium line-clamp-1 flex-1 text-xs">{post.title}</span>
                        <span
                          className={`text-xs px-1 rounded whitespace-nowrap ${
                            statusBadgeColors[post.status]
                          }`}
                        >
                          {post.status === 'in-review' ? 'Review' : post.status.slice(0, 3)}
                        </span>
                      </div>

                      {/* Platform Icons */}
                      <div className="flex gap-0.5 mb-0.5">
                        {post.platforms.slice(0, 3).map((platform) => {
                          const Icon = platformIcons[platform]
                          return (
                            <Icon
                              key={platform}
                              size={12}
                              className={
                                platform === 'facebook'
                                  ? 'text-blue-600'
                                  : platform === 'instagram'
                                    ? 'text-pink-600'
                                    : platform === 'twitter'
                                      ? 'text-cyan-500'
                                      : 'text-blue-700'
                              }
                            />
                          )
                        })}
                        {post.platforms.length > 3 && (
                          <span className="text-xs text-muted-foreground">+{post.platforms.length - 3}</span>
                        )}
                      </div>

                      {/* Metrics Preview */}
                      {post.engagement !== undefined && (
                        <div className="flex gap-1 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          <Heart size={10} className="text-red-500" />
                          <span>{post.engagement}</span>
                          <TrendingUp size={10} className="text-green-500 ml-1" />
                          <span>{post.reach}K</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-muted-foreground flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600" />
          <span>Facebook</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-pink-600" />
          <span>Instagram</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500" />
          <span>Twitter</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-700" />
          <span>LinkedIn</span>
        </div>
      </div>
    </div>
  )
}
