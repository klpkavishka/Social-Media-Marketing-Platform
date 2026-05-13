'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RichTextEditor } from '@/components/content/rich-text-editor'
import { PlatformPreview } from '@/components/content/platform-preview'
import { CharacterCounter } from '@/components/content/character-counter'
import { ContentTemplates } from '@/components/content/content-templates'
import { MediaLibrary } from '@/components/content/media-library'
import { PlatformOptions } from '@/components/content/platform-options'
import { SchedulingPanel } from '@/components/content/scheduling-panel'
import { AIAssistantPanel } from '@/components/content/ai-assistant-panel'
import { Send, Save } from 'lucide-react'

export default function ContentCreationPage() {
  const [content, setContent] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('instagram')
  const [selectedPlatforms, setSelectedPlatforms] = useState(['instagram', 'facebook'])
  const [title, setTitle] = useState('')

  const handleTemplateSelect = (template: string) => {
    setContent(template)
  }

  const handleApplySuggestion = (suggestion: string) => {
    // In a real app, this would call an AI API
    setContent((prev) => prev + `\n\n[AI: ${suggestion}]`)
  }

  const handlePlatformChange = (platforms: string[]) => {
    setSelectedPlatforms(platforms)
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
              <Button variant="outline" className="gap-2">
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Save Draft</span>
              </Button>
              <Button
                disabled={!content || selectedPlatforms.length === 0}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
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
            <PlatformPreview content={content} platform={selectedPlatform} />

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
