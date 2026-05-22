'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RichTextEditor } from '@/components/content/rich-text-editor'
import { PlatformPreview } from '@/components/content/platform-preview'
import { CharacterCounter } from '@/components/content/character-counter'
import { ContentTemplates } from '@/components/content/content-templates'
import { MediaLibrary } from '@/components/content/media-library'
import { PlatformOptions } from '@/components/content/platform-options'
import { SchedulingPanel } from '@/components/content/scheduling-panel'
import { AIAssistantPanel } from '@/components/content/ai-assistant-panel'
import { Send, Save, Trash2, Sparkles, RefreshCw, Loader2, ArrowUpRight } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useCreateContent } from '@/lib/hooks/use-content'

export default function ContentCreationPage() {
  const router = useRouter()
  const createMutation = useCreateContent()

  const [content, setContent] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('instagram')
  const [selectedPlatforms, setSelectedPlatforms] = useState(['instagram', 'facebook'])
  const [title, setTitle] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

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
    } finally {
      setIsLoadingGenerations(false)
    }
  }

  useEffect(() => {
    fetchGenerations()

    // Check for prefill query param to load a saved AI generation
    const params = new URLSearchParams(window.location.search)
    const prefillId = params.get('prefill')
    if (prefillId) {
      const loadPrefilledGeneration = async () => {
        try {
          const response = await fetch(`/api/hashtags/generations/${prefillId}`)
          if (response.ok) {
            const gen = await response.json()
            const formatted = `${gen.finalCaption}\n\n${(gen.finalHashtags || []).join(' ')}`
            setContent(formatted)
            // Auto-select platform if available
            if (gen.platform) {
              setSelectedPlatform(gen.platform)
            }
            if (gen.imageBase64) {
              setSelectedImage(gen.imageBase64)
            }
            toast.success('Loaded saved AI generation into editor!')
          }
        } catch (error) {
          console.error('Failed to prefill generation:', error)
        }
      }
      loadPrefilledGeneration()
    }
  }, [])

  const handleDeleteGeneration = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const response = await fetch(`/api/hashtags/generations/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setGenerations((prev) => prev.filter((g) => g._id !== id))
        toast.success('Generation deleted from library')
      } else {
        toast.error('Failed to delete generation')
      }
    } catch (error) {
      console.error('Error deleting generation:', error)
      toast.error('Error deleting generation')
    }
  }

  const handleApplyGeneration = (gen: any) => {
    const formatted = `${gen.finalCaption}\n\n${(gen.finalHashtags || []).join(' ')}`
    setContent(formatted)
    if (gen.imageBase64) {
      setSelectedImage(gen.imageBase64)
    } else {
      setSelectedImage(null)
    }
    toast.success('Loaded into editor!')
  }

  const handleTemplateSelect = (template: string) => {
    setContent(template)
  }

  const handleApplySuggestion = (suggestion: string) => {
    setContent((prev) => prev + `\n\n[AI: ${suggestion}]`)
  }

  const handlePlatformChange = (platforms: string[]) => {
    setSelectedPlatforms(platforms)
  }

  const handleCreatePost = async (status: 'draft' | 'scheduled' | 'published') => {
    if (!content) {
      toast.error('Post content cannot be empty')
      return
    }

    try {
      await createMutation.mutateAsync({
        title: title || 'AI Generated Post',
        body: content,
        type: 'post',
        status: status,
        platforms: selectedPlatforms,
        media: selectedImage ? { imageBase64: selectedImage } : undefined,
      })
      router.push('/dashboard/content')
    } catch (err) {
      console.error('Error creating post:', err)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-space-grotesk">Create Content</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Write, schedule, and publish to multiple platforms
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => handleCreatePost('draft')}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span className="hidden sm:inline">Save Draft</span>
              </Button>
              <Button
                disabled={!content || selectedPlatforms.length === 0 || createMutation.isPending}
                className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                onClick={() => handleCreatePost('published')}
              >
                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span className="hidden sm:inline">Publish</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Tools */}
          <div className="lg:col-span-1 space-y-6 order-3 lg:order-1">
            {/* Content Templates */}
            <ContentTemplates onSelectTemplate={handleTemplateSelect} />

            {/* Saved AI Generations */}
            <Card className="overflow-hidden border-violet-500/20 shadow-lg shadow-violet-500/5">
              <div className="border-b border-violet-500/10 bg-gradient-to-r from-violet-500/5 to-purple-500/5 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-violet-500" />
                    <h3 className="font-semibold text-sm">Saved AI Generations</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-violet-500"
                    onClick={fetchGenerations}
                    disabled={isLoadingGenerations}
                  >
                    <RefreshCw className={cn("h-3.5 w-3.5", isLoadingGenerations && "animate-spin")} />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Pick a saved AI generation to load it into the editor
                </p>
              </div>
              <CardContent className="p-3 space-y-3 max-h-[350px] overflow-y-auto">
                {isLoadingGenerations ? (
                  <div className="flex flex-col items-center justify-center py-6 text-muted-foreground text-xs gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
                    <span>Loading saved generations...</span>
                  </div>
                ) : generations.length === 0 ? (
                  <div className="text-center py-8 px-4 border border-dashed rounded-lg">
                    <Sparkles className="h-6 w-6 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-xs font-medium text-muted-foreground">No saved generations yet</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      Generate and save content from the Dashboard tab!
                    </p>
                  </div>
                ) : (
                  generations.map((gen) => {
                    const toneEmoji = TONE_EMOJIS[gen.tone || 'chill'] || '🌊';
                    const toneLabel = TONE_LABELS[gen.tone || 'chill'] || 'Chill';
                    return (
                      <div
                        key={gen._id}
                        onClick={() => handleApplyGeneration(gen)}
                        className="group relative border border-border/60 hover:border-violet-500/40 rounded-lg p-3 bg-card hover:bg-violet-500/5 transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
                      >
                        <div className="flex items-start gap-3 justify-between">
                          {gen.imageBase64 && (
                            <div className="relative h-12 w-12 rounded overflow-hidden border border-border flex-shrink-0 bg-muted">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={gen.imageBase64}
                                alt={gen.imageFilename}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                {gen.platform}
                              </span>
                              {gen.tone && (
                                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-600 dark:text-violet-400">
                                  {toneEmoji} {toneLabel}
                                </span>
                              )}
                            </div>
                            <span className="block text-[11px] font-medium text-muted-foreground truncate mt-0.5">
                              📁 {gen.imageFilename}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                            onClick={(e) => handleDeleteGeneration(gen._id, e)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        <p className="text-xs text-foreground mt-2 line-clamp-2 leading-relaxed">
                          {gen.finalCaption}
                        </p>

                        {gen.finalHashtags && gen.finalHashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {gen.finalHashtags.slice(0, 3).map((tag: string, i: number) => (
                              <span key={i} className="text-[10px] text-violet-500 dark:text-violet-400">
                                {tag}
                              </span>
                            ))}
                            {gen.finalHashtags.length > 3 && (
                              <span className="text-[9px] text-muted-foreground">
                                +{gen.finalHashtags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                        
                        <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 font-medium text-violet-600 dark:text-violet-400">
                          Use <ArrowUpRight className="h-3 w-3" />
                        </div>
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>

            {/* Media Library */}
            <MediaLibrary />

            {/* Platform Options */}
            <PlatformOptions onPlatformChange={handlePlatformChange} />
          </div>

          {/* Middle - Editor */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
            {/* Title Input */}
            <div>
              <label className="text-sm font-medium block mb-2">Post Title (Optional)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your post a title..."
                className="w-full px-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Rich Text Editor */}
            <div>
              <label className="text-sm font-medium block mb-2">Content</label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Write your content here or use a template..."
              />
            </div>

            {/* Character Counter */}
            <CharacterCounter content={content} platform={selectedPlatform} />

            {/* Platform Selector for Preview */}
            <div>
              <label className="text-sm font-medium block mb-2">Select Platform for Preview</label>
              <div className="grid grid-cols-4 gap-2">
                {['instagram', 'facebook', 'twitter', 'linkedin'].map((platform) => (
                  <button
                    key={platform}
                    onClick={() => setSelectedPlatform(platform)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      selectedPlatform === platform
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Preview & Actions */}
          <div className="lg:col-span-1 order-2 lg:order-3 space-y-6">
            {/* Platform Preview */}
            <PlatformPreview content={content} platform={selectedPlatform} mediaImage={selectedImage || undefined} />

            {/* Scheduling Panel */}
            <SchedulingPanel />

            {/* AI Assistant Panel */}
            <AIAssistantPanel content={content} onApplySuggestion={handleApplySuggestion} />
          </div>
        </div>
      </div>
    </div>
  )
}

