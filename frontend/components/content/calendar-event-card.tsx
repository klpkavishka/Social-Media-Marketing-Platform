'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MoreVertical, Edit, Trash, Eye } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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

interface CalendarEventCardProps {
  content: Content
  onView: (content: Content) => void
  onEdit: (content: Content) => void
  onDelete: (id: string) => void
}

const statusColors = {
  draft: 'bg-gray-500',
  scheduled: 'bg-blue-500',
  published: 'bg-green-500',
  failed: 'bg-red-500',
}

const platformIcons: Record<string, string> = {
  facebook: '📘',
  twitter: '🐦',
  instagram: '📸',
  linkedin: '💼',
  tiktok: '🎵',
}

export function CalendarEventCard({
  content,
  onView,
  onEdit,
  onDelete,
}: CalendarEventCardProps) {
  const scheduledTime = content.scheduledDate
    ? new Date(content.scheduledDate).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })
    : ''

  return (
    <Card
      className={cn(
        'group relative mb-1 cursor-pointer overflow-hidden border-l-4 p-2 transition-all hover:shadow-md',
        statusColors[content.status]
      )}
      onClick={() => onView(content)}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xs font-semibold">{scheduledTime}</span>
            <div className="flex gap-0.5">
              {content.platforms?.map((platform) => (
                <span key={platform} className="text-xs">
                  {platformIcons[platform.toLowerCase()] || '📱'}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs line-clamp-2 text-muted-foreground">
            {content.body || content.title}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
            >
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation()
              onView(content)
            }}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation()
              onEdit(content)
            }}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(content.id)
              }}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Badge
        variant="secondary"
        className="absolute bottom-1 right-1 text-[10px] px-1 py-0 h-4"
      >
        {content.status}
      </Badge>
    </Card>
  )
}
