'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Facebook, Instagram, Linkedin, Twitter, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react'

interface CalendarQuickAddModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate?: Date
  onAdd?: (post: {
    title: string
    preview: string
    platforms: ('facebook' | 'instagram' | 'twitter' | 'linkedin')[]
    scheduledDate: Date
    generationId?: string
  }) => void
}

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function CalendarQuickAddModal({
  open,
  onOpenChange,
  selectedDate = new Date(),
  onAdd
}: CalendarQuickAddModalProps) {
  const [title, setTitle] = useState('')
  const [preview, setPreview] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<'facebook' | 'instagram' | 'twitter' | 'linkedin'>>(
    new Set(['instagram', 'facebook'])
  )
  const [scheduleType, setScheduleType] = useState<'now' | 'schedule'>('schedule')
  const [scheduledDate, setScheduledDate] = useState(
    formatLocalDate(selectedDate)
  )
  const [scheduledTime, setScheduledTime] = useState('12:00')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Generations State
  const [generations, setGenerations] = useState<any[]>([])
  const [isLoadingGenerations, setIsLoadingGenerations] = useState(false)
  const [selectedGenerationId, setSelectedGenerationId] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      // Reset date when opened with new date
      setScheduledDate(formatLocalDate(selectedDate))
      
      // Fetch generations
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
      fetchGenerations()
    } else {
      // Reset form when closed
      setTitle('')
      setPreview('')
      setSelectedPlatforms(new Set(['instagram', 'facebook']))
      setScheduleType('schedule')
      setScheduledTime('12:00')
      setSelectedGenerationId(null)
    }
  }, [open, selectedDate])

  const handleSelectGeneration = (gen: any) => {
    if (selectedGenerationId === gen._id) {
      setSelectedGenerationId(null)
      setPreview('')
    } else {
      setSelectedGenerationId(gen._id)
      if (gen.finalCaption) {
        setPreview(gen.finalCaption)
      }
      if (!title) {
        setTitle(`Post for ${gen.imageFilename || 'Image'}`)
      }
    }
  }

  const platforms: Array<'facebook' | 'instagram' | 'twitter' | 'linkedin'> = [
    'facebook',
    'instagram',
    'twitter',
    'linkedin'
  ]

  const platformIcons = {
    facebook: { icon: Facebook, color: 'text-blue-600' },
    instagram: { icon: Instagram, color: 'text-pink-600' },
    twitter: { icon: Twitter, color: 'text-cyan-500' },
    linkedin: { icon: Linkedin, color: 'text-blue-700' }
  }

  const togglePlatform = (platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin') => {
    const newSelected = new Set(selectedPlatforms)
    if (newSelected.has(platform)) {
      newSelected.delete(platform)
    } else {
      newSelected.add(platform)
    }
    setSelectedPlatforms(newSelected)
  }

  const handleSubmit = async () => {
    if (!title.trim() || selectedPlatforms.size === 0) {
      return
    }

    setIsSubmitting(true)
    try {
      const [hours, minutes] = scheduledTime.split(':').map(Number)
      const [year, month, day] = scheduledDate.split('-').map(Number)
      const postDate = new Date(year, month - 1, day, hours, minutes)

      onAdd?.({
        title: title.trim(),
        preview: preview.trim(),
        platforms: Array.from(selectedPlatforms),
        scheduledDate: postDate,
        generationId: selectedGenerationId || undefined
      })

      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      onOpenChange(newOpen)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            Quick Add Post
          </DialogTitle>
          <DialogDescription className="sr-only">
            Quickly add a scheduled social media post by entering the title, caption, platforms, and date.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Library Selector */}
          <div className="space-y-3">
            <Label className="font-semibold flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-violet-500" />
              Attach from AI Library (Optional)
            </Label>
            
            {isLoadingGenerations ? (
              <div className="flex items-center justify-center p-4 border rounded-lg bg-muted/20">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : generations.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {generations.map((gen) => (
                  <button
                    key={gen._id}
                    onClick={() => handleSelectGeneration(gen)}
                    className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all group ${
                      selectedGenerationId === gen._id
                        ? 'border-violet-500 ring-2 ring-violet-500/20 shadow-md scale-105'
                        : 'border-transparent hover:border-violet-300'
                    }`}
                  >
                    {gen.imageBase64 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={gen.imageBase64} alt="Library" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-muted-foreground/30" />
                      </div>
                    )}
                    
                    {selectedGenerationId === gen._id && (
                      <div className="absolute inset-0 bg-violet-500/20 flex items-center justify-center">
                        <div className="bg-violet-600 text-white rounded-full p-1 shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground p-3 border rounded-lg bg-muted/20">
                No saved generations found. You can still create a text post.
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="font-semibold">
              Post Title
            </Label>
            <Input
              id="title"
              placeholder="Enter post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-slate-300 dark:border-slate-600"
            />
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label htmlFor="preview" className="font-semibold">
              Caption
            </Label>
            <Textarea
              id="preview"
              placeholder="Enter post content or preview..."
              value={preview}
              onChange={(e) => setPreview(e.target.value)}
              rows={3}
              className="border-slate-300 dark:border-slate-600"
            />
          </div>

          {/* Platform Selection */}
          <div className="space-y-3">
            <Label className="font-semibold">Select Platforms</Label>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map((platform) => {
                const Icon = platformIcons[platform].icon
                const isSelected = selectedPlatforms.has(platform)
                return (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-950'
                        : 'border-slate-200 dark:border-slate-700 bg-muted/30'
                    }`}
                  >
                    <Icon size={18} className={platformIcons[platform].color} />
                    <span className="text-sm font-medium capitalize">{platform}</span>
                    {isSelected && (
                      <span className="ml-auto text-violet-600 font-bold">✓</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="border-slate-300 dark:border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="border-slate-300 dark:border-slate-600"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || selectedPlatforms.size === 0 || isSubmitting}
            className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700"
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule Post'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
