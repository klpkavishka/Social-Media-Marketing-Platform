'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Calendar as CalendarIcon, Loader2, Plus, X } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { useCreateCampaign } from '@/lib/hooks/use-campaigns'
import { CreateCampaignDto, SocialPlatform, TargetAudience } from '@/lib/api/campaigns'

const PLATFORMS: { value: SocialPlatform; label: string }[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'twitter', label: 'Twitter' },
]

export default function NewCampaignPage() {
  const router = useRouter()
  const createCampaign = useCreateCampaign()

  const [formData, setFormData] = useState<Partial<CreateCampaignDto>>({
    name: '',
    description: '',
    status: 'draft',
    budget: 0,
    goals: [],
    platforms: [],
    targetAudience: {},
  })

  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [newGoal, setNewGoal] = useState('')
  const [locationsText, setLocationsText] = useState('')
  const [interestsText, setInterestsText] = useState('')
  const [languagesText, setLanguagesText] = useState('')

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setFormData({
        ...formData,
        goals: [...(formData.goals || []), newGoal.trim()],
      })
      setNewGoal('')
    }
  }

  const handleRemoveGoal = (index: number) => {
    setFormData({
      ...formData,
      goals: formData.goals?.filter((_, i) => i !== index) || [],
    })
  }

  const handlePlatformToggle = (platform: SocialPlatform) => {
    const currentPlatforms = formData.platforms || []
    const newPlatforms = currentPlatforms.includes(platform)
      ? currentPlatforms.filter((p) => p !== platform)
      : [...currentPlatforms, platform]
    setFormData({ ...formData, platforms: newPlatforms })
  }

  const handleAudienceChange = (key: keyof TargetAudience, value: string[] | { min?: number; max?: number }) => {
    setFormData({
      ...formData,
      targetAudience: {
        ...formData.targetAudience,
        [key]: value,
      },
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const campaignData: CreateCampaignDto = {
      ...formData,
      name: formData.name || '',
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      targetAudience: {
        ...formData.targetAudience,
        locations: locationsText.split(',').map((s) => s.trim()).filter(Boolean),
        interests: interestsText.split(',').map((s) => s.trim()).filter(Boolean),
        languages: languagesText.split(',').map((s) => s.trim()).filter(Boolean),
      },
    }

    createCampaign.mutate(campaignData, {
      onSuccess: () => {
        router.push('/dashboard/campaigns')
      },
    })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/campaigns">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Campaign</h1>
          <p className="text-muted-foreground">
            Set up a new marketing campaign to track performance
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details of your campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Fall 2026 Enrollment Drive"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the goals and strategy of this campaign..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'draft' | 'active' | 'paused' | 'completed') =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Goals */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Goals</CardTitle>
              <CardDescription>
                Define specific goals for this campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Goals</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Increase enrollment by 20%"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddGoal()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddGoal} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {formData.goals && formData.goals.length > 0 && (
                <div className="space-y-2">
                  {formData.goals.map((goal, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span>{goal}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveGoal(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Platform Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Selection</CardTitle>
              <CardDescription>
                Choose the social media platforms for this campaign
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {PLATFORMS.map((platform) => (
                  <div key={platform.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform.value}
                      checked={formData.platforms?.includes(platform.value)}
                      onCheckedChange={() => handlePlatformToggle(platform.value)}
                    />
                    <Label
                      htmlFor={platform.value}
                      className="cursor-pointer font-normal"
                    >
                      {platform.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Target Audience */}
          <Card>
            <CardHeader>
              <CardTitle>Target Audience</CardTitle>
              <CardDescription>
                Define your target audience demographics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Minimum Age</Label>
                  <Input
                    type="number"
                    min="13"
                    max="100"
                    placeholder="18"
                    value={formData.targetAudience?.ageRange?.min || ''}
                    onChange={(e) =>
                      handleAudienceChange('ageRange', {
                        ...formData.targetAudience?.ageRange,
                        min: parseInt(e.target.value) || undefined,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Age</Label>
                  <Input
                    type="number"
                    min="13"
                    max="100"
                    placeholder="65"
                    value={formData.targetAudience?.ageRange?.max || ''}
                    onChange={(e) =>
                      handleAudienceChange('ageRange', {
                        ...formData.targetAudience?.ageRange,
                        max: parseInt(e.target.value) || undefined,
                      })
                    }
                      />
                </div>

                <div className="space-y-2">
                  <Label>Locations (comma-separated)</Label>
                  <Input
                    type="text"
                    placeholder="e.g., United States, Canada, UK"
                    value={locationsText}
                    onChange={(e) => setLocationsText(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Interests (comma-separated)</Label>
                <Input
                  type="text"
                  placeholder="e.g., Education, Career Development, Technology"
                  value={interestsText}
                  onChange={(e) => setInterestsText(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Languages (comma-separated)</Label>
                <Input
                  type="text"
                  placeholder="e.g., English, Spanish, French"
                  value={languagesText}
                  onChange={(e) => setLanguagesText(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Schedule & Budget */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule & Budget</CardTitle>
              <CardDescription>
                Set the timeline and budget for your campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !startDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? (
                          format(startDate, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !endDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? (
                          format(endDate, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        disabled={(date) =>
                          startDate ? date < startDate : false
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.budget || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      budget: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Link href="/dashboard/campaigns">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={createCampaign.isPending}>
              {createCampaign.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Campaign
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
