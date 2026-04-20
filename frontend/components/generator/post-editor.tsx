'use client'

import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import type { SocialPlatform } from '@/lib/api/campaigns'

interface PostEditorProps {
  caption: string
  hashtags: string[]
  onCaptionChange: (caption: string) => void
  platform: SocialPlatform
  isGenerating?: boolean
}

const PLATFORM_LIMITS: Record<SocialPlatform, { chars: number; hashtags: number }> = {
  instagram: { chars: 2200, hashtags: 30 },
  facebook: { chars: 63206, hashtags: 20 },
  twitter: { chars: 280, hashtags: 10 },
  linkedin: { chars: 3000, hashtags: 20 },
  youtube: { chars: 5000, hashtags: 30 },
  tiktok: { chars: 2200, hashtags: 30 },
}

export function PostEditor({
  caption,
  hashtags,
  onCaptionChange,
  platform,
  isGenerating,
}: PostEditorProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const limits = PLATFORM_LIMITS[platform]
  const captionLength = caption.length
  const percentUsed = (captionLength / limits.chars) * 100
  const isOverLimit = captionLength > limits.chars

  const copyToClipboard = (text: string, index?: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index ?? -1)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const copyAllContent = () => {
    const allContent = [caption, ...hashtags].filter(Boolean).join('\n')
    copyToClipboard(allContent)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
          <div>
            <CardTitle>Caption</CardTitle>
            <CardDescription>Edit AI-generated caption for {platform}</CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={copyAllContent}
            disabled={!caption}
            className="gap-2"
          >
            {copiedIndex === -1 ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy All
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={caption}
            onChange={(e) => onCaptionChange(e.target.value)}
            placeholder="Your caption will appear here..."
            rows={6}
            disabled={isGenerating}
            className="resize-none"
          />
          <div className="flex items-center justify-between text-xs">
            <div className="flex-1 space-y-1">
              <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                {/* eslint-disable-next-line react/style-prop-object */}
                <div
                  className={`h-full transition-all ${isOverLimit ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(percentUsed, 100)}%` }}
                />
              </div>
            </div>
            <span className={`ml-3 font-medium ${isOverLimit ? 'text-red-500' : 'text-muted-foreground'}`}>
              {captionLength} / {limits.chars}
            </span>
          </div>
          {isOverLimit && <p className="text-xs text-red-500">Caption exceeds {platform} character limit</p>}
        </CardContent>
      </Card>

      {hashtags.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Hashtags ({hashtags.length} of {limits.hashtags})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => copyToClipboard(tag, idx)}
                >
                  {tag}
                  {copiedIndex === idx && <Check className="ml-1 h-3 w-3" />}
                </Badge>
              ))}
            </div>
            {hashtags.length > limits.hashtags && (
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                {platform} allows max {limits.hashtags} hashtags. Remove {hashtags.length - limits.hashtags} to comply.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
