'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ScheduledPost {
  id: string
  title: string
  platforms: ('facebook' | 'instagram' | 'twitter' | 'linkedin')[]
  status: 'scheduled' | 'draft' | 'published' | 'in-review'
  scheduledDate: Date
  engagement?: number
  reach?: number
}

interface CalendarWeekViewProps {
  posts?: ScheduledPost[]
  onAddPost?: (date: Date, hour: number) => void
  onPostClick?: (post: ScheduledPost) => void
  onReschedule?: (post: ScheduledPost, newDateTime: Date) => void
}

const platformColors = {
  facebook: 'bg-blue-50 border-l-4 border-blue-600 dark:bg-blue-950/20',
  instagram: 'bg-pink-50 border-l-4 border-pink-600 dark:bg-pink-950/20',
  twitter: 'bg-cyan-50 border-l-4 border-cyan-500 dark:bg-cyan-950/20',
  linkedin: 'bg-blue-50/70 border-l-4 border-blue-700 dark:bg-blue-950/30'
}

const hours = [
  '8:00 AM',
  '10:00 AM',
  '12:00 PM',
  '2:00 PM',
  '4:00 PM',
  '6:00 PM',
  '8:00 PM',
  '10:00 PM'
]

export function CalendarWeekView({ posts = [], onAddPost, onPostClick, onReschedule }: CalendarWeekViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 11))
  const [draggedPost, setDraggedPost] = useState<ScheduledPost | null>(null)

  const weekStart = useMemo(() => {
    const date = new Date(currentDate)
    const day = date.getDay()
    date.setDate(date.getDate() - day)
    return date
  }, [currentDate])

  const weekDays = useMemo(() => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart)
      date.setDate(date.getDate() + i)
      days.push(date)
    }
    return days
  }, [weekStart])

  const prevWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))
  }

  const nextWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))
  }

  const getPostsForDateTime = (date: Date, hourIndex: number) => {
    const hour = parseInt(hours[hourIndex].split(':')[0])
    return posts.filter((post) => {
      const postDate = new Date(post.scheduledDate)
      return (
        postDate.getFullYear() === date.getFullYear() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getDate() === date.getDate() &&
        postDate.getHours() >= hour &&
        postDate.getHours() < hour + 2
      )
    })
  }

  const isCurrentWeek = useMemo(() => {
    const today = new Date()
    return (
      weekDays[0] <= today &&
      today < new Date(weekDays[6].getTime() + 24 * 60 * 60 * 1000)
    )
  }, [weekDays])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
            Week View
          </h2>
          <p className="text-sm text-muted-foreground">
            {weekDays[0].toLocaleDateString()} - {weekDays[6].toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={prevWeek}>
            <ChevronLeft size={16} />
          </Button>
          {!isCurrentWeek && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
              className="text-xs"
            >
              This Week
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={nextWeek}>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="overflow-x-auto">
        <Card className="p-2">
          {/* Day Headers */}
          <div className="grid gap-1" style={{ gridTemplateColumns: `100px repeat(7, 1fr)` }}>
            <div className="p-2 text-xs font-semibold text-muted-foreground">Time</div>
            {weekDays.map((day) => {
              const isToday =
                day.toDateString() === new Date().toDateString()
              return (
                <div
                  key={day.toDateString()}
                  className={`p-2 text-xs font-semibold text-center rounded-lg ${
                    isToday
                      ? 'bg-violet-100 dark:bg-violet-900 text-violet-900 dark:text-violet-100'
                      : 'text-muted-foreground'
                  }`}
                >
                  <div>{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.getDay()]}</div>
                  <div className="text-xs">{day.getDate()}</div>
                </div>
              )
            })}

            {/* Hour Rows */}
            {hours.map((hour, hourIndex) => (
              <div key={hour} className="contents">
                <div className="p-2 text-xs font-semibold text-muted-foreground flex items-start">
                  {hour}
                </div>
                {weekDays.map((day) => (
                  <div
                    key={`${day.toDateString()}-${hour}`}
                    className="min-h-24 border rounded-lg p-1 bg-muted/30 hover:bg-muted/50 transition-colors"
                    onDragOver={(e) => {
                      e.preventDefault()
                      if (draggedPost) {
                        e.currentTarget.classList.add('ring-2', 'ring-violet-500')
                      }
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove('ring-2', 'ring-violet-500')
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      e.currentTarget.classList.remove('ring-2', 'ring-violet-500')
                      if (draggedPost) {
                        const newDateTime = new Date(day)
                        const hourVal = parseInt(hour.split(':')[0])
                        newDateTime.setHours(hourVal)
                        onReschedule?.(draggedPost, newDateTime)
                        setDraggedPost(null)
                      }
                    }}
                    onClick={() => onAddPost?.(day, hourIndex)}
                  >
                    {/* Posts for this time slot */}
                    <div className="space-y-1">
                      {getPostsForDateTime(day, hourIndex).map((post) => (
                        <div
                          key={post.id}
                          draggable
                          onDragStart={() => setDraggedPost(post)}
                          onDragEnd={() => setDraggedPost(null)}
                          onClick={(e) => {
                            e.stopPropagation()
                            onPostClick?.(post)
                          }}
                          className={`p-1 rounded text-xs cursor-move group transition-all ${
                            platformColors[post.platforms[0] as keyof typeof platformColors] ||
                            'bg-slate-100'
                          } ${draggedPost?.id === post.id ? 'opacity-50 scale-95' : 'hover:shadow-md'}`}
                        >
                          <div className="font-medium line-clamp-2 text-xs mb-0.5">
                            {post.title}
                          </div>
                          <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                            {post.platforms.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Info Text */}
      <div className="text-xs text-muted-foreground text-center">
        Drag posts to reschedule • Click empty slot to add post
      </div>
    </div>
  )
}
