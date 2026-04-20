'use client'

import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageCircle, Share2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { SocialPlatform } from '@/lib/api/campaigns'

interface PostPreviewProps {
  caption: string
  hashtags: string[]
  platform: SocialPlatform
  imagePreview?: string
  userName?: string
  userHandle?: string
  userAvatar?: string
}

const PLATFORM_CONFIGS: Record<
  SocialPlatform,
  { name: string; color: string; icon: string; maxCaption: number }
> = {
  instagram: {
    name: 'Instagram',
    color: 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500',
    icon: '📷',
    maxCaption: 2200,
  },
  facebook: { name: 'Facebook', color: 'bg-blue-600', icon: 'f', maxCaption: 63206 },
  twitter: { name: '𝕏', color: 'bg-black', icon: '𝕏', maxCaption: 280 },
  linkedin: { name: 'LinkedIn', color: 'bg-blue-700', icon: 'in', maxCaption: 3000 },
  youtube: { name: 'YouTube', color: 'bg-red-600', icon: '▶', maxCaption: 5000 },
  tiktok: { name: 'TikTok', color: 'bg-black', icon: '♪', maxCaption: 2200 },
}

export function PostPreview({
  caption,
  hashtags,
  platform,
  imagePreview,
  userName = 'Your Account',
  userHandle = '@yourhandle',
  userAvatar,
}: PostPreviewProps) {
  const config = PLATFORM_CONFIGS[platform]
  const displayCaption = caption.slice(0, config.maxCaption)
  const isTruncated = caption.length > config.maxCaption

  return (
    <Card className="overflow-hidden">
      <CardHeader className={`${config.color} py-3 text-white`}>
        <CardTitle className="text-sm">{config.name} Live Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Platform Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-semibold">{userName}</p>
              <p className="text-xs text-muted-foreground">{userHandle}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {config.name}
          </Badge>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative w-full overflow-hidden bg-gray-100 h-64">
            <Image
              src={imagePreview}
              alt="Post"
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="space-y-3 px-4 py-3">
          {/* Caption Text */}
          {displayCaption && (
            <p className="whitespace-pre-wrap break-words text-sm leading-5">
              {displayCaption}
              {isTruncated && <span className="text-muted-foreground">... (truncated)</span>}
            </p>
          )}

          {/* Hashtags */}
          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {hashtags.map((tag, idx) => (
                <span key={idx} className="text-xs text-blue-500 hover:underline cursor-pointer">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Engagement Footer */}
          <div className="flex items-center justify-between border-t pt-2 text-xs text-muted-foreground">
            {platform === 'twitter' ? (
              <>
                <span>↗️ 12 replies</span>
                <span>♻️ 45 retweets</span>
                <span>♡ 123 likes</span>
              </>
            ) : platform === 'linkedin' ? (
              <>
                <span>👍 89 reactions</span>
                <span>💬 12 comments</span>
              </>
            ) : (
              <>
                <Heart className="h-4 w-4" />
                <MessageCircle className="h-4 w-4" />
                <Share2 className="h-4 w-4" />
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
