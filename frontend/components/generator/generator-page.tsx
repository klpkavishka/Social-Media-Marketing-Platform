'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Sparkles, ArrowRight, Wand2, RefreshCw, Check, Brain } from 'lucide-react'
import { PlatformSelector, ImageUploader, PostEditor, PostPreview } from '@/components/generator'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { SocialPlatform } from '@/lib/api/campaigns'

// ── Tone Options ──────────────────────────────────────────────────────
const TONES = [
  { id: 'chill', label: 'Chill & Aesthetic', emoji: '🌊', color: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20 hover:bg-cyan-500/20 dark:text-cyan-300' },
  { id: 'fun', label: 'Fun & Energetic', emoji: '🎉', color: 'bg-amber-500/10 text-amber-700 border-amber-500/20 hover:bg-amber-500/20 dark:text-amber-300' },
  { id: 'trendy', label: 'Short & Trendy', emoji: '⚡', color: 'bg-violet-500/10 text-violet-700 border-violet-500/20 hover:bg-violet-500/20 dark:text-violet-300' },
  { id: 'emotional', label: 'Emotional', emoji: '🎬', color: 'bg-rose-500/10 text-rose-700 border-rose-500/20 hover:bg-rose-500/20 dark:text-rose-300' },
  { id: 'instagram', label: 'Instagram Style', emoji: '📸', color: 'bg-pink-500/10 text-pink-700 border-pink-500/20 hover:bg-pink-500/20 dark:text-pink-300' },
  { id: 'professional', label: 'Professional', emoji: '💼', color: 'bg-slate-500/10 text-slate-700 border-slate-500/20 hover:bg-slate-500/20 dark:text-slate-300' },
] as const

interface GeneratorPageProps {
  userName?: string
  userHandle?: string
  userAvatar?: string
}

export function GeneratorPage({ userName, userHandle, userAvatar }: GeneratorPageProps) {
  // State management
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('instagram')
  const [selectedImage, setSelectedImage] = useState<{ file: File; preview: string } | null>(null)
  const [caption, setCaption] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // Stage 1 results
  const [mlCategory, setMlCategory] = useState('')
  const [stage1Done, setStage1Done] = useState(false)

  // Stage 2 state (AI Enhancement)
  const [selectedTone, setSelectedTone] = useState('chill')
  const [enhancedCaption, setEnhancedCaption] = useState('')
  const [enhancedHashtags, setEnhancedHashtags] = useState<string[]>([])
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [stage2Done, setStage2Done] = useState(false)

  // Handle image selection
  const handleImageSelect = (file: File | null, preview: string) => {
    if (!file) {
      setSelectedImage(null)
      setCaption('')
      setHashtags([])
      setMlCategory('')
      setStage1Done(false)
      setStage2Done(false)
      setEnhancedCaption('')
      setEnhancedHashtags([])
      return
    }

    setSelectedImage({ file, preview })
    setStage1Done(false)
    setStage2Done(false)
    setEnhancedCaption('')
    setEnhancedHashtags([])
    toast.success('Image uploaded')
  }

  // ── Stage 1: ML Model Prediction ─────────────────────────────────
  const handleGenerate = async () => {
    if (!selectedImage) {
      toast.error('Please upload an image first')
      return
    }

    setIsGenerating(true)
    setStage1Done(false)
    setStage2Done(false)
    setEnhancedCaption('')
    setEnhancedHashtags([])

    try {
      const form = new FormData()
      form.append('image', selectedImage.file)
      
      const response = await fetch('/api/hashtags/predict', {
        method: 'POST',
        body: form,
      })

      if (!response.ok) {
        throw new Error('Failed to generate hashtags')
      }

      const data = await response.json()

      setCaption(data.caption || `Check out this amazing content! 📸 ${data.category}`)
      setHashtags(data.hashtags || [])
      setMlCategory(data.category || '')
      setStage1Done(true)
      toast.success('Caption and hashtags generated successfully!')
    } catch (error) {
      console.error('Generation error:', error)
      toast.error('Failed to generate caption and hashtags. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  // ── Stage 2: AI Enhanced Caption ─────────────────────────────────
  const handleEnhance = async () => {
    if (!selectedImage || !stage1Done) {
      toast.error('Please generate hashtags first')
      return
    }

    setIsEnhancing(true)
    setStage2Done(false)

    try {
      const form = new FormData()
      form.append('image', selectedImage.file)
      form.append('tone', selectedTone)
      form.append('hashtags', hashtags.join(', '))
      form.append('category', mlCategory)

      const response = await fetch('/api/hashtags/generate-caption', {
        method: 'POST',
        body: form,
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to enhance caption')
      }

      const data = await response.json()

      setEnhancedCaption(data.caption || '')
      if (data.hashtags && data.hashtags.length > 0) {
        setEnhancedHashtags(data.hashtags)
      }

      setStage2Done(true)
      toast.success(`${TONES.find(t => t.id === selectedTone)?.emoji} Enhanced caption generated!`)
    } catch (error: any) {
      console.error('Enhancement error:', error)
      toast.error(error.message || 'Failed to enhance caption')
    } finally {
      setIsEnhancing(false)
    }
  }

  // Apply enhanced caption
  const handleUseEnhancedCaption = () => {
    setCaption(enhancedCaption)
    if (enhancedHashtags.length > 0) {
      setHashtags(enhancedHashtags)
    }
    toast.success('Enhanced caption applied!')
  }

  const canGenerate = selectedImage && !isGenerating

  return (
    <div className="space-y-6">
      {/* Main Layout: Two Columns */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* LEFT COLUMN: INPUT */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Content Generator</h2>
            <p className="text-sm text-muted-foreground">Create and optimize content for social media</p>
          </div>

          {/* 1. Platform Selector */}
          <Card className="p-4">
            <PlatformSelector selectedPlatform={selectedPlatform} onPlatformChange={setSelectedPlatform} />
          </Card>

          {/* 2. Image Upload */}
          <ImageUploader onImageSelect={handleImageSelect} selectedImage={selectedImage || undefined} />

          {/* 3. Generate Button (Stage 1) */}
          <Button
            onClick={handleGenerate}
            disabled={!canGenerate}
            size="lg"
            className="w-full gap-2"
            variant={canGenerate ? 'default' : 'secondary'}
          >
            <Sparkles className="h-5 w-5" />
            {isGenerating ? 'Generating...' : 'Generate Caption & Hashtags'}
            {!isGenerating && canGenerate && <ArrowRight className="h-5 w-5" />}
          </Button>

          {/* ═══ STAGE 2: AI Caption Enhancement ═══ */}
          {stage1Done && (
            <Card className="overflow-hidden border-violet-500/20 shadow-lg shadow-violet-500/5">
              <div className="border-b border-violet-500/10 bg-gradient-to-r from-violet-500/5 to-purple-500/5 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-violet-500" />
                  <h3 className="font-semibold">AI Caption Enhancement</h3>
                  {stage2Done && <Check className="h-4 w-4 text-emerald-500" />}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Select a tone and generate a polished, social-media-ready caption
                </p>
              </div>

              <div className="space-y-4 p-4">
                {/* Tone Selector Grid */}
                <div className="space-y-2">
                  <Label className="text-xs uppercase text-muted-foreground">Select Tone</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {TONES.map((tone) => (
                      <button
                        key={tone.id}
                        onClick={() => {
                          setSelectedTone(tone.id)
                          setStage2Done(false)
                        }}
                        className={cn(
                          'flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all duration-200',
                          selectedTone === tone.id
                            ? `${tone.color} ring-2 ring-offset-1 ring-current`
                            : 'border-border bg-background hover:bg-accent'
                        )}
                      >
                        <span className="text-base">{tone.emoji}</span>
                        <span className="truncate">{tone.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Enhance Button */}
                <Button
                  onClick={handleEnhance}
                  disabled={isEnhancing}
                  className="w-full gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700"
                >
                  {isEnhancing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Generating enhanced caption...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      {stage2Done ? 'Regenerate with this tone' : '✨ Enhance with AI'}
                    </>
                  )}
                </Button>

                {/* Enhanced Result */}
                {stage2Done && enhancedCaption && (
                  <div className="space-y-3 rounded-lg border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-purple-500/5 p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{TONES.find(t => t.id === selectedTone)?.emoji}</span>
                      <Label className="text-xs uppercase text-violet-600 dark:text-violet-400">
                        {TONES.find(t => t.id === selectedTone)?.label} Caption
                      </Label>
                    </div>
                    <p className="whitespace-pre-line text-sm leading-relaxed">{enhancedCaption}</p>

                    {enhancedHashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {enhancedHashtags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs bg-violet-500/10 text-violet-700 dark:text-violet-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Button
                      onClick={handleUseEnhancedCaption}
                      size="sm"
                      className="w-full gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Use This Caption
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* RIGHT COLUMN: OUTPUT */}
        <div className="space-y-4">
          {caption ? (
            <>
              {/* Caption Editor & Hashtags */}
              <PostEditor
                caption={caption}
                hashtags={hashtags}
                onCaptionChange={setCaption}
                platform={selectedPlatform}
                isGenerating={isGenerating}
              />

              {/* Live Preview */}
              <PostPreview
                caption={caption}
                hashtags={hashtags}
                platform={selectedPlatform}
                imagePreview={selectedImage?.preview}
                userName={userName}
                userHandle={userHandle}
                userAvatar={userAvatar}
              />
            </>
          ) : (
            <Card className="flex min-h-96 items-center justify-center">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900">
                    <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                  </div>
                </div>
                <p className="font-medium">Ready to create?</p>
                <p className="text-sm text-muted-foreground">
                  Upload an image and click &quot;Generate&quot; to get started
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
