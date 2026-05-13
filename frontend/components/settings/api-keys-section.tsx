'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Copy, Eye, EyeOff, Trash2, Plus, Calendar, CheckCircle, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface APIKey {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsed: string
  status: 'active' | 'inactive' | 'revoked'
  permissions: string[]
}

const mockKeys: APIKey[] = [
  {
    id: '1',
    name: 'Production API Key',
    key: '••••••••••••••••••••••••••••••••',
    createdAt: '2025-06-15',
    lastUsed: '2025-12-20',
    status: 'active',
    permissions: ['read', 'write', 'delete'],
  },
  {
    id: '2',
    name: 'Development API Key',
    key: '••••••••••••••••••••••••••••••••',
    createdAt: '2025-11-20',
    lastUsed: '2025-12-19',
    status: 'active',
    permissions: ['read', 'write'],
  },
  {
    id: '3',
    name: 'Legacy API Key',
    key: '••••••••••••••••••••••••••••••••',
    createdAt: '2024-06-15',
    lastUsed: '2025-06-15',
    status: 'inactive',
    permissions: ['read'],
  },
]

interface APIKeysSectionProps {
  onDelete?: (id: string) => void
}

export function APIKeysSection({ onDelete }: APIKeysSectionProps) {
  const [keys, setKeys] = useState<APIKey[]>(mockKeys)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [showDialog, setShowDialog] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set(['read', 'write'])
  )
  const [isCreating, setIsCreating] = useState(false)

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key)
  }

  const handleCreateKey = async () => {
    setIsCreating(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      const newKey: APIKey = {
        id: `key-${Date.now()}`,
        name: newKeyName,
        key: `sk_live_${Math.random().toString(36).substring(2, 35)}`,
        createdAt: new Date().toISOString().split('T')[0],
        lastUsed: 'Never',
        status: 'active',
        permissions: Array.from(selectedPermissions),
      }
      setKeys([newKey, ...keys])
      setNewKeyName('')
      setSelectedPermissions(new Set(['read', 'write']))
      setShowDialog(false)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteKey = (id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id))
    onDelete?.(id)
  }

  const handleRevokeKey = (id: string) => {
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: 'revoked' as const } : k))
    )
  }

  return (
    <div className="space-y-6">
      {/* Create API Key Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
            <DialogDescription>
              Generate a new API key for your application
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Key Name</label>
              <Input
                placeholder="e.g., Mobile App Key"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Permissions</label>
              <div className="space-y-2">
                {['read', 'write', 'delete'].map((perm) => (
                  <div key={perm} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={perm}
                      checked={selectedPermissions.has(perm)}
                      onChange={(e) => {
                        const next = new Set(selectedPermissions)
                        if (e.target.checked) {
                          next.add(perm)
                        } else {
                          next.delete(perm)
                        }
                        setSelectedPermissions(next)
                      }}
                      className="rounded border-input"
                    />
                    <label htmlFor={perm} className="text-sm capitalize cursor-pointer">
                      {perm}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateKey} disabled={!newKeyName || isCreating}>
              {isCreating ? 'Creating...' : 'Create Key'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">API Keys</h3>
          <p className="text-sm text-muted-foreground">
            Manage your API keys for programmatic access
          </p>
        </div>
        <Button onClick={() => setShowDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Key
        </Button>
      </div>

      {/* API Keys List */}
      <div className="space-y-3">
        {keys.map((key) => (
          <Card key={key.id}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{key.name}</p>
                      <Badge
                        variant={
                          key.status === 'active'
                            ? 'default'
                            : key.status === 'inactive'
                              ? 'secondary'
                              : 'destructive'
                        }
                        className="text-xs"
                      >
                        {key.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Created on {key.createdAt}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {key.status === 'active' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeKey(key.id)}
                      >
                        Revoke
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteKey(key.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Key Display */}
                <div className="flex items-center gap-2 bg-muted rounded p-3">
                  <code className="flex-1 text-sm font-mono">
                    {visibleKeys.has(key.id)
                      ? key.key
                      : key.key.substring(0, 7) + '...' + key.key.substring(key.key.length - 7)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleKeyVisibility(key.id)}
                  >
                    {visibleKeys.has(key.id) ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(key.key)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                {/* Metadata Row */}
                <div className="grid gap-4 sm:grid-cols-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Last Used</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {key.lastUsed}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Permissions</p>
                    <div className="flex gap-1 mt-1">
                      {key.permissions.map((perm) => (
                        <Badge key={perm} variant="outline" className="text-xs capitalize">
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium flex items-center gap-1 mt-1">
                      {key.status === 'active' ? (
                        <>
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span className="text-green-600">Active</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 text-yellow-600" />
                          <span className="text-yellow-600">{key.status}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6 flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium">Security Notice</p>
            <p>
              Keep your API keys confidential. If you believe a key has been compromised, revoke it
              immediately and create a new one.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
