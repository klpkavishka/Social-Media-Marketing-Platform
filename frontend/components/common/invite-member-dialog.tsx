'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { InviteTeamMemberData, ROLE_DESCRIPTIONS, DEFAULT_PERMISSIONS } from '@/lib/types/team'
import { Mail, Loader2 } from 'lucide-react'

interface InviteMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onInvite: (data: InviteTeamMemberData) => Promise<void>
}

export function InviteMemberDialog({ open, onOpenChange, onInvite }: InviteMemberDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<InviteTeamMemberData>({
    email: '',
    firstName: '',
    lastName: '',
    role: 'creator',
    department: '',
  })
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [customPermissions, setCustomPermissions] = useState(DEFAULT_PERMISSIONS.creator)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const inviteData = {
        ...formData,
        permissions: showAdvanced ? customPermissions : undefined,
      }
      await onInvite(inviteData)
      
      // Reset form
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        role: 'creator',
        department: '',
      })
      setShowAdvanced(false)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to invite member:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = (role: string) => {
    const validRole = role as 'admin' | 'manager' | 'creator' | 'analyst'
    setFormData({ ...formData, role: validRole })
    if (!showAdvanced) {
      setCustomPermissions(DEFAULT_PERMISSIONS[role] || DEFAULT_PERMISSIONS.creator)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to a new team member. They will receive an email with instructions to join.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@university.edu"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">
                Role <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="creator">Creator</SelectItem>
                  <SelectItem value="analyst">Analyst</SelectItem>
                </SelectContent>
              </Select>
              {formData.role && (
                <p className="text-xs text-muted-foreground">
                  {ROLE_DESCRIPTIONS[formData.role]}
                </p>
              )}
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department">Department (Optional)</Label>
              <Input
                id="department"
                placeholder="e.g., Marketing, Communications"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>

            {/* Advanced Permissions */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="advanced"
                  checked={showAdvanced}
                  onCheckedChange={(checked) => setShowAdvanced(checked as boolean)}
                />
                <Label htmlFor="advanced" className="cursor-pointer">
                  Customize permissions
                </Label>
              </div>

              {showAdvanced && (
                <div className="space-y-3 pl-6 border-l-2">
                  <PermissionCheckbox
                    id="canCreateContent"
                    label="Create Content"
                    checked={customPermissions.canCreateContent}
                    onChange={(checked) =>
                      setCustomPermissions({ ...customPermissions, canCreateContent: checked })
                    }
                  />
                  <PermissionCheckbox
                    id="canPublishContent"
                    label="Publish Content"
                    checked={customPermissions.canPublishContent}
                    onChange={(checked) =>
                      setCustomPermissions({ ...customPermissions, canPublishContent: checked })
                    }
                  />
                  <PermissionCheckbox
                    id="canManageCampaigns"
                    label="Manage Campaigns"
                    checked={customPermissions.canManageCampaigns}
                    onChange={(checked) =>
                      setCustomPermissions({ ...customPermissions, canManageCampaigns: checked })
                    }
                  />
                  <PermissionCheckbox
                    id="canViewAnalytics"
                    label="View Analytics"
                    checked={customPermissions.canViewAnalytics}
                    onChange={(checked) =>
                      setCustomPermissions({ ...customPermissions, canViewAnalytics: checked })
                    }
                  />
                  <PermissionCheckbox
                    id="canManageTeam"
                    label="Manage Team"
                    checked={customPermissions.canManageTeam}
                    onChange={(checked) =>
                      setCustomPermissions({ ...customPermissions, canManageTeam: checked })
                    }
                  />
                  <PermissionCheckbox
                    id="canManageSettings"
                    label="Manage Settings"
                    checked={customPermissions.canManageSettings}
                    onChange={(checked) =>
                      setCustomPermissions({ ...customPermissions, canManageSettings: checked })
                    }
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function PermissionCheckbox({
  id,
  label,
  checked,
  onChange,
}: {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={id} checked={checked} onCheckedChange={(checked) => onChange(checked as boolean)} />
      <Label htmlFor={id} className="text-sm font-normal cursor-pointer">
        {label}
      </Label>
    </div>
  )
}
