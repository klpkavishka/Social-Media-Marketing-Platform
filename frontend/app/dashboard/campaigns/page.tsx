'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, Filter, Search, Loader2, Package } from 'lucide-react'
import { CampaignCard } from '@/components/campaigns/campaign-card'
import { useCampaigns, useDeleteCampaign } from '@/lib/hooks/use-campaigns'
import { Campaign } from '@/lib/api/campaigns'

export default function CampaignsPage() {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [page] = useState(1)
  const limit = 12

  // Fetch campaigns with filters
  const { data: campaignsData, isLoading } = useCampaigns({
    status: statusFilter.length === 1 ? statusFilter[0] : undefined,
    page,
    limit,
  })

  const deleteCampaign = useDeleteCampaign()

  const campaigns: Campaign[] = Array.isArray(campaignsData?.data)
    ? campaignsData.data
    : []

  const handleView = (id: string) => {
    router.push(`/dashboard/campaigns/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/dashboard/campaigns/${id}/edit`)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      deleteCampaign.mutate(id)
    }
  }

  // Filter campaigns by search query
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  }) || []

  const getCampaignCount = (status: string) => {
    return campaigns.filter((c) => c.status === status).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            Plan, track, and optimize your marketing campaigns
          </p>
        </div>
        <Link href="/dashboard/campaigns/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Campaigns</p>
          <p className="text-2xl font-bold">{campaignsData?.meta?.total || 0}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {getCampaignCount('active')}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Paused</p>
          <p className="text-2xl font-bold text-yellow-600">
            {getCampaignCount('paused')}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold text-blue-600">
            {getCampaignCount('completed')}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="default" className="gap-2">
              <Filter className="h-4 w-4" />
              Status
              {statusFilter.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1">
                  {statusFilter.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {['draft', 'active', 'paused', 'completed'].map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={statusFilter.includes(status)}
                onCheckedChange={(checked: boolean) => {
                  setStatusFilter((prev) =>
                    checked
                      ? [...prev, status]
                      : prev.filter((s) => s !== status)
                  )
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredCampaigns.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {searchQuery || statusFilter.length > 0
              ? 'No campaigns found'
              : 'No campaigns yet'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter.length > 0
              ? 'Try adjusting your filters or search query'
              : 'Get started by creating your first campaign'}
          </p>
          {!searchQuery && statusFilter.length === 0 && (
            <Link href="/dashboard/campaigns/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Campaign
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Campaigns Grid */}
      {!isLoading && filteredCampaigns.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination Info */}
      {!isLoading && filteredCampaigns.length > 0 && campaignsData?.meta && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredCampaigns.length} of {campaignsData.meta.total} campaigns
          </p>
          {campaignsData.meta.totalPages > 1 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
