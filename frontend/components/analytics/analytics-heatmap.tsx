'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface HeatmapData {
  day: string
  hour: string
  engagement: number
}

interface AnalyticsHeatmapProps {
  data?: HeatmapData[]
}

const defaultData: HeatmapData[] = [
  // Monday
  { day: 'Monday', hour: '8am', engagement: 45 },
  { day: 'Monday', hour: '12pm', engagement: 78 },
  { day: 'Monday', hour: '4pm', engagement: 92 },
  { day: 'Monday', hour: '8pm', engagement: 65 },
  // Tuesday
  { day: 'Tuesday', hour: '8am', engagement: 52 },
  { day: 'Tuesday', hour: '12pm', engagement: 85 },
  { day: 'Tuesday', hour: '4pm', engagement: 88 },
  { day: 'Tuesday', hour: '8pm', engagement: 70 },
  // Wednesday
  { day: 'Wednesday', hour: '8am', engagement: 48 },
  { day: 'Wednesday', hour: '12pm', engagement: 82 },
  { day: 'Wednesday', hour: '4pm', engagement: 95 },
  { day: 'Wednesday', hour: '8pm', engagement: 68 },
  // Thursday
  { day: 'Thursday', hour: '8am', engagement: 60 },
  { day: 'Thursday', hour: '12pm', engagement: 88 },
  { day: 'Thursday', hour: '4pm', engagement: 98 },
  { day: 'Thursday', hour: '8pm', engagement: 72 },
  // Friday
  { day: 'Friday', hour: '8am', engagement: 55 },
  { day: 'Friday', hour: '12pm', engagement: 90 },
  { day: 'Friday', hour: '4pm', engagement: 100 },
  { day: 'Friday', hour: '8pm', engagement: 75 },
  // Saturday
  { day: 'Saturday', hour: '8am', engagement: 40 },
  { day: 'Saturday', hour: '12pm', engagement: 65 },
  { day: 'Saturday', hour: '4pm', engagement: 80 },
  { day: 'Saturday', hour: '8pm', engagement: 85 },
  // Sunday
  { day: 'Sunday', hour: '8am', engagement: 38 },
  { day: 'Sunday', hour: '12pm', engagement: 62 },
  { day: 'Sunday', hour: '4pm', engagement: 78 },
  { day: 'Sunday', hour: '8pm', engagement: 82 },
]

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const hours = ['8am', '12pm', '4pm', '8pm']

const getColor = (value: number) => {
  if (value >= 90) return 'bg-gradient-to-br from-violet-600 to-violet-700'
  if (value >= 75) return 'bg-gradient-to-br from-violet-500 to-violet-600'
  if (value >= 60) return 'bg-gradient-to-br from-violet-400 to-violet-500'
  if (value >= 45) return 'bg-gradient-to-br from-violet-300 to-violet-400'
  return 'bg-gradient-to-br from-violet-200 to-violet-300'
}

export function AnalyticsHeatmap({ data = defaultData }: AnalyticsHeatmapProps) {
  const getValue = (day: string, hour: string) => {
    const item = data.find((d) => d.day === day && d.hour === hour)
    return item?.engagement ?? 0
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Best Posting Times Heatmap</CardTitle>
        <CardDescription>Engagement levels by day and time of week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="space-y-4">
            {/* Legend */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-muted-foreground">Engagement Level:</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 rounded bg-violet-200" title="Low (0-44)" />
                <div className="w-4 h-4 rounded bg-violet-300" title="Fair (45-59)" />
                <div className="w-4 h-4 rounded bg-violet-400" title="Good (60-74)" />
                <div className="w-4 h-4 rounded bg-violet-500" title="Very Good (75-89)" />
                <div className="w-4 h-4 rounded bg-violet-600" title="Excellent (90+)" />
              </div>
            </div>

            {/* Heatmap Grid */}
            <div className="inline-block border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              {/* Header Row */}
              <div className="flex">
                <div className="w-24 h-10 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-semibold text-muted-foreground border-r border-b border-slate-200 dark:border-slate-700" />
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="w-24 h-10 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-semibold text-muted-foreground border-r border-b border-slate-200 dark:border-slate-700"
                  >
                    {hour}
                  </div>
                ))}
              </div>

              {/* Data Rows */}
              {days.map((day) => (
                <div key={day} className="flex">
                  <div className="w-24 h-12 bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-xs font-semibold text-muted-foreground border-r border-b border-slate-200 dark:border-slate-700">
                    {day}
                  </div>
                  {hours.map((hour) => {
                    const value = getValue(day, hour)
                    return (
                      <div
                        key={`${day}-${hour}`}
                        className={`w-24 h-12 flex flex-col items-center justify-center text-xs font-semibold text-white rounded-none border-r border-b border-slate-200 dark:border-slate-700 transition-all hover:scale-110 hover:z-10 cursor-default ${getColor(value)}`}
                        title={`${day} ${hour}: ${value} engagement`}
                      >
                        <span>{value}</span>
                        <span className="text-xs opacity-80">eng.</span>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>

            {/* Insights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-xs font-semibold text-green-900 dark:text-green-200">Best Time</p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400">Friday 4pm</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">Peak Day</p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">Friday</p>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
                <p className="text-xs font-semibold text-orange-900 dark:text-orange-200">Average Engagement</p>
                <p className="text-sm font-bold text-orange-600 dark:text-orange-400">72.3</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
