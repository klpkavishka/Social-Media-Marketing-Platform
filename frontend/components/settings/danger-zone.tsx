'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AlertTriangle, Trash2, Download, FileJson } from 'lucide-react'

interface DangerZoneProps {
  onDeleteAccount?: () => void
  onExportData?: () => void
}

export function DangerZone({ onDeleteAccount, onExportData }: DangerZoneProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json')

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE MY ACCOUNT') {
      return
    }

    setIsDeleting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      onDeleteAccount?.()
    } finally {
      setIsDeleting(false)
    }
  }

  const handleExportData = async () => {
    setIsExporting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      const mockData = {
        user: {
          id: 'user_123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@company.com',
          createdAt: '2023-06-15',
        },
        socialAccounts: [
          { platform: 'twitter', handle: '@johndoe', connected: true },
          { platform: 'instagram', handle: 'johndoe', connected: true },
          { platform: 'facebook', handle: 'johndoe', connected: true },
        ],
        posts: [
          { id: 'post_1', title: 'First Post', createdAt: '2025-12-01' },
          { id: 'post_2', title: 'Second Post', createdAt: '2025-12-02' },
        ],
        analytics: [
          { metric: 'followers', value: 1250 },
          { metric: 'engagement', value: 4.2 },
        ],
      }

      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `arcflow-data-export-${timestamp}.${exportFormat}`
      
      let content: string
      if (exportFormat === 'json') {
        content = JSON.stringify(mockData, null, 2)
      } else {
        // Simple CSV conversion
        content = 'Field,Value\n'
        content += `User ID,${mockData.user.id}\n`
        content += `Name,${mockData.user.firstName} ${mockData.user.lastName}\n`
        content += `Email,${mockData.user.email}\n`
        content += `Account Created,${mockData.user.createdAt}\n`
        content += `Social Accounts,${mockData.socialAccounts.length}\n`
        content += `Total Posts,${mockData.posts.length}\n`
      }

      const blob = new Blob([content], { type: exportFormat === 'json' ? 'application/json' : 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      window.URL.revokeObjectURL(url)

      setShowExportDialog(false)
      onExportData?.()
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Export Data */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <Download className="h-5 w-5" />
                Export Your Data
              </CardTitle>
              <CardDescription>
                Download a copy of all your data in JSON or CSV format
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            You can export all your account data, including posts, analytics, and account settings.
            This data will include everything you&apos;ve created and configured in ArcFlow.
          </p>
          <Button
            variant="outline"
            onClick={() => setShowExportDialog(true)}
            className="gap-2"
          >
            <FileJson className="h-4 w-4" />
            Export Data
          </Button>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className="border-destructive bg-destructive/5">
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Account
            </CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 rounded-lg bg-red-50 p-3 border border-red-200">
            <p className="font-medium text-sm text-red-900">This action cannot be undone!</p>
            <ul className="text-sm text-red-800 space-y-1 ml-4 list-disc">
              <li>Your account will be permanently deleted</li>
              <li>All your content will be removed</li>
              <li>Your data cannot be recovered</li>
              <li>Social account connections will be disconnected</li>
              <li>Team members will lose access to shared resources</li>
            </ul>
          </div>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete My Account
          </Button>
        </CardContent>
      </Card>

      {/* Export Data Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Your Data</DialogTitle>
            <DialogDescription>
              Choose the format for your data export
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-3">
              <label className="text-sm font-medium">Export Format</label>
              {[
                { value: 'json', label: 'JSON', description: 'Structured data format' },
                { value: 'csv', label: 'CSV', description: 'Spreadsheet-compatible format' },
              ].map((format) => (
                <div
                  key={format.value}
                  onClick={() => setExportFormat(format.value as 'json' | 'csv')}
                  className={`flex items-center gap-3 rounded-lg border-2 p-3 cursor-pointer transition-all ${
                    exportFormat === format.value
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-muted-foreground'
                  }`}
                >
                  <input
                    type="radio"
                    name="format"
                    value={format.value}
                    checked={exportFormat === format.value}
                    onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv')}
                    className="cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{format.label}</p>
                    <p className="text-xs text-muted-foreground">{format.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-blue-50 p-3 border border-blue-200">
              <p className="text-xs text-blue-900">
                Your data export will include all account information, posts, analytics, and settings.
                The file will be downloaded to your computer.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleExportData} disabled={isExporting}>
              {isExporting ? 'Exporting...' : 'Export Data'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2 rounded-lg bg-red-50 p-3 border border-red-200">
              <p className="font-medium text-sm text-red-900">What will happen:</p>
              <ul className="text-xs text-red-800 space-y-1 ml-4 list-disc">
                <li>Your account will be permanently deleted</li>
                <li>All content and data will be removed</li>
                <li>This cannot be reversed</li>
              </ul>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Type the following to confirm: <span className="text-destructive">DELETE MY ACCOUNT</span>
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Type here..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteConfirmation !== 'DELETE MY ACCOUNT' || isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
