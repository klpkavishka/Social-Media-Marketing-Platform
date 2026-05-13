'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, ChevronDown, Zap } from 'lucide-react'

interface AIAssistantPanelProps {
  content?: string
  onApplySuggestion?: (suggestion: string) => void
}

interface Suggestion {
  id: string
  title: string
  description: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  action: string
}

export function AIAssistantPanel({ content, onApplySuggestion }: AIAssistantPanelProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null)

  const suggestions: Suggestion[] = [
    {
      id: 'tone',
      title: 'Adjust Tone',
      description: 'Make it more professional, casual, or humorous',
      icon: Sparkles,
      action: 'Make this more professional and engaging for B2B audience',
    },
    {
      id: 'shorten',
      title: 'Shorten',
      description: 'Condense for Twitter',
      icon: Zap,
      action: 'Summarize this in 280 characters or less',
    },
    {
      id: 'expand',
      title: 'Expand',
      description: 'Make it longer and more detailed',
      icon: Sparkles,
      action: 'Expand this with more details and context',
    },
    {
      id: 'hashtags',
      title: 'Add Hashtags',
      description: 'Suggest relevant hashtags',
      icon: Zap,
      action: 'Suggest 5-8 relevant hashtags for this content',
    },
    {
      id: 'cta',
      title: 'Add CTA',
      description: 'Suggest call-to-action variations',
      icon: Sparkles,
      action: 'Add a compelling call-to-action to this',
    },
    {
      id: 'emojis',
      title: 'Add Emojis',
      description: 'Enhance with relevant emojis',
      icon: Zap,
      action: 'Add emojis to make this more engaging',
    },
  ]

  const handleApplySuggestion = (suggestion: Suggestion) => {
    onApplySuggestion?.(suggestion.action)
    setSelectedSuggestion(suggestion.id)
  }

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <span className="font-semibold text-sm">AI Assistant</span>
          <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded">
            Beta
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Content */}
      {isOpen && (
        <div className="border-t px-4 py-3 space-y-3">
          {content ? (
            <>
              <p className="text-xs text-muted-foreground mb-3">
                ✨ Suggestions to improve your content
              </p>

              <div className="grid grid-cols-2 gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleApplySuggestion(suggestion)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedSuggestion === suggestion.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-accent/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <suggestion.icon className="h-4 w-4 text-amber-500 flex-shrink-0" />
                      <p className="font-medium text-xs">{suggestion.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                  </button>
                ))}
              </div>

              {selectedSuggestion && (
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg space-y-2">
                  <p className="text-xs font-medium text-amber-900 dark:text-amber-200">
                    AI Suggestion Applied ✓
                  </p>
                  <p className="text-xs text-amber-800 dark:text-amber-300">
                    Your content has been enhanced using AI. Review and make adjustments as needed.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4 space-y-2">
              <Sparkles className="h-6 w-6 text-muted-foreground/50 mx-auto" />
              <p className="text-xs text-muted-foreground">
                Start writing to get AI suggestions
              </p>
            </div>
          )}

          <div className="border-t pt-3 space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 text-xs"
            >
              <Sparkles className="h-4 w-4" />
              Generate with AI
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
            >
              💬 Feedback
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
