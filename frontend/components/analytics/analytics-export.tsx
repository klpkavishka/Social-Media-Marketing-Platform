'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, FileText, Sheet } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

interface AnalyticsExportProps {
  onExport?: (format: 'pdf' | 'csv') => void
  disabled?: boolean
}

export function AnalyticsExport({ onExport, disabled = false }: AnalyticsExportProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: 'pdf' | 'csv') => {
    setIsExporting(true)
    try {
      // Call the provided callback
      onExport?.(format)

      // Simulate export delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, this would trigger the file download
      const filename = `analytics-report-${new Date().toISOString().split('T')[0]}.${
        format === 'pdf' ? 'pdf' : 'csv'
      }`

      // Create a mock file download
      console.log(`Exporting as ${format}: ${filename}`)

      // Show success message
      alert(`Report exported as ${format.toUpperCase()}`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={disabled || isExporting}
          className="gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700"
        >
          <Download size={16} />
          {isExporting ? 'Exporting...' : 'Export Report'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => handleExport('pdf')}
          disabled={isExporting}
          className="gap-2 cursor-pointer"
        >
          <FileText size={16} className="text-red-500" />
          <div>
            <p className="font-medium">Export as PDF</p>
            <p className="text-xs text-muted-foreground">Full report with charts</p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => handleExport('csv')}
          disabled={isExporting}
          className="gap-2 cursor-pointer"
        >
          <Sheet size={16} className="text-green-500" />
          <div>
            <p className="font-medium">Export as CSV</p>
            <p className="text-xs text-muted-foreground">Data table format</p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="p-2 text-xs text-muted-foreground">
          <p className="font-medium mb-1">Report Date Range</p>
          <p>May 1, 2026 - May 11, 2026</p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
