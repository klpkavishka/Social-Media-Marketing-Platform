'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { MapPin, Users, Clock } from 'lucide-react'

interface AgeGroup {
  label: string
  value: number
}

interface Gender {
  label: string
  value: number
}

interface Location {
  country: string
  percentage: number
  followers: number
}

interface ActiveHour {
  hour: string
  value: number
}

interface AudienceDemographicsProps {
  ageGroups?: AgeGroup[]
  gender?: Gender[]
  topLocations?: Location[]
  activeHours?: ActiveHour[]
  className?: string
}

export function AudienceDemographics({
  ageGroups = [],
  gender = [],
  topLocations = [],
  activeHours = [],
  className,
}: AudienceDemographicsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const maxActiveHour = Math.max(...activeHours.map(h => h.value))

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Audience Demographics</CardTitle>
        <CardDescription>
          Insights about your audience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="age" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="age">Age</TabsTrigger>
            <TabsTrigger value="gender">Gender</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Age Groups Tab */}
          <TabsContent value="age" className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Age Distribution</span>
            </div>
            {ageGroups.map((group) => (
              <div key={group.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{group.label}</span>
                  <span className="text-muted-foreground">{group.value}%</span>
                </div>
                <Progress value={group.value} className="h-2" />
              </div>
            ))}
            {ageGroups.length === 0 && (
              <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                No age data available
              </div>
            )}
          </TabsContent>

          {/* Gender Tab */}
          <TabsContent value="gender" className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Gender Distribution</span>
            </div>
            {gender.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-muted-foreground">{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
            {gender.length === 0 && (
              <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                No gender data available
              </div>
            )}
          </TabsContent>

          {/* Location Tab */}
          <TabsContent value="location" className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Top Locations</span>
            </div>
            {topLocations.map((location, index) => (
              <div key={location.country} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{location.country}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(location.followers)} followers
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{location.percentage}%</p>
                </div>
              </div>
            ))}
            {topLocations.length === 0 && (
              <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                No location data available
              </div>
            )}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Peak Activity Hours</span>
            </div>
            <div className="space-y-3">
              {activeHours.map((hour) => {
                const widthPercentage = (hour.value / maxActiveHour) * 100
                return (
                  <div key={hour.hour} className="flex items-center space-x-3">
                    <span className="w-16 text-xs font-medium">{hour.hour}</span>
                    <div className="flex-1">
                      <div className="h-8 w-full rounded-md bg-muted overflow-hidden">
                        {/* eslint-disable-next-line react/forbid-dom-props */}
                        <div
                          className="h-full rounded-md bg-primary transition-all"
                          style={{ width: `${widthPercentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-12 text-right text-xs text-muted-foreground">
                      {hour.value}%
                    </span>
                  </div>
                )
              })}
            </div>
            {activeHours.length === 0 && (
              <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                No activity data available
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
