'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, CheckCircle2 } from 'lucide-react'

type ScheduleType = 'immediately' | 'scheduled' | 'recurring'

interface SchedulingPanelProps {
  onScheduleChange?: (schedule: {
    type: ScheduleType
    date?: string
    time?: string
    recurring?: string
  }) => void
}

export function SchedulingPanel({ onScheduleChange }: SchedulingPanelProps) {
  const [scheduleType, setScheduleType] = useState<ScheduleType>('immediately')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('09:00')
  const [recurring, setRecurring] = useState('none')

  const handleScheduleChange = () => {
    onScheduleChange?.({
      type: scheduleType,
      date: scheduleType !== 'immediately' ? date : undefined,
      time: scheduleType !== 'immediately' ? time : undefined,
      recurring: scheduleType === 'recurring' ? recurring : undefined,
    })
  }

  return (
    <div className="space-y-4 border rounded-lg bg-card p-4">
      <h3 className="text-sm font-semibold">Schedule Post</h3>

      {/* Schedule Type Tabs */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => {
            setScheduleType('immediately')
            handleScheduleChange()
          }}
          className={`p-3 rounded-lg text-sm font-medium transition-all ${
            scheduleType === 'immediately'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <CheckCircle2 className="h-4 w-4 mx-auto mb-1" />
          <span className="text-xs">Now</span>
        </button>

        <button
          onClick={() => setScheduleType('scheduled')}
          className={`p-3 rounded-lg text-sm font-medium transition-all ${
            scheduleType === 'scheduled'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <Calendar className="h-4 w-4 mx-auto mb-1" />
          <span className="text-xs">Scheduled</span>
        </button>

        <button
          onClick={() => setScheduleType('recurring')}
          className={`p-3 rounded-lg text-sm font-medium transition-all ${
            scheduleType === 'recurring'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <Clock className="h-4 w-4 mx-auto mb-1" />
          <span className="text-xs">Recurring</span>
        </button>
      </div>

      {/* Scheduled Options */}
      {scheduleType === 'scheduled' && (
        <div className="space-y-3 pt-3 border-t">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border rounded-lg bg-background text-foreground text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-2">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-background text-foreground text-sm"
            />
          </div>

          {date && (
            <div className="p-2 bg-accent/50 rounded text-xs text-muted-foreground">
              📅 Scheduled for {new Date(date).toLocaleDateString()} at {time}
            </div>
          )}
        </div>
      )}

      {/* Recurring Options */}
      {scheduleType === 'recurring' && (
        <div className="space-y-3 pt-3 border-t">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-2">
              Repeat Every
            </label>
            <select
              value={recurring}
              onChange={(e) => setRecurring(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-background text-foreground text-sm"
            >
              <option value="none">Select frequency</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Every 2 Weeks</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-2">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-background text-foreground text-sm"
            />
          </div>

          {recurring !== 'none' && (
            <div className="p-2 bg-accent/50 rounded text-xs text-muted-foreground">
              🔄 Repeating {recurring} at {time}
            </div>
          )}
        </div>
      )}

      <Button
        onClick={handleScheduleChange}
        className="w-full"
      >
        {scheduleType === 'immediately' ? 'Publish Now' : 'Schedule Post'}
      </Button>
    </div>
  )
}
