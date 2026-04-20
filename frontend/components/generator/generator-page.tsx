'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Sparkles, ArrowRight } from 'lucide-react'
import { PlatformSelector, ImageUploader, PostEditor, PostPreview } from '@/components/generator'
import { toast } from 'sonner'
import type { SocialPlatform } from '@/lib/api/campaigns'

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

  // Handle image selection
  const handleImageSelect = (file: File | null, preview: string) => {
    if (!file) {
      setSelectedImage(null)
      setCaption('')
      setHashtags([])
      return
    }

    setSelectedImage({ file, preview })
    toast.success('Image uploaded')
  }

  // Simulate AI generation
  const handleGenerate = async () => {
    if (!selectedImage) {
      toast.error('Please upload an image first')
      return
    }

    setIsGenerating(true)

    try {
      // Call the actual hashtag model API
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

      // Use AI-generated caption if available, otherwise use a default
      setCaption(data.caption || `Check out this amazing content! 📸 ${data.category}`)
      setHashtags(data.hashtags || [])
      toast.success('Caption and hashtags generated successfully!')
    } catch (error) {
      console.error('Generation error:', error)
      toast.error('Failed to generate caption and hashtags. Please try again.')
    } finally {
      setIsGenerating(false)
    }
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

          {/* 3. Generate Button */}
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
