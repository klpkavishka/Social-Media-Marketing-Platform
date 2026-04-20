'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MetricData } from '@/lib/types/analytics'
import { useMemo } from 'react'

interface EngagementChartProps {
  data?: MetricData[]
  title?: string
  description?: string
  showTabs?: boolean
  className?: string
}

export function EngagementChart({
  data = [],
  title = 'Engagement Overview',
  description = 'Your engagement metrics over time',
  showTabs = true,
  className,
}: EngagementChartProps) {
  const chartData = useMemo(() => {
    if (data.length === 0) return { max: 0, points: [] }
    
    const values = data.map(d => d.value)
    const max = Math.max(...values)
    const min = Math.min(...values)
    const range = max - min
    
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((item.value - min) / range) * 100
      return { x, y, ...item }
    })
    
    return { max, min, points }
  }, [data])

  const formatValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
    return value.toString()
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const renderChart = () => (
    <div className="mt-6 h-[300px] w-full">
      <svg
        className="h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        <line x1="0" y1="25" x2="100" y2="25" stroke="currentColor" strokeWidth="0.1" opacity="0.1" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.1" opacity="0.1" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="currentColor" strokeWidth="0.1" opacity="0.1" />
        
        {/* Area under curve */}
        {chartData.points.length > 0 && (
          <path
            d={`
              M 0,100
              ${chartData.points.map(p => `L ${p.x},${p.y}`).join(' ')}
              L 100,100
              Z
            `}
            fill="hsl(var(--primary))"
            opacity="0.1"
          />
        )}
        
        {/* Line */}
        {chartData.points.length > 0 && (
          <polyline
            points={chartData.points.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        
        {/* Data points */}
        {chartData.points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="1"
            fill="hsl(var(--primary))"
            className="transition-all hover:r-2"
          >
            <title>{`${formatDate(point.date)}: ${formatValue(point.value)}`}</title>
          </circle>
        ))}
      </svg>
      
      {/* X-axis labels */}
      {data.length > 0 && (
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{formatDate(data[0].date)}</span>
          {data.length > 2 && (
            <span>{formatDate(data[Math.floor(data.length / 2)].date)}</span>
          )}
          <span>{formatDate(data[data.length - 1].date)}</span>
        </div>
      )}
    </div>
  )

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {showTabs ? (
          <Tabs defaultValue="7d" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="7d">7 Days</TabsTrigger>
              <TabsTrigger value="30d">30 Days</TabsTrigger>
              <TabsTrigger value="90d">90 Days</TabsTrigger>
              <TabsTrigger value="1y">1 Year</TabsTrigger>
            </TabsList>
            <TabsContent value="7d">
              {renderChart()}
            </TabsContent>
            <TabsContent value="30d">
              {renderChart()}
            </TabsContent>
            <TabsContent value="90d">
              {renderChart()}
            </TabsContent>
            <TabsContent value="1y">
              {renderChart()}
            </TabsContent>
          </Tabs>
        ) : (
          renderChart()
        )}
        
        {data.length === 0 && (
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}
