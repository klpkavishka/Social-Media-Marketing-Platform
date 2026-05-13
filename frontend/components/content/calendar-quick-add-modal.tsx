'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'

interface CalendarQuickAddModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate?: Date
  onAdd?: (post: {
    title: string
    preview: string
    platforms: ('facebook' | 'instagram' | 'twitter' | 'linkedin')[]
    scheduledDate: Date
  }) => void
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
    selectedDate.toISOString().split('T')[0]
  )
  const [scheduledTime, setScheduledTime] = useState('12:00')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      const postDate = new Date(scheduledDate)
      postDate.setHours(hours, minutes)

      onAdd?.({
        title: title.trim(),
        preview: preview.trim(),
        platforms: Array.from(selectedPlatforms),
        scheduledDate: postDate
      })

      // Reset form
      setTitle('')
      setPreview('')
      setSelectedPlatforms(new Set(['instagram', 'facebook']))
      setScheduleType('schedule')
      setScheduledTime('12:00')
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            Quick Add Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
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
              Preview Text
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

          {/* Schedule Type */}
          <div className="space-y-3">
            <Label className="font-semibold">Schedule</Label>
            <div className="flex gap-2">
              <button
                onClick={() => setScheduleType('now')}
                className={`flex-1 p-2 rounded-lg border-2 transition-all text-sm ${
                  scheduleType === 'now'
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-950'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                Publish Now
              </button>
              <button
                onClick={() => setScheduleType('schedule')}
                className={`flex-1 p-2 rounded-lg border-2 transition-all text-sm ${
                  scheduleType === 'schedule'
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-950'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                Schedule
              </button>
            </div>
          </div>

          {/* Date & Time (if scheduled) */}
          {scheduleType === 'schedule' && (
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
          )}
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
            {isSubmitting ? 'Adding...' : 'Add Post'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
