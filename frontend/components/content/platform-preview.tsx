'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Instagram, Facebook, Twitter, Linkedin } from 'lucide-react'

interface PlatformPreviewProps {
  content: string
  platform?: string
}

export function PlatformPreview({ content, platform = 'instagram' }: PlatformPreviewProps) {
  const previewContent = content.substring(0, 150) || 'Your content preview will appear here...'

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="text-sm font-semibold mb-4">Preview</h3>
      <Tabs defaultValue={platform} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="instagram" className="gap-1">
            <Instagram className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">IG</span>
          </TabsTrigger>
          <TabsTrigger value="facebook" className="gap-1">
            <Facebook className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">FB</span>
          </TabsTrigger>
          <TabsTrigger value="twitter" className="gap-1">
            <Twitter className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">X</span>
          </TabsTrigger>
          <TabsTrigger value="linkedin" className="gap-1">
            <Linkedin className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">LI</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="instagram" className="space-y-3">
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 aspect-square flex items-center justify-center">
            <div className="text-center">
              <p className="text-xs font-medium text-muted-foreground">Instagram</p>
              <p className="text-xs mt-2 text-foreground line-clamp-3">{previewContent}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Max 2,200 characters</p>
        </TabsContent>

        <TabsContent value="facebook" className="space-y-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 aspect-square flex items-center justify-center">
            <div className="text-center">
              <p className="text-xs font-medium text-muted-foreground">Facebook</p>
              <p className="text-xs mt-2 text-foreground line-clamp-3">{previewContent}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Max 63,206 characters</p>
        </TabsContent>

        <TabsContent value="twitter" className="space-y-3">
          <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-4 min-h-20 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xs font-medium text-muted-foreground">X (Twitter)</p>
              <p className="text-xs mt-2 text-foreground line-clamp-2">{previewContent}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Max 280 characters</p>
        </TabsContent>

        <TabsContent value="linkedin" className="space-y-3">
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-4 aspect-square flex items-center justify-center">
            <div className="text-center">
              <p className="text-xs font-medium text-muted-foreground">LinkedIn</p>
              <p className="text-xs mt-2 text-foreground line-clamp-3">{previewContent}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Max 3,000 characters</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
