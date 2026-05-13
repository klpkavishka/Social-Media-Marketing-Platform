'use client'

import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

interface DisconnectConfirmationModalProps {
  isOpen: boolean
  accountName: string
  platform: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export function DisconnectConfirmationModal({
  isOpen,
  accountName,
  platform,
  onConfirm,
  onCancel,
  isLoading = false,
}: DisconnectConfirmationModalProps) {
  const [understood, setUnderstood] = useState(false)

  const handleConfirm = () => {
    if (understood) {
      onConfirm()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle>Disconnect Account?</DialogTitle>
          </div>
          <DialogDescription className="pt-4">
            You are about to disconnect <span className="font-semibold text-foreground">{accountName}</span> on{' '}
            <span className="font-semibold text-foreground capitalize">{platform}</span>.
          </DialogDescription>
        </DialogHeader>

        {/* Warning Content */}
        <div className="space-y-4 py-4">
          <div className="space-y-3 rounded-lg bg-red-50 p-4 border border-red-200">
            <h4 className="font-semibold text-sm text-red-900">What will happen:</h4>
            <ul className="space-y-2 text-sm text-red-800">
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>You will no longer be able to post to this account</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Scheduled posts for this account will be cancelled</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Analytics data will no longer be updated for this account</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>You can reconnect this account later</span>
              </li>
            </ul>
          </div>

          {/* Confirmation Checkbox */}
          <div className="flex items-start gap-3 rounded-lg bg-muted p-3">
            <Checkbox
              id="confirm-disconnect"
              checked={understood}
              onCheckedChange={(checked) => setUnderstood(checked as boolean)}
              className="mt-1"
            />
            <label
              htmlFor="confirm-disconnect"
              className="text-sm font-medium leading-relaxed cursor-pointer"
            >
              I understand the consequences and want to disconnect this account
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="flex gap-2 sm:flex-row-reverse">
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!understood || isLoading}
            className="flex-1"
          >
            {isLoading ? 'Disconnecting...' : 'Disconnect Account'}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Keep Connected
          </Button>
        </DialogFooter>

        {/* Additional Info */}
        <div className="text-xs text-muted-foreground text-center pt-2">
          This action cannot be undone. Please proceed with caution.
        </div>
      </DialogContent>
    </Dialog>
  )
}
