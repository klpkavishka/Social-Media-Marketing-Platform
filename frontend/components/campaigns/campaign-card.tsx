'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Edit, Trash, Eye, BarChart3, Calendar, DollarSign } from 'lucide-react'
import { Campaign } from '@/lib/api/campaigns'
import { format } from 'date-fns'

interface CampaignCardProps {
  campaign: Campaign
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const statusColors = {
  draft: 'bg-gray-500',
  active: 'bg-green-500',
  paused: 'bg-yellow-500',
  completed: 'bg-blue-500',
}

const statusLabels = {
  draft: 'Draft',
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
}

export function CampaignCard({ campaign, onView, onEdit, onDelete }: CampaignCardProps) {
  const formatDate = (date?: string) => {
    if (!date) return 'Not set'
    return format(new Date(date), 'MMM dd, yyyy')
  }

  const getDuration = () => {
    if (!campaign.startDate || !campaign.endDate) return 'Duration not set'
    const start = new Date(campaign.startDate)
    const end = new Date(campaign.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return `${days} days`
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{campaign.name}</CardTitle>
            <Badge className={statusColors[campaign.status]}>
              {statusLabels[campaign.status]}
            </Badge>
          </div>
          {campaign.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {campaign.description}
            </p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(campaign.id)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(campaign.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(campaign.id)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Start Date</p>
              <p className="text-sm font-medium">{formatDate(campaign.startDate)}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">End Date</p>
              <p className="text-sm font-medium">{formatDate(campaign.endDate)}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Budget</p>
              <p className="text-sm font-medium">
                {campaign.budget ? `$${campaign.budget.toLocaleString()}` : 'Not set'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="text-sm font-medium">{getDuration()}</p>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => onView(campaign.id)}
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          View Analytics
        </Button>
      </CardContent>
    </Card>
  )
}
