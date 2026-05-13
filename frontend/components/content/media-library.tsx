'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Image as ImageIcon, Play, Plus } from 'lucide-react'

interface MediaItem {
  id: string
  type: 'image' | 'video'
  title: string
  thumbnail: string
  size?: string
  uploadedAt: string
}

interface MediaLibraryProps {
  onSelectMedia?: (media: MediaItem) => void
}

export function MediaLibrary({ onSelectMedia }: MediaLibraryProps) {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null)

  const mediaItems: MediaItem[] = [
    {
      id: '1',
      type: 'image',
      title: 'Summer Campaign',
      thumbnail: 'bg-gradient-to-br from-orange-400 to-yellow-400',
      uploadedAt: '2 days ago',
    },
    {
      id: '2',
      type: 'image',
      title: 'Product Launch',
      thumbnail: 'bg-gradient-to-br from-blue-400 to-cyan-400',
      uploadedAt: '1 week ago',
    },
    {
      id: '3',
      type: 'video',
      title: 'Demo Video',
      thumbnail: 'bg-gradient-to-br from-purple-400 to-pink-400',
      uploadedAt: '3 days ago',
    },
    {
      id: '4',
      type: 'image',
      title: 'Team Photo',
      thumbnail: 'bg-gradient-to-br from-green-400 to-emerald-400',
      uploadedAt: '5 days ago',
    },
    {
      id: '5',
      type: 'image',
      title: 'Brand Assets',
      thumbnail: 'bg-gradient-to-br from-violet-400 to-indigo-400',
      uploadedAt: '1 week ago',
    },
    {
      id: '6',
      type: 'video',
      title: 'Testimonial Video',
      thumbnail: 'bg-gradient-to-br from-rose-400 to-red-400',
      uploadedAt: '2 weeks ago',
    },
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Media Library</h3>
        <Button
          size="sm"
          variant="outline"
          className="gap-2 h-8"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Upload</span>
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto">
        {mediaItems.map((media) => (
          <button
            key={media.id}
            onClick={() => {
              setSelectedMedia(media.id)
              onSelectMedia?.(media)
            }}
            className={`aspect-square rounded-lg overflow-hidden relative group transition-all ${
              selectedMedia === media.id ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className={`w-full h-full ${media.thumbnail} flex items-center justify-center`}>
              {media.type === 'video' && (
                <Play className="h-6 w-6 text-white fill-white opacity-70 group-hover:opacity-100 transition-opacity" />
              )}
              {media.type === 'image' && (
                <ImageIcon className="h-6 w-6 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
              )}
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-xs text-white font-medium text-center px-1 line-clamp-2">{media.title}</p>
            </div>

            {/* Uploaded date */}
            <div className="absolute bottom-0 right-0 bg-black/60 text-white px-2 py-1 text-xs rounded-tl">
              {media.uploadedAt}
            </div>
          </button>
        ))}
      </div>

      {selectedMedia && (
        <div className="p-2 bg-accent/50 rounded-lg text-xs">
          <p className="text-muted-foreground">
            Selected: <span className="font-medium">{mediaItems.find(m => m.id === selectedMedia)?.title}</span>
          </p>
        </div>
      )}
    </div>
  )
}
