'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Check,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Settings,
  TrendingUp,
  Users,
  FileText,
  Trash2,
} from 'lucide-react'
import { SocialAccount, AccountMetrics } from '@/lib/types/social'
import { formatNumber } from '@/lib/utils/format'
import { ConnectionStatusIndicator } from './connection-status-indicator'
import { AccountLimitsDisplay } from './account-limits-display'
import { QuickActionsMenu } from './quick-actions-menu'
import { DisconnectConfirmationModal } from './disconnect-confirmation-modal'

interface SocialAccountCardProps {
  account: SocialAccount
  metrics?: AccountMetrics
  onReconnect?: (accountId: string) => void
  onManage?: (accountId: string) => void
  onDisconnect?: (accountId: string) => void
  onQuickPost?: (accountId: string, postType: string) => void
}

const platformIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  tiktok: FileText,
}

const platformColors = {
  facebook: 'text-blue-600 bg-blue-50 border-blue-200',
  instagram: 'text-pink-600 bg-pink-50 border-pink-200',
  twitter: 'text-sky-500 bg-sky-50 border-sky-200',
  linkedin: 'text-blue-700 bg-blue-50 border-blue-200',
  youtube: 'text-red-600 bg-red-50 border-red-200',
  tiktok: 'text-gray-900 bg-gray-50 border-gray-200',
}

export function SocialAccountCard({
  account,
  metrics,
  onReconnect,
  onManage,
  onDisconnect,
  onQuickPost,
}: SocialAccountCardProps) {
  const Icon = platformIcons[account.platform]
  const colorClass = platformColors[account.platform]
  const [showDisconnectModal, setShowDisconnectModal] = useState(false)

  const getStatusBadge = () => {
    switch (account.status) {
      case 'active':
        return (
          <Badge variant="default" className="gap-1 bg-green-500">
            <Check className="h-3 w-3" />
            Active
          </Badge>
        )
      case 'warning':
        return (
          <Badge variant="secondary" className="gap-1 bg-yellow-500 text-white">
            <AlertCircle className="h-3 w-3" />
            Needs Attention
          </Badge>
        )
      case 'error':
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Error
          </Badge>
        )
      default:
        return null
    }
  }

  const handleDisconnectClick = () => {
    setShowDisconnectModal(true)
  }

  const handleConfirmDisconnect = () => {
    setShowDisconnectModal(false)
    onDisconnect?.(account.id)
  }

  // Map AccountStatus to ConnectionStatus
  const getConnectionStatus = (): 'active' | 'warning' | 'error' | 'connecting' => {
    switch (account.status) {
      case 'active':
        return 'active'
      case 'warning':
        return 'warning'
      case 'error':
      case 'disconnected':
        return 'error'
      default:
        return 'active'
    }
  }

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader className="pb-3 bg-gradient-to-r from-muted/50 to-transparent">
          <div className="flex items-start justify-between">
            {/* Platform Logo and Info */}
            <div className="flex items-center gap-3 flex-1">
              <div className={`flex h-14 w-14 items-center justify-center rounded-lg border-2 ${colorClass} relative`}>
                <Icon className="h-7 w-7" />
                {/* Connection Dot */}
                <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                  account.status === 'active' ? 'bg-green-500' :
                  account.status === 'warning' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold capitalize">{account.platform}</h3>
                  {account.connected && getStatusBadge()}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium truncate">{account.username}</span>
                  {account.lastSync && (
                    <>
                      <span>•</span>
                      <span className="whitespace-nowrap">{account.lastSync}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-2">
              {account.status === 'warning' && (
                <Button size="sm" variant="outline" onClick={() => onReconnect?.(account.id)}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => onManage?.(account.id)}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {/* Connection Status - Compact */}
          <div>
            <ConnectionStatusIndicator
              status={getConnectionStatus()}
              lastSync={account.lastSync}
              detailed={false}
            />
          </div>

          {/* Account Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1 p-2 rounded-lg bg-muted/50">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                Followers
              </div>
              <p className="text-lg font-semibold">{formatNumber(account.followers)}</p>
            </div>
            <div className="space-y-1 p-2 rounded-lg bg-muted/50">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <FileText className="h-3 w-3" />
                Posts
              </div>
              <p className="text-lg font-semibold">{formatNumber(account.posts)}</p>
            </div>
            {metrics && (
              <div className="space-y-1 p-2 rounded-lg bg-muted/50">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  Engagement
                </div>
                <p className="text-lg font-semibold">{formatNumber(metrics.engagement)}</p>
              </div>
            )}
          </div>

          {/* Account Limits */}
          <AccountLimitsDisplay
            postsRemaining={account.postsRemaining ?? 45}
            postsLimit={account.postsLimit ?? 50}
            resetDate={account.limitResetDate ?? 'May 30, 2026'}
          />

          {/* Performance Metrics */}
          {metrics && (
            <div className="space-y-3 rounded-lg bg-muted/50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Engagement Rate</span>
                <span className="font-semibold">{metrics.engagementRate.toFixed(2)}%</span>
              </div>
              <Progress value={Math.min(metrics.engagementRate * 10, 100)} className="h-2" />
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Reach</p>
                  <p className="text-sm font-semibold">{formatNumber(metrics.reach)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Impressions</p>
                  <p className="text-sm font-semibold">{formatNumber(metrics.impressions)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2">
            <QuickActionsMenu
              accountId={account.id}
              platform={account.platform}
              onPostText={onQuickPost}
              onPostImage={onQuickPost}
              onPostCarousel={onQuickPost}
              onPostLink={onQuickPost}
              disabled={account.status !== 'active'}
            />
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <a href={account.profileUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Profile
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-red-50"
              onClick={handleDisconnectClick}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Disconnect Confirmation Modal */}
      <DisconnectConfirmationModal
        isOpen={showDisconnectModal}
        accountName={account.displayName}
        platform={account.platform}
        onConfirm={handleConfirmDisconnect}
        onCancel={() => setShowDisconnectModal(false)}
      />
    </>
  )
}
