'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { InviteTeamMemberData, ROLE_DESCRIPTIONS, DEFAULT_PERMISSIONS } from '@/lib/types/team'
import { RoleAccessIndicator } from './role-access-indicator'
import { CheckCircle, AlertCircle } from 'lucide-react'

interface EnhancedInviteFormProps {
  onSubmit: (data: InviteTeamMemberData) => void
  isLoading?: boolean
  successMessage?: string
  errorMessage?: string
}

export function EnhancedInviteForm({
  onSubmit,
  isLoading = false,
  successMessage,
  errorMessage,
}: EnhancedInviteFormProps) {
  const [formData, setFormData] = useState<InviteTeamMemberData>({
    email: '',
    firstName: '',
    lastName: '',
    role: 'creator',
    department: '',
  })
  const [showPermissions, setShowPermissions] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.firstName || !formData.lastName) {
      return
    }

    onSubmit(formData)

    // Reset form
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      role: 'creator',
      department: '',
    })
  }

  const rolePermissions = DEFAULT_PERMISSIONS[formData.role]

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-sm text-green-900">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-sm text-red-900">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Member Information</CardTitle>
            <CardDescription>Enter the team member&apos;s basic information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                An invitation will be sent to this email address
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department (optional)</Label>
              <Input
                id="department"
                placeholder="e.g., Marketing, Communications"
                value={formData.department || ''}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Role Selection Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Role & Permissions</CardTitle>
            <CardDescription>Select a role and review permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Select Role *</Label>
              <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <span>Admin</span>
                      <Badge variant="outline" className="text-xs">Full Access</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="manager">
                    <div className="flex items-center gap-2">
                      <span>Manager</span>
                      <Badge variant="outline" className="text-xs">Manage</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="creator">
                    <div className="flex items-center gap-2">
                      <span>Creator</span>
                      <Badge variant="outline" className="text-xs">Create</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="analyst">
                    <div className="flex items-center gap-2">
                      <span>Analyst</span>
                      <Badge variant="outline" className="text-xs">View</Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {ROLE_DESCRIPTIONS[formData.role as keyof typeof ROLE_DESCRIPTIONS]}
              </p>
            </div>

            {/* Permissions Preview */}
            <div className="p-4 rounded-lg bg-muted/50 border space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Permissions Preview</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPermissions(!showPermissions)}
                  className="text-xs"
                >
                  {showPermissions ? 'Hide' : 'Show'} Details
                </Button>
              </div>

              {!showPermissions ? (
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(rolePermissions)
                    .filter(([_, value]) => value)
                    .map(([key]) => (
                      <Badge key={key} variant="secondary" className="text-xs">
                        {key
                          .replace(/^can/, '')
                          .replace(/([A-Z])/g, ' $1')
                          .trim()}
                      </Badge>
                    ))}
                </div>
              ) : (
                <RoleAccessIndicator role={formData.role as any} permissions={rolePermissions} compact={false} />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between gap-2">
          <Button type="button" variant="outline" disabled={isLoading} onClick={() => setFormData({
            email: '',
            firstName: '',
            lastName: '',
            role: 'creator',
            department: '',
          })}>
            Clear Form
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !formData.email || !formData.firstName || !formData.lastName}
            className="gap-2"
          >
            {isLoading ? 'Sending Invitation...' : 'Send Invitation'}
          </Button>
        </div>
      </form>
    </div>
  )
}
