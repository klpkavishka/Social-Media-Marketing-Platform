'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bell, Mail, MessageSquare, TrendingUp, Users, Clock, Save } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface NotificationSetting {
  id: string
  label: string
  description: string
  icon: LucideIcon
  enabled: boolean
  frequency: 'instant' | 'daily' | 'weekly' | 'monthly' | 'never'
}

interface NotificationPreferencesProps {
  onSave?: (preferences: NotificationSetting[]) => void
}

const defaultSettings: NotificationSetting[] = [
  {
    id: 'post-published',
    label: 'Post Published',
    description: 'When your scheduled posts go live',
    icon: TrendingUp,
    enabled: true,
    frequency: 'instant',
  },
  {
    id: 'comments-mentions',
    label: 'Comments & Mentions',
    description: 'When someone comments or mentions you',
    icon: MessageSquare,
    enabled: true,
    frequency: 'instant',
  },
  {
    id: 'team-activity',
    label: 'Team Activity',
    description: 'Updates on team member activity',
    icon: Users,
    enabled: true,
    frequency: 'daily',
  },
  {
    id: 'performance-digest',
    label: 'Performance Digest',
    description: 'Weekly/monthly performance summaries',
    icon: TrendingUp,
    enabled: true,
    frequency: 'weekly',
  },
  {
    id: 'account-alerts',
    label: 'Account Alerts',
    description: 'Important account and security alerts',
    icon: Bell,
    enabled: true,
    frequency: 'instant',
  },
  {
    id: 'new-features',
    label: 'New Features',
    description: 'Announcements about new features',
    icon: MessageSquare,
    enabled: false,
    frequency: 'weekly',
  },
]

const frequencyOptions = [
  { value: 'instant', label: 'Instant', badge: 'Real-time' },
  { value: 'daily', label: 'Daily', badge: 'Once per day' },
  { value: 'weekly', label: 'Weekly', badge: 'Once per week' },
  { value: 'monthly', label: 'Monthly', badge: 'Once per month' },
  { value: 'never', label: 'Never', badge: 'Disabled' },
]

export function NotificationPreferences({ onSave }: NotificationPreferencesProps) {
  const [settings, setSettings] = useState<NotificationSetting[]>(defaultSettings)
  const [isSaving, setIsSaving] = useState(false)

  const updateSetting = (id: string, updates: Partial<NotificationSetting>) => {
    setSettings((prev) =>
      prev.map((setting) => (setting.id === id ? { ...setting, ...updates } : setting))
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      onSave?.(settings)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>Manage what notifications you receive via email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.id} className="flex items-start justify-between border-b pb-4 last:border-0">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <setting.icon className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{setting.label}</p>
                  <Badge
                    variant="outline"
                    className="text-xs"
                  >
                    {frequencyOptions.find((f) => f.value === setting.frequency)?.badge}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{setting.description}</p>
              </div>

              {/* Controls */}
              <div className="ml-4 flex flex-col gap-2">
                {/* Toggle */}
                <button
                  onClick={() => updateSetting(setting.id, { enabled: !setting.enabled })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    setting.enabled ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      setting.enabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>

                {/* Frequency Dropdown */}
                {setting.enabled && (
                  <select
                    value={setting.frequency}
                    onChange={(e) =>
                      updateSetting(setting.id, { frequency: e.target.value as 'instant' | 'daily' | 'weekly' | 'monthly' | 'never' })
                    }
                    className="text-xs rounded border border-input bg-background px-2 py-1 hover:bg-accent"
                  >
                    {frequencyOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
          <CardDescription>Choose how you want to be notified</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              label: 'Browser Notifications',
              description: 'Receive notifications in your browser',
              enabled: true,
            },
            {
              label: 'Desktop Notifications',
              description: 'Show notifications even when browser is closed',
              enabled: false,
            },
            {
              label: 'Sound Notifications',
              description: 'Play a sound when you receive a notification',
              enabled: true,
            },
          ].map((channel) => (
            <div key={channel.label} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{channel.label}</p>
                <p className="text-sm text-muted-foreground">{channel.description}</p>
              </div>
              <button
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  channel.enabled ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    channel.enabled ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Quiet Hours
          </CardTitle>
          <CardDescription>Disable notifications during specific hours</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Start Time</label>
              <input type="time" defaultValue="18:00" className="w-full rounded border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">End Time</label>
              <input type="time" defaultValue="08:00" className="w-full rounded border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">No notifications between 6:00 PM and 8:00 AM</p>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-primary">
              <span className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform translate-x-5" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button onClick={handleSave} disabled={isSaving} size="lg" className="gap-2">
        <Save className="h-4 w-4" />
        {isSaving ? 'Saving Preferences...' : 'Save Preferences'}
      </Button>
    </div>
  )
}
