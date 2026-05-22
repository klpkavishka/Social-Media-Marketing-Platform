'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'

interface ScheduledPost {
  id: string
  title: string
  platforms: ('facebook' | 'instagram' | 'twitter' | 'linkedin')[]
  status: 'scheduled' | 'draft' | 'published' | 'in-review'
  scheduledDate: Date
  engagement?: number
  reach?: number
  preview?: string
  media?: Record<string, any>
  imageBase64?: string
}

interface CalendarDayViewProps {
  posts?: ScheduledPost[]
  currentDate: Date
  onAddPost?: (date: Date) => void
  onPostClick?: (post: ScheduledPost) => void
  onReschedule?: (post: ScheduledPost, newDateTime: Date) => void
}

const platformColors = {
  facebook: 'bg-blue-100 border-l-4 border-blue-600 dark:bg-blue-950/30',
  instagram: 'bg-pink-100 border-l-4 border-pink-600 dark:bg-pink-950/30',
  twitter: 'bg-cyan-100 border-l-4 border-cyan-500 dark:bg-cyan-950/30',
  linkedin: 'bg-blue-100/70 border-l-4 border-blue-700 dark:bg-blue-950/40'
}

const platformBadgeColors = {
  facebook: 'bg-blue-50 text-blue-700',
  instagram: 'bg-pink-50 text-pink-700',
  twitter: 'bg-cyan-50 text-cyan-700',
  linkedin: 'bg-blue-50 text-blue-700'
}

export function CalendarDayView({ posts = [], currentDate, onAddPost, onPostClick, onReschedule }: CalendarDayViewProps) {
  const [draggedPost, setDraggedPost] = useState<ScheduledPost | null>(null)

  const getPostsForHour = (hour: number) => {
    return posts.filter((post) => {
      const postDate = new Date(post.scheduledDate)
      return (
        postDate.getFullYear() === currentDate.getFullYear() &&
        postDate.getMonth() === currentDate.getMonth() &&
        postDate.getDate() === currentDate.getDate() &&
        postDate.getHours() === hour
      )
    })
  }

  const dayPostsCount = posts.filter((post) => {
    const postDate = new Date(post.scheduledDate)
    return (
      postDate.getFullYear() === currentDate.getFullYear() &&
      postDate.getMonth() === currentDate.getMonth() &&
      postDate.getDate() === currentDate.getDate()
    )
  }).length

  const isToday = currentDate.toDateString() === new Date().toDateString()

  return (
    <div className="space-y-4">
      {/* Day Timeline */}
      <div className="space-y-2">
        {Array.from({ length: 24 }, (_, i) => i).map((hour) => {
          const timeLabel = new Date(2026, 0, 1, hour).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })
          const hourPosts = getPostsForHour(hour)

          return (
            <div key={hour} className="flex gap-4 group">
              {/* Time Label */}
              <div className="w-20 pt-2 text-xs font-semibold text-muted-foreground text-right sticky left-0">
                {timeLabel}
              </div>

              {/* Time Slot */}
              <div
                className="flex-1 min-h-20 rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer relative"
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
                    const newDateTime = new Date(currentDate)
                    newDateTime.setHours(hour, 0, 0, 0)
                    onReschedule?.(draggedPost, newDateTime)
                    setDraggedPost(null)
                  }
                }}
                onClick={() => {
                  const clickDate = new Date(currentDate)
                  clickDate.setHours(hour, 0, 0, 0)
                  onAddPost?.(clickDate)
                }}
              >
                {/* Posts in this hour */}
                <div className="space-y-2">
                  {hourPosts.map((post) => (
                    <Card
                      key={post.id}
                      draggable
                      onDragStart={() => setDraggedPost(post)}
                      onDragEnd={() => setDraggedPost(null)}
                      onClick={(e) => {
                        e.stopPropagation()
                        onPostClick?.(post)
                      }}
                      className={`p-3 cursor-move transition-all ${
                        platformColors[post.platforms[0] as keyof typeof platformColors] ||
                        'bg-slate-100'
                      } ${draggedPost?.id === post.id ? 'opacity-50 scale-95' : 'hover:shadow-md'}`}
                    >
                      <div className="flex gap-4 items-start">
                        {post.imageBase64 && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={post.imageBase64}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded border border-slate-200 dark:border-slate-700 flex-shrink-0 shadow-sm"
                          />
                        )}
                        <div className="flex-1 space-y-2">
                          {/* Title and Status */}
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-sm flex-1">{post.title}</h4>
                            <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 whitespace-nowrap">
                              {post.status === 'in-review' ? 'In Review' : post.status}
                            </span>
                          </div>

                          {/* Preview */}
                          {post.preview && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{post.preview}</p>
                          )}

                          {/* Platforms */}
                          <div className="flex flex-wrap gap-1">
                            {post.platforms.map((platform) => (
                              <span
                                key={platform}
                                className={`text-xs px-2 py-1 rounded-full ${
                                  platformBadgeColors[platform as keyof typeof platformBadgeColors] ||
                                  'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                              </span>
                            ))}
                          </div>

                          {/* Metrics */}
                          {post.engagement !== undefined && (
                            <div className="flex gap-4 text-xs text-muted-foreground pt-2 border-t">
                              <div>❤️ {post.engagement} likes</div>
                              <div>📈 {post.reach}K reach</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Add Post Button (visible on hover) */}
                {hourPosts.length === 0 && (
                  <button
                    type="button"
                    title="Add post"
                    aria-label="Add post"
                    className="opacity-0 group-hover:opacity-100 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full bg-violet-500 text-white hover:bg-violet-600 transition-all shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      const clickDate = new Date(currentDate)
                      clickDate.setHours(hour, 0, 0, 0)
                      onAddPost?.(clickDate)
                    }}
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Info Text */}
      <div className="text-xs text-muted-foreground text-center mt-6">
        Drag posts to reschedule • Click hour to add post
      </div>
    </div>
  )
}

