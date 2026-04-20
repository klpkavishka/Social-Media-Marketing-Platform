'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Calendar, Clock, Edit, Trash, ExternalLink } from 'lucide-react'

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

interface ContentDetailSheetProps {
  content: Content | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: () => void
  onDelete: () => void
}

const statusColors = {
  draft: 'bg-gray-500',
  scheduled: 'bg-blue-500',
  published: 'bg-green-500',
  failed: 'bg-red-500',
}

const platformNames: Record<string, string> = {
  facebook: 'Facebook',
  twitter: 'Twitter',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
}

export function ContentDetailSheet({
  content,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: ContentDetailSheetProps) {
  if (!content) return null

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Content Details</SheetTitle>
          <SheetDescription>
            View and manage your scheduled content
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <Badge className={statusColors[content.status]}>
              {content.status.toUpperCase()}
            </Badge>
            <Badge variant="outline">{content.type.toUpperCase()}</Badge>
          </div>

          {/* Media Preview */}
          {content.media && Object.keys(content.media).length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Media</h3>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">
                  Media attached (preview not available)
                </p>
              </Card>
            </div>
          )}

          {/* Title */}
          {content.title && (
            <div className="space-y-2">
              <h3 className="font-semibold">Title</h3>
              <p className="text-sm">{content.title}</p>
            </div>
          )}

          {/* Body/Caption */}
          <div className="space-y-2">
            <h3 className="font-semibold">Content</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {content.body}
            </p>
          </div>

          {/* Platforms */}
          <div className="space-y-2">
            <h3 className="font-semibold">Platforms</h3>
            <div className="flex flex-wrap gap-2">
              {content.platforms?.map((platform) => (
                <Badge key={platform} variant="outline">
                  {platformNames[platform.toLowerCase()] || platform}
                </Badge>
              ))}
            </div>
          </div>

          {/* Schedule Information */}
          <div className="space-y-3 rounded-lg border p-4">
            {content.scheduledDate && (
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Scheduled for</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(content.scheduledDate)}
                  </p>
                </div>
              </div>
            )}

            {content.publishedDate && (
              <div className="flex items-start gap-3">
                <ExternalLink className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Published on</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(content.publishedDate)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(content.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button onClick={onEdit} className="flex-1">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button onClick={onDelete} variant="destructive" className="flex-1">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
