'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Loader2, Sparkles, Trash2, ExternalLink, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function ContentPage() {
  // Saved Generations Library State
  const [generations, setGenerations] = useState<any[]>([])
  const [isLoadingGenerations, setIsLoadingGenerations] = useState(false)

  const TONE_EMOJIS: Record<string, string> = {
    chill: '🌊',
    fun: '🎉',
    trendy: '⚡',
    emotional: '🎬',
    instagram: '📸',
    professional: '💼',
  }

  const TONE_LABELS: Record<string, string> = {
    chill: 'Chill & Aesthetic',
    fun: 'Fun & Energetic',
    trendy: 'Short & Trendy',
    emotional: 'Emotional',
    instagram: 'Instagram Style',
    professional: 'Professional',
  }

  const fetchGenerations = async () => {
    setIsLoadingGenerations(true)
    try {
      const response = await fetch('/api/hashtags/generations')
      if (response.ok) {
        const data = await response.json()
        setGenerations(data)
      }
    } catch (error) {
      console.error('Error fetching generations:', error)
      toast.error('Failed to load saved generations')
    } finally {
      setIsLoadingGenerations(false)
    }
  }

  useEffect(() => {
    fetchGenerations()
  }, [])

  const handleDeleteGeneration = async (id: string) => {
    try {
      const response = await fetch(`/api/hashtags/generations/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setGenerations((prev) => prev.filter((g) => g._id !== id))
        toast.success('Generation removed from library')
      } else {
        toast.error('Failed to remove generation')
      }
    } catch (error) {
      console.error('Error deleting generation:', error)
      toast.error('Error deleting generation')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-violet-500 animate-pulse" />
            AI Content Library
          </h1>
          <p className="text-muted-foreground">Manage and publish your saved AI generated posts</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchGenerations}
            disabled={isLoadingGenerations}
            className="gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", isLoadingGenerations && "animate-spin")} />
            Refresh
          </Button>
          <Link href="/dashboard">
            <Button className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md">
              <Plus className="h-4 w-4" />
              Generate Content
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {isLoadingGenerations ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
            <p className="text-sm text-muted-foreground">Fetching your beautiful AI creations...</p>
          </div>
        ) : generations.length === 0 ? (
          <Card className="border-dashed border-2 py-16 text-center shadow-none bg-muted/20">
            <CardContent className="space-y-4 pt-6">
              <Sparkles className="h-12 w-12 text-violet-500/40 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Your Content Library is Empty</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Go to the Dashboard, upload an image, generate a high-converting caption, and click &quot;Save Generation&quot; to start building your library!
                </p>
              </div>
              <Link href="/dashboard">
                <Button className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0 shadow-md">
                  <Sparkles className="h-4 w-4" />
                  Generate Content Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {generations.map((gen) => {
              const toneEmoji = TONE_EMOJIS[gen.tone || 'chill'] || '🌊'
              const toneLabel = TONE_LABELS[gen.tone || 'chill'] || 'Chill'
              return (
                <Card key={gen._id} className="overflow-hidden border border-border/85 hover:border-violet-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5 group flex flex-col h-full">
                  {/* Card Cover Photo with Sleek Top Overlays */}
                  <div className="relative aspect-video w-full overflow-hidden bg-muted border-b border-border flex-shrink-0">
                    {gen.imageBase64 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={gen.imageBase64}
                        alt={gen.imageFilename}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground/40 bg-gradient-to-br from-violet-500/5 to-purple-500/5">
                        <Sparkles className="h-10 w-10 text-violet-500/20" />
                      </div>
                    )}
                    
                    {/* Platform & Tone Badges (Left Overlay) */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
                      <Badge className="bg-black/60 backdrop-blur-md text-white border-0 hover:bg-black/70 capitalize font-medium px-2 py-0.5 text-[11px]">
                        {gen.platform}
                      </Badge>
                      {gen.tone && (
                        <Badge className="bg-violet-600/80 backdrop-blur-md text-white border-0 hover:bg-violet-700/80 font-medium px-2 py-0.5 text-[11px]">
                          {toneEmoji} {toneLabel}
                        </Badge>
                      )}
                    </div>

                    {/* Delete Icon Overlay (Right Overlay) */}
                    <button
                      onClick={() => handleDeleteGeneration(gen._id)}
                      className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 hover:bg-red-600/90 text-white backdrop-blur-sm transition-all duration-200 opacity-90 lg:opacity-0 lg:group-hover:opacity-100 shadow-md"
                      title="Delete Generation"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Card Content */}
                  <CardContent className="p-4 flex flex-col justify-between flex-1 min-h-0">
                    <div className="space-y-2 min-h-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground font-medium truncate block max-w-[180px]">
                          📁 {gen.imageFilename}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded">
                          {new Date(gen.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      
                      <p className="text-sm text-foreground leading-relaxed line-clamp-4 select-all font-medium py-1">
                        {gen.finalCaption}
                      </p>

                      {gen.finalHashtags && gen.finalHashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1 overflow-hidden max-h-[50px]">
                          {gen.finalHashtags.map((tag: string, i: number) => (
                            <span key={i} className="text-xs font-semibold text-violet-600 dark:text-violet-400">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Area (Spacious and Focused) */}
                    <div className="pt-3 border-t border-border mt-3 flex-shrink-0">
                      <Link href={`/dashboard/content/new?prefill=${gen._id}`} className="w-full block">
                        <Button
                          className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 shadow gap-1.5 font-semibold text-xs py-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Create Post / Schedule
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
