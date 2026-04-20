'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon, Sparkles, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateContent } from '@/lib/hooks/use-content'

export default function NewContentPage() {
  const router = useRouter()
  const createContent = useCreateContent()
  
  const [title, setTitle] = useState('')
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState('')
  const [caption, setCaption] = useState('')
  const [platform, setPlatform] = useState('')
  const [generating, setGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleGenerateCaption = async () => {
    setGenerating(true)
    try {
      // TODO: Call AI service
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setCaption(
        'Excited to share our latest campus update! 🎓 Join us for an amazing semester ahead. #UniversityLife #Education'
      )
      toast.success('Caption generated successfully!')
    } catch (error) {
      toast.error('Failed to generate caption')
    } finally {
      setGenerating(false)
    }
  }

  const validateForm = () => {
    if (!title.trim()) {
      toast.error('Please enter a title')
      return false
    }
    if (!caption.trim()) {
      toast.error('Please enter a caption')
      return false
    }
    if (!platform) {
      toast.error('Please select a platform')
      return false
    }
    return true
  }

  const handleSchedulePost = async () => {
    if (!validateForm()) return

    if (!date || !time) {
      toast.error('Please select a date and time to schedule')
      return
    }

    setIsSubmitting(true)
    try {
      const [hours, minutes] = time.split(':')
      const scheduledDateTime = new Date(date)
      scheduledDateTime.setHours(parseInt(hours), parseInt(minutes))

      const contentData = {
        title,
        body: caption,
        type: 'post' as const,
        status: 'scheduled' as const,
        platforms: [platform],
        scheduledDate: scheduledDateTime.toISOString(),
      }

      console.log('Scheduling post with data:', contentData)
      await createContent.mutateAsync(contentData)
      toast.success('Post scheduled successfully!')
      router.push('/dashboard/content/calendar')
    } catch (error: any) {
      console.error('Error scheduling post:', error)
      
      // Extract meaningful error message
      let errorMessage = 'Failed to schedule post'
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveAsDraft = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const contentData = {
        title,
        body: caption,
        type: 'post' as const,
        status: 'draft' as const,
        platforms: [platform],
      }

      console.log('Saving draft with data:', contentData)
      await createContent.mutateAsync(contentData)
      toast.success('Post saved as draft!')
      router.push('/dashboard/content')
    } catch (error: any) {
      console.error('Error saving draft:', error)
      
      // Extract meaningful error message
      let errorMessage = 'Failed to save draft'
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <p className="text-muted-foreground">Create and schedule content for your social media platforms</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Title</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Enter post title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Caption</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleGenerateCaption}
                disabled={generating}
              >
                <Sparkles className="h-4 w-4" />
                {generating ? 'Generating...' : 'AI Generate'}
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write your caption here..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={6}
              />
              <p className="mt-2 text-xs text-muted-foreground">{caption.length} / 2200 characters</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Platforms</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platforms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Schedule</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Time</Label>
                <Input 
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  onClick={handleSchedulePost}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Scheduling...' : 'Schedule Post'}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleSaveAsDraft}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save as Draft'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
