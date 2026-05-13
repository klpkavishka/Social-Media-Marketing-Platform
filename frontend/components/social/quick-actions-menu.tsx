'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { FileText, MessageSquare, ImageIcon, Link as LinkIcon, ArrowUpRight } from 'lucide-react'

interface QuickActionsMenuProps {
  accountId: string
  platform: string
  onPostText?: (accountId: string, postType: string) => void
  onPostImage?: (accountId: string, postType: string) => void
  onPostLink?: (accountId: string, postType: string) => void
  onPostCarousel?: (accountId: string, postType: string) => void
  disabled?: boolean
}

export function QuickActionsMenu({
  accountId,
  platform,
  onPostText,
  onPostImage,
  onPostLink,
  onPostCarousel,
  disabled = false,
}: QuickActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={disabled}
        >
          <ArrowUpRight className="h-4 w-4" />
          Quick Post
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onPostText?.(accountId, 'text')} className="cursor-pointer">
          <FileText className="mr-2 h-4 w-4 text-violet-600" />
          <span>Post Text</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onPostImage?.(accountId, 'image')} className="cursor-pointer">
          <ImageIcon className="mr-2 h-4 w-4 text-pink-600" />
          <span>Post Image</span>
        </DropdownMenuItem>

        {/* Carousel option - common on Instagram, Facebook */}
        {['instagram', 'facebook'].includes(platform) && (
          <DropdownMenuItem onClick={() => onPostCarousel?.(accountId, 'carousel')} className="cursor-pointer">
            <div className="mr-2 h-4 w-4 flex items-center justify-center text-blue-600">
              <div className="grid grid-cols-2 gap-0.5 text-[6px]">
                <div className="w-1 h-1 bg-blue-600" />
                <div className="w-1 h-1 bg-blue-600" />
                <div className="w-1 h-1 bg-blue-600" />
                <div className="w-1 h-1 bg-blue-600" />
              </div>
            </div>
            <span>Post Carousel</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={() => onPostLink?.(accountId, 'link')} className="cursor-pointer">
          <LinkIcon className="mr-2 h-4 w-4 text-cyan-600" />
          <span>Post with Link</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-muted-foreground text-xs">
          <MessageSquare className="mr-2 h-4 w-4" />
          <span>Draft a post</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
