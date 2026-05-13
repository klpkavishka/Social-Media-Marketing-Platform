'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DateRangePickerProps {
  onDateRangeChange?: (startDate: string, endDate: string) => void
  defaultStartDate?: string
  defaultEndDate?: string
}

export function AnalyticsDateRangePicker({
  onDateRangeChange,
  defaultStartDate = '2026-04-11',
  defaultEndDate = '2026-05-11'
}: DateRangePickerProps) {
  const [startDate, setStartDate] = useState(defaultStartDate)
  const [endDate, setEndDate] = useState(defaultEndDate)
  const [presetActive, setPresetActive] = useState<string | null>(null)

  const handlePreset = (days: number, label: string) => {
    const end = new Date()
    const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000)

    const startStr = start.toISOString().split('T')[0]
    const endStr = end.toISOString().split('T')[0]

    setStartDate(startStr)
    setEndDate(endStr)
    setPresetActive(label)
    onDateRangeChange?.(startStr, endStr)
  }

  const handleCustomChange = () => {
    if (startDate && endDate) {
      setPresetActive(null)
      onDateRangeChange?.(startDate, endDate)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDaysDifference = () => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={presetActive === '7 Days' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePreset(7, '7 Days')}
          className={presetActive === '7 Days' ? 'bg-gradient-to-r from-violet-600 to-cyan-600' : ''}
        >
          Last 7 Days
        </Button>
        <Button
          variant={presetActive === '30 Days' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePreset(30, '30 Days')}
          className={presetActive === '30 Days' ? 'bg-gradient-to-r from-violet-600 to-cyan-600' : ''}
        >
          Last 30 Days
        </Button>
        <Button
          variant={presetActive === '90 Days' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePreset(90, '90 Days')}
          className={presetActive === '90 Days' ? 'bg-gradient-to-r from-violet-600 to-cyan-600' : ''}
        >
          Last 90 Days
        </Button>
        <Button
          variant={presetActive === '1 Year' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePreset(365, '1 Year')}
          className={presetActive === '1 Year' ? 'bg-gradient-to-r from-violet-600 to-cyan-600' : ''}
        >
          Last Year
        </Button>
      </div>

      {/* Custom Date Range */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start gap-2 flex-1"
            >
              <Calendar size={16} />
              <span>
                {formatDate(startDate)}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Start Date</h4>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full"
              />
              <Button
                onClick={handleCustomChange}
                className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700"
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex items-center justify-center text-muted-foreground font-medium">
          →
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start gap-2 flex-1"
            >
              <Calendar size={16} />
              <span>
                {formatDate(endDate)}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">End Date</h4>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full"
              />
              <Button
                onClick={handleCustomChange}
                className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700"
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Info Text */}
      <div className="text-xs text-muted-foreground">
        Showing data for {getDaysDifference()} days
      </div>
    </div>
  )
}
