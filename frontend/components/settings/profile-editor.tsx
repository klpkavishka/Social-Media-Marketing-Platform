'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Mail, Building2, MapPin, Link as LinkIcon, Save, X, Upload } from 'lucide-react'

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  title: string
  organization: string
  location: string
  website: string
  bio: string
  avatar?: string
}

interface ProfileEditorProps {
  initialData?: ProfileData
  onSave?: (data: ProfileData) => void
  onCancel?: () => void
}

export function ProfileEditor({ initialData, onSave, onCancel }: ProfileEditorProps) {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || 'John',
    lastName: initialData?.lastName || 'Doe',
    email: initialData?.email || 'john.doe@company.com',
    title: initialData?.title || 'Marketing Manager',
    organization: initialData?.organization || 'Acme Inc',
    location: initialData?.location || 'San Francisco, CA',
    website: initialData?.website || 'https://johndoe.com',
    bio: initialData?.bio || 'Digital marketing enthusiast',
    avatar: initialData?.avatar,
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      onSave?.(formData)
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const getInitials = () => {
    return `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
          <CardDescription>Upload or change your profile picture</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={formData.avatar} alt={`${formData.firstName} ${formData.lastName}`} />
            <AvatarFallback className="text-lg font-bold">{getInitials()}</AvatarFallback>
          </Avatar>
          {isEditing && (
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Photo
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </div>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">First Name</label>
              <Input
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Name</label>
              <Input
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </label>
            <Input
              type="email"
              value={formData.email}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed here</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Job Title</label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Product Manager"
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Professional Information
          </CardTitle>
          <CardDescription>Your work and professional details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Organization</label>
            <Input
              value={formData.organization}
              onChange={(e) => handleChange('organization', e.target.value)}
              placeholder="Company name"
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </label>
            <Input
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="City, Country"
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Website
            </label>
            <Input
              type="url"
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://yourwebsite.com"
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Bio Section */}
      <Card>
        <CardHeader>
          <CardTitle>About You</CardTitle>
          <CardDescription>Write a short bio about yourself</CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            value={formData.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            disabled={!isEditing}
            placeholder="Tell us about yourself..."
            className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIsEditing(false)
              onCancel?.()
            }}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}
