'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { Trash2, Mail, Shield, Download, ChevronDown, AlertCircle } from 'lucide-react'

interface TeamBulkActionsProps {
  selectedCount: number
  onSendMessage?: () => void
  onChangeRole?: () => void
  onExport?: () => void
  onDelete?: () => void
  disabled?: boolean
}

export function TeamBulkActions({
  selectedCount,
  onSendMessage,
  onChangeRole,
  onExport,
  onDelete,
  disabled = false,
}: TeamBulkActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (selectedCount === 0) {
    return null
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false)
    onDelete?.()
  }

  return (
    <>
      <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200 sticky bottom-0">
        <Badge variant="secondary" className="text-sm">
          {selectedCount} selected
        </Badge>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          {onSendMessage && (
            <Button
              size="sm"
              variant="outline"
              onClick={onSendMessage}
              disabled={disabled}
              className="gap-2"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Send Message</span>
            </Button>
          )}

          {onChangeRole && (
            <Button
              size="sm"
              variant="outline"
              onClick={onChangeRole}
              disabled={disabled}
              className="gap-2"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Change Role</span>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                disabled={disabled}
                className="gap-1"
              >
                <span className="hidden sm:inline">More</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {onExport && (
                <DropdownMenuItem onClick={onExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Selected
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              {onDelete && (
                <DropdownMenuItem
                  onClick={handleDeleteClick}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Selected
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Remove {selectedCount} team member(s)?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. {selectedCount} member{selectedCount > 1 ? 's' : ''} will be removed from your organization and will lose access to all resources.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm font-medium text-red-900 mb-2">
              They will lose access to:
            </p>
            <ul className="text-sm text-red-800 list-disc list-inside space-y-1">
              <li>All projects and campaigns</li>
              <li>Team collaboration features</li>
              <li>Analytics and reports</li>
              <li>Social account connections</li>
            </ul>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Remove Members
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
