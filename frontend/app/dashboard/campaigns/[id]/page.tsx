'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Edit,
  Trash,
  Calendar as CalendarIcon,
  DollarSign,
  Target,
  Loader2,
} from 'lucide-react'
import { format } from 'date-fns'
import { useCampaignById, useCampaignAnalytics, useDeleteCampaign, useCampaignContents } from '@/lib/hooks/use-campaigns'
import { CampaignAnalyticsComponent } from '@/components/campaigns/campaign-analytics'
import { cn } from '@/lib/utils'

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

export default function CampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const campaignId = params.id as string

  const { data: campaign, isLoading: campaignLoading } = useCampaignById(campaignId)
  const { data: analytics, isLoading: analyticsLoading } = useCampaignAnalytics(campaignId)
  const { data: contents, isLoading: contentsLoading } = useCampaignContents(campaignId)
  const deleteCampaign = useDeleteCampaign()

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      deleteCampaign.mutate(campaignId, {
        onSuccess: () => {
          router.push('/dashboard/campaigns')
        },
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Loading state or not found */}
      {!campaign && campaignLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Loading campaign...</h3>
          </CardContent>
        </Card>
      ) : !campaign ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Campaign not found</h3>
            <p className="text-muted-foreground mb-4">The campaign you are looking for does not exist or has been deleted.</p>
            <Link href="/dashboard/campaigns">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Campaigns
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Back Navigation */}
          <div>
            <Link href="/dashboard/campaigns">
              <Button variant="ghost" size="sm" className="gap-2 mb-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Campaigns
              </Button>
            </Link>
          </div>

          {/* Premium Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b pb-6">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
                <Badge className={cn('text-xs font-semibold py-1 px-3.5 capitalize text-white', statusColors[campaign.status])}>
                  {statusLabels[campaign.status]}
                </Badge>
              </div>
              {campaign.description && (
                <p className="text-muted-foreground text-base max-w-3xl">
                  {campaign.description}
                </p>
              )}
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center gap-3">
              <Link href={`/dashboard/campaigns/${campaignId}/edit`}>
                <Button variant="outline" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Campaign
                </Button>
              </Link>
              <Button 
                variant="destructive" 
                className="gap-2" 
                onClick={handleDelete}
                disabled={deleteCampaign.isPending}
              >
                {deleteCampaign.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash className="h-4 w-4" />
                )}
                Delete
              </Button>
            </div>
          </div>

          {/* Campaign Overview Details Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Start Date</CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {campaign.startDate
                    ? format(new Date(campaign.startDate), 'MMM dd, yyyy')
                    : 'Not set'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Campaign begins</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">End Date</CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {campaign.endDate
                    ? format(new Date(campaign.endDate), 'MMM dd, yyyy')
                    : 'Not set'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Campaign ends</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Budget</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${campaign.budget.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Total allocated</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Content / Analytics / Targeting Tabs */}
          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="targeting">Targeting</TabsTrigger>
            </TabsList>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              {analyticsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : analytics ? (
                <CampaignAnalyticsComponent analytics={analytics} />
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Target className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No analytics data yet</h3>
                    <p className="text-muted-foreground text-center">
                      Analytics will appear here once your campaign starts generating data
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Associated Content</CardTitle>
                </CardHeader>
                <CardContent>
                  {contentsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : contents && contents.length > 0 ? (
                    <div className="space-y-4">
                      {contents.map((content) => (
                        <div
                          key={content.id}
                          className="flex items-start justify-between p-4 border rounded-lg"
                        >
                          <div className="space-y-1">
                            <h4 className="font-semibold">{content.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {content.body}
                            </p>
                            <div className="flex items-center gap-2 pt-2">
                              <Badge variant="outline" className="capitalize">
                                {content.type}
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {content.status}
                              </Badge>
                            </div>
                          </div>
                          <Link href={`/dashboard/content/${content.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Target className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No content assigned</h3>
                      <p className="text-muted-foreground mb-4">
                        Add content posts to this campaign to track their performance
                      </p>
                      <Link href="/dashboard/content">
                        <Button>Browse Content</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Targeting Tab */}
            <TabsContent value="targeting" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Target Audience */}
                <Card>
                  <CardHeader>
                    <CardTitle>Target Audience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {campaign.targetAudience && Object.keys(campaign.targetAudience).length > 0 ? (
                      <div className="space-y-4">
                        {campaign.targetAudience.ageRange && (
                          <div>
                            <p className="text-sm font-medium mb-1">Age Range</p>
                            <p className="text-sm text-muted-foreground">
                              {campaign.targetAudience.ageRange.min} -{' '}
                              {campaign.targetAudience.ageRange.max} years
                            </p>
                          </div>
                        )}
                        {campaign.targetAudience.locations && campaign.targetAudience.locations.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-1">Locations</p>
                            <div className="flex flex-wrap gap-2">
                              {campaign.targetAudience.locations.map((location) => (
                                <Badge key={location} variant="secondary">
                                  {location}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {campaign.targetAudience.interests && campaign.targetAudience.interests.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-1">Interests</p>
                            <div className="flex flex-wrap gap-2">
                              {campaign.targetAudience.interests.map((interest) => (
                                <Badge key={interest} variant="secondary">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {campaign.targetAudience.languages && campaign.targetAudience.languages.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-1">Languages</p>
                            <div className="flex flex-wrap gap-2">
                              {campaign.targetAudience.languages.map((language) => (
                                <Badge key={language} variant="secondary">
                                  {language}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No target audience defined</p>
                    )}
                  </CardContent>
                </Card>

                {/* Platforms */}
                <Card>
                  <CardHeader>
                    <CardTitle>Platforms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {campaign.platforms && campaign.platforms.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {campaign.platforms.map((platform) => (
                          <Badge key={platform} variant="secondary" className="capitalize">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No platforms selected</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Additional Targeting Configuration */}
              {campaign.targeting && Object.keys(campaign.targeting).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Targeting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                      {JSON.stringify(campaign.targeting, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
