'use client'

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
} from 'lucide-react'
import { SocialAccount, AccountMetrics } from '@/lib/types/social'
import { formatNumber } from '@/lib/utils/format'

interface SocialAccountCardProps {
  account: SocialAccount
  metrics?: AccountMetrics
  onReconnect?: (accountId: string) => void
  onManage?: (accountId: string) => void
  onDisconnect?: (accountId: string) => void
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
}: SocialAccountCardProps) {
  const Icon = platformIcons[account.platform]
  const colorClass = platformColors[account.platform]

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

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 ${colorClass}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold capitalize">{account.platform}</h3>
                {account.connected && getStatusBadge()}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">{account.username}</span>
                {account.lastSync && (
                  <>
                    <span>•</span>
                    <span>Updated {account.lastSync}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {account.status === 'warning' && (
              <Button size="sm" variant="outline" onClick={() => onReconnect?.(account.id)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reconnect
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => onManage?.(account.id)}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Account Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              Followers
            </div>
            <p className="text-xl font-semibold">{formatNumber(account.followers)}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <FileText className="h-3 w-3" />
              Posts
            </div>
            <p className="text-xl font-semibold">{formatNumber(account.posts)}</p>
          </div>
          {metrics && (
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                Engagement
              </div>
              <p className="text-xl font-semibold">{formatNumber(metrics.engagement)}</p>
            </div>
          )}
        </div>

        {/* Performance Metrics */}
        {metrics && (
          <div className="space-y-3 rounded-lg bg-muted/50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Engagement Rate</span>
              <span className="font-semibold">{metrics.engagementRate.toFixed(2)}%</span>
            </div>
            <Progress value={metrics.engagementRate} className="h-2" />
            
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

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <a href={account.profileUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Profile
            </a>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-destructive hover:text-destructive"
            onClick={() => onDisconnect?.(account.id)}
          >
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
