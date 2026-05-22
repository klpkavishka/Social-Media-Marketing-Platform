'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Heart, 
  MessageCircle, 
  Send as SendIcon, 
  Bookmark, 
  MoreHorizontal, 
  MessageSquare, 
  Share2, 
  ThumbsUp, 
  Image as ImageIcon 
} from 'lucide-react'

interface PlatformPreviewProps {
  content: string
  platform?: string
  mediaImage?: string
}

export function PlatformPreview({ content, platform = 'instagram', mediaImage }: PlatformPreviewProps) {
  const previewContent = content || 'Your content preview will appear here...'

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm hover:shadow transition-shadow">
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <span>✨ Live Preview</span>
      </h3>
      
      <Tabs defaultValue={platform} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="instagram" className="gap-1.5 py-2">
            <Instagram className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-xs">IG</span>
          </TabsTrigger>
          <TabsTrigger value="facebook" className="gap-1.5 py-2">
            <Facebook className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-xs">FB</span>
          </TabsTrigger>
          <TabsTrigger value="twitter" className="gap-1.5 py-2">
            <Twitter className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-xs">X</span>
          </TabsTrigger>
          <TabsTrigger value="linkedin" className="gap-1.5 py-2">
            <Linkedin className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-xs">LI</span>
          </TabsTrigger>
        </TabsList>

        {/* ── INSTAGRAM PREVIEW ── */}
        <TabsContent value="instagram" className="space-y-3 mt-0">
          <div className="border border-border/80 rounded-lg overflow-hidden bg-card text-foreground">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[1.5px]">
                  <div className="h-full w-full rounded-full bg-card flex items-center justify-center text-[10px] font-bold">
                    ME
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold">your_brand</p>
                  <p className="text-[9px] text-muted-foreground leading-none">Original Audio</p>
                </div>
              </div>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* Image Cover */}
            <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden border-b border-border/40 relative">
              {mediaImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaImage}
                  alt="Instagram Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
                  <ImageIcon className="h-10 w-10 text-muted-foreground/20" />
                  <span className="text-xs font-medium">Select a saved generation image</span>
                </div>
              )}
            </div>

            {/* Actions & Likes */}
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 hover:text-red-500 cursor-pointer transition-colors" />
                  <MessageCircle className="h-5 w-5 hover:text-foreground cursor-pointer transition-colors" />
                  <SendIcon className="h-5 w-5 hover:text-foreground cursor-pointer transition-colors" />
                </div>
                <Bookmark className="h-5 w-5 hover:text-foreground cursor-pointer transition-colors" />
              </div>
              <p className="text-xs font-semibold">1,248 likes</p>
              
              {/* Caption */}
              <div className="space-y-1">
                <span className="text-xs font-semibold mr-1.5">your_brand</span>
                <span className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">
                  {previewContent}
                </span>
              </div>
              <p className="text-[9px] text-muted-foreground uppercase mt-1 tracking-wider">Just now</p>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">Max 2,200 characters • Max 30 hashtags</p>
        </TabsContent>

        {/* ── FACEBOOK PREVIEW ── */}
        <TabsContent value="facebook" className="space-y-3 mt-0">
          <div className="border border-border/80 rounded-lg overflow-hidden bg-card text-foreground p-3 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  YB
                </div>
                <div>
                  <p className="text-xs font-semibold flex items-center gap-1.5">
                    Your Brand Name
                  </p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 leading-none">
                    Just now · 🌐
                  </p>
                </div>
              </div>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* Caption (above image) */}
            <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">
              {previewContent}
            </p>

            {/* Image */}
            <div className="aspect-video bg-muted rounded border border-border/40 overflow-hidden relative flex items-center justify-center">
              {mediaImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaImage}
                  alt="Facebook Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
                  <ImageIcon className="h-10 w-10 text-muted-foreground/20" />
                  <span className="text-xs font-medium">Select a saved generation image</span>
                </div>
              )}
            </div>

            {/* Like Counter */}
            <div className="flex items-center justify-between text-[11px] text-muted-foreground border-b border-border/40 pb-2">
              <span className="flex items-center gap-1">
                👍❤️ 42
              </span>
              <span>12 comments · 4 shares</span>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between text-muted-foreground text-xs pt-1">
              <button className="flex items-center justify-center gap-1.5 hover:text-blue-600 flex-1 py-1 font-medium transition-colors">
                <ThumbsUp className="h-4 w-4" />
                Like
              </button>
              <button className="flex items-center justify-center gap-1.5 hover:text-foreground flex-1 py-1 font-medium transition-colors">
                <MessageSquare className="h-4 w-4" />
                Comment
              </button>
              <button className="flex items-center justify-center gap-1.5 hover:text-foreground flex-1 py-1 font-medium transition-colors">
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">Max 63,206 characters • Ideal size: 1200 x 630</p>
        </TabsContent>

        {/* ── TWITTER / X PREVIEW ── */}
        <TabsContent value="twitter" className="space-y-3 mt-0">
          <div className="border border-border/80 rounded-lg overflow-hidden bg-card text-foreground p-3 space-y-2">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                  𝕏
                </div>
                <div>
                  <p className="text-xs font-semibold leading-none">Your Brand</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">@yourbrand · Just now</p>
                </div>
              </div>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* Caption */}
            <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">
              {previewContent}
            </p>

            {/* Image */}
            {mediaImage && (
              <div className="aspect-video bg-muted rounded-xl border border-border/40 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaImage}
                  alt="Twitter Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Footer Metrics */}
            <div className="flex items-center justify-between text-muted-foreground text-[11px] pt-2 border-t border-border/20">
              <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                <MessageCircle className="h-3.5 w-3.5" />
                <span>0</span>
              </button>
              <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                <Share2 className="h-3.5 w-3.5" />
                <span>0</span>
              </button>
              <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                <Heart className="h-3.5 w-3.5" />
                <span>0</span>
              </button>
              <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                <Bookmark className="h-3.5 w-3.5" />
                <span>0</span>
              </button>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">Max 280 characters • Standard handles up to 4 photos</p>
        </TabsContent>

        {/* ── LINKEDIN PREVIEW ── */}
        <TabsContent value="linkedin" className="space-y-3 mt-0">
          <div className="border border-border/80 rounded-lg overflow-hidden bg-card text-foreground p-3 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded bg-blue-700 text-white flex items-center justify-center text-xs font-bold font-serif">
                  in
                </div>
                <div>
                  <p className="text-xs font-semibold">Your Brand</p>
                  <p className="text-[9px] text-muted-foreground leading-tight">Social Media Agency</p>
                  <p className="text-[9px] text-muted-foreground leading-none">Just now · 🌐</p>
                </div>
              </div>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* Caption */}
            <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">
              {previewContent}
            </p>

            {/* Image */}
            <div className="aspect-video bg-muted border border-border/40 overflow-hidden relative flex items-center justify-center">
              {mediaImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaImage}
                  alt="LinkedIn Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
                  <ImageIcon className="h-10 w-10 text-muted-foreground/20" />
                  <span className="text-xs font-medium">Select a saved generation image</span>
                </div>
              )}
            </div>

            {/* Metrics */}
            <div className="flex items-center justify-between text-[10px] text-muted-foreground border-b border-border/20 pb-2">
              <span className="flex items-center gap-1">
                👏💡❤️ 12
              </span>
              <span>1 comment</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between text-muted-foreground text-xs pt-1">
              <button className="flex items-center justify-center gap-1.5 hover:text-blue-700 flex-1 py-1 font-semibold transition-colors">
                <ThumbsUp className="h-4 w-4" />
                Like
              </button>
              <button className="flex items-center justify-center gap-1.5 hover:text-foreground flex-1 py-1 font-semibold transition-colors">
                <MessageSquare className="h-4 w-4" />
                Comment
              </button>
              <button className="flex items-center justify-center gap-1.5 hover:text-foreground flex-1 py-1 font-semibold transition-colors">
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">Max 3,000 characters • Ideal for professional networking</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}

