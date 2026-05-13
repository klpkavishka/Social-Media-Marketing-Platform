'use client'

interface CharacterCounterProps {
  content: string
  platform?: string
}

const platformLimits: Record<string, number> = {
  instagram: 2200,
  facebook: 63206,
  twitter: 280,
  linkedin: 3000,
}

export function CharacterCounter({ content, platform = 'instagram' }: CharacterCounterProps) {
  const limit = platformLimits[platform] || 2200
  const count = content.length
  const percentage = (count / limit) * 100

  const getColor = () => {
    if (percentage < 50) return 'bg-green-500'
    if (percentage < 80) return 'bg-yellow-500'
    if (percentage < 100) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getTextColor = () => {
    if (percentage < 50) return 'text-green-600 dark:text-green-400'
    if (percentage < 80) return 'text-yellow-600 dark:text-yellow-400'
    if (percentage < 100) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Character Count</span>
        <span className={`text-sm font-semibold ${getTextColor()}`}>
          {count} / {limit}
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-300`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {count > limit && (
        <p className="text-xs text-red-600 dark:text-red-400">
          ⚠️ Exceeds limit by {count - limit} characters
        </p>
      )}
    </div>
  )
}
