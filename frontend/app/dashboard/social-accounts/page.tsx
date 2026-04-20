'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Search, Download } from 'lucide-react'
import { SocialAccountCard } from '@/components/social/social-account-card'
import { ConnectAccountDialog } from '@/components/social/connect-account-dialog'
import { AccountMetricsSummary, RecentActivity } from '@/components/social/account-metrics'
import { SocialAccount, AccountMetrics, SocialPlatform } from '@/lib/types/social'

export default function SocialAccountsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPlatform, setFilterPlatform] = useState<string>('all')

  // Mock data - replace with actual API calls
  const mockAccounts: SocialAccount[] = [
    {
      id: '1',
      platform: 'instagram',
      username: '@university_official',
      displayName: 'University Official',
      profileUrl: 'https://instagram.com/university_official',
      avatarUrl: '/images/instagram-avatar.jpg',
      connected: true,
      status: 'active',
      followers: 45300,
      following: 230,
      posts: 892,
      lastSync: '2 hours ago',
      connectedAt: '2024-01-15',
      universityId: 'univ-1',
    },
    {
      id: '2',
      platform: 'facebook',
      username: '@UniversityPage',
      displayName: 'University Official Page',
      profileUrl: 'https://facebook.com/UniversityPage',
      connected: true,
      status: 'active',
      followers: 32500,
      posts: 654,
      lastSync: '1 hour ago',
      connectedAt: '2024-01-10',
      universityId: 'univ-1',
    },
    {
      id: '3',
      platform: 'twitter',
      username: '@UniOfficial',
      displayName: 'University',
      profileUrl: 'https://twitter.com/UniOfficial',
      connected: true,
      status: 'warning',
      followers: 18200,
      following: 450,
      posts: 1234,
      lastSync: '5 hours ago',
      connectedAt: '2024-01-08',
      universityId: 'univ-1',
    },
    {
      id: '4',
      platform: 'linkedin',
      username: 'university-official',
      displayName: 'University',
      profileUrl: 'https://linkedin.com/company/university-official',
      connected: true,
      status: 'active',
      followers: 12800,
      posts: 345,
      lastSync: '30 minutes ago',
      connectedAt: '2024-02-01',
      universityId: 'univ-1',
    },
  ]

  const mockMetrics: Record<string, AccountMetrics> = {
    '1': {
      accountId: '1',
      platform: 'instagram',
      likes: 12500,
      comments: 890,
      shares: 450,
      impressions: 125000,
      engagement: 13840,
      engagementRate: 4.8,
      reach: 98000,
      profileViews: 5600,
      period: '30d',
    },
    '2': {
      accountId: '2',
      platform: 'facebook',
      likes: 8900,
      comments: 560,
      shares: 320,
      impressions: 98000,
      engagement: 9780,
      engagementRate: 3.2,
      reach: 78000,
      profileViews: 3400,
      period: '30d',
    },
    '3': {
      accountId: '3',
      platform: 'twitter',
      likes: 5600,
      comments: 340,
      shares: 890,
      impressions: 67000,
      engagement: 6830,
      engagementRate: 2.9,
      reach: 45000,
      profileViews: 2100,
      period: '30d',
    },
    '4': {
      accountId: '4',
      platform: 'linkedin',
      likes: 3400,
      comments: 230,
      shares: 180,
      impressions: 45000,
      engagement: 3810,
      engagementRate: 3.8,
      reach: 32000,
      profileViews: 1800,
      period: '30d',
    },
  }

  const recentActivities = [
    {
      id: '1',
      platform: 'Instagram',
      action: 'New post published',
      time: '2 hours ago',
      value: '+245 engagement',
    },
    {
      id: '2',
      platform: 'Facebook',
      action: 'Story expired',
      time: '5 hours ago',
    },
    {
      id: '3',
      platform: 'LinkedIn',
      action: 'Comment received',
      time: '1 day ago',
      value: '+12 interactions',
    },
    {
      id: '4',
      platform: 'Twitter',
      action: 'Account reconnected',
      time: '2 days ago',
    },
    {
      id: '5',
      platform: 'Instagram',
      action: 'Follower milestone reached',
      time: '3 days ago',
      value: '45K followers',
    },
  ]

  // Calculate summary metrics
  const totalFollowers = mockAccounts.reduce((sum, acc) => sum + acc.followers, 0)
  const totalPosts = mockAccounts.reduce((sum, acc) => sum + acc.posts, 0)
  const totalEngagement = Object.values(mockMetrics).reduce((sum, m) => sum + m.engagement, 0)
  const totalReach = Object.values(mockMetrics).reduce((sum, m) => sum + m.reach, 0)
  const avgEngagementRate =
    Object.values(mockMetrics).reduce((sum, m) => sum + m.engagementRate, 0) /
    Object.values(mockMetrics).length

  // Filter accounts
  const filteredAccounts = mockAccounts.filter((account) => {
    const matchesSearch =
      account.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.platform.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || account.status === filterStatus
    const matchesPlatform = filterPlatform === 'all' || account.platform === filterPlatform

    return matchesSearch && matchesStatus && matchesPlatform
  })

  const activeAccounts = mockAccounts.filter((a) => a.status === 'active')
  const warningAccounts = mockAccounts.filter((a) => a.status === 'warning')
  const connectedPlatforms = mockAccounts.map((a) => a.platform)

  const handleConnect = (platform: SocialPlatform) => {
    console.log('Connecting to', platform)
    // Handle OAuth flow or connection logic
  }

  const handleReconnect = (accountId: string) => {
    console.log('Reconnecting account', accountId)
    // Handle reconnection logic
  }

  const handleManage = (accountId: string) => {
    console.log('Managing account', accountId)
    // Navigate to account settings or open management modal
  }

  const handleDisconnect = (accountId: string) => {
    console.log('Disconnecting account', accountId)
    // Handle disconnection logic
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Social Accounts</h1>
          <p className="text-muted-foreground">
            Manage and monitor all your social media accounts in one place
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <ConnectAccountDialog
            onConnect={handleConnect}
            connectedPlatforms={connectedPlatforms}
          />
        </div>
      </div>

      {/* Status Overview */}
      <div className="flex gap-4">
        <Card className="flex-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Connected Accounts</p>
                <p className="text-2xl font-bold">{mockAccounts.length}</p>
              </div>
              <Badge variant="default" className="bg-green-500">
                {activeAccounts.length} Active
              </Badge>
            </div>
          </CardContent>
        </Card>
        {warningAccounts.length > 0 && (
          <Card className="flex-1 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-800">Needs Attention</p>
                  <p className="text-2xl font-bold text-yellow-900">{warningAccounts.length}</p>
                </div>
                <Button size="sm" variant="outline">
                  Review
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Metrics Summary */}
      <AccountMetricsSummary
        totalFollowers={totalFollowers}
        totalPosts={totalPosts}
        totalEngagement={totalEngagement}
        totalReach={totalReach}
        engagementRate={avgEngagementRate}
        followerChange={12}
        engagementChange={25}
        reachChange={18}
      />

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Accounts</TabsTrigger>
            <TabsTrigger value="active">Active ({activeAccounts.length})</TabsTrigger>
            <TabsTrigger value="warning">Needs Attention ({warningAccounts.length})</TabsTrigger>
          </TabsList>
          
          {/* Filters */}
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterPlatform} onValueChange={setFilterPlatform}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {filteredAccounts.map((account) => (
              <SocialAccountCard
                key={account.id}
                account={account}
                metrics={mockMetrics[account.id]}
                onReconnect={handleReconnect}
                onManage={handleManage}
                onDisconnect={handleDisconnect}
              />
            ))}
          </div>
          {filteredAccounts.length === 0 && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <p className="text-lg font-semibold">No accounts found</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your filters or connect a new account
                  </p>
                  <ConnectAccountDialog
                    onConnect={handleConnect}
                    connectedPlatforms={connectedPlatforms}
                  >
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Connect Account
                    </Button>
                  </ConnectAccountDialog>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {activeAccounts.map((account) => (
              <SocialAccountCard
                key={account.id}
                account={account}
                metrics={mockMetrics[account.id]}
                onReconnect={handleReconnect}
                onManage={handleManage}
                onDisconnect={handleDisconnect}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="warning" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {warningAccounts.map((account) => (
              <SocialAccountCard
                key={account.id}
                account={account}
                metrics={mockMetrics[account.id]}
                onReconnect={handleReconnect}
                onManage={handleManage}
                onDisconnect={handleDisconnect}
              />
            ))}
          </div>
          {warningAccounts.length === 0 && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <p className="text-lg font-semibold">All accounts are healthy!</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    No accounts need attention at this time
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <RecentActivity activities={recentActivities} />
    </div>
  )
}
