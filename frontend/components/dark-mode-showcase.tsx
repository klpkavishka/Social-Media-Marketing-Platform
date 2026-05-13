'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CodeBlock } from '@/components/code-block'
import { Check, AlertCircle, Info } from 'lucide-react'

/**
 * Dark Mode Showcase Component
 * Demonstrates dark mode support and accessibility features
 */
export function DarkModeShowcase() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = resolvedTheme === 'dark'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Dark Mode Showcase</h1>
        <p className="text-muted-foreground mt-2">
          Complete dark mode support with WCAG AA+ contrast ratios and optimized colors
        </p>
      </div>

      {/* Current Theme Status */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Status</CardTitle>
          <CardDescription>Current theme mode</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 rounded-lg border-2 ${isDark ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
            <div>
              <p className="font-medium capitalize">{resolvedTheme} Mode</p>
              <p className="text-sm text-muted-foreground">
                {isDark
                  ? 'Optimized colors for reduced eye strain in low-light environments'
                  : 'Standard colors for well-lit environments'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Features */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Features</CardTitle>
          <CardDescription>WCAG 2.1 compliance verification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <span>WCAG AA+ Contrast Ratios (4.5:1 minimum for normal text)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <span>High-contrast primary and secondary colors</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <span>Optimized chart colors for both themes</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <span>Consistent border and shadow styling</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <span>Syntax highlighting for code blocks</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
          <CardDescription>Current theme colors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="h-24 rounded-lg bg-primary" />
              <p className="text-sm font-medium">Primary</p>
              <p className="text-xs text-muted-foreground">hsl(270 100% {isDark ? '65' : '55'}%)</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 rounded-lg bg-secondary" />
              <p className="text-sm font-medium">Secondary</p>
              <p className="text-xs text-muted-foreground">hsl(200 100% {isDark ? '60' : '50'}%)</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 rounded-lg bg-accent" />
              <p className="text-sm font-medium">Accent</p>
              <p className="text-xs text-muted-foreground">hsl(180 100% {isDark ? '60' : '50'}%)</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 rounded-lg bg-destructive" />
              <p className="text-sm font-medium">Destructive</p>
              <p className="text-xs text-muted-foreground">For warnings and errors</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 rounded-lg bg-card border border-border" />
              <p className="text-sm font-medium">Card</p>
              <p className="text-xs text-muted-foreground">Surface colors</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 rounded-lg bg-muted" />
              <p className="text-sm font-medium">Muted</p>
              <p className="text-xs text-muted-foreground">Secondary surfaces</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Components Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Component Examples</CardTitle>
          <CardDescription>Interactive components with dark mode support</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Buttons */}
          <div className="space-y-3">
            <h3 className="font-semibold">Buttons</h3>
            <div className="flex flex-wrap gap-2">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-3">
            <h3 className="font-semibold">Badges</h3>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-3">
            <h3 className="font-semibold">Progress Bars</h3>
            <div className="space-y-2">
              <Progress value={33} />
              <Progress value={66} />
              <Progress value={100} />
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-3">
            <h3 className="font-semibold">Cards</h3>
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-base">Nested Card</CardTitle>
                <CardDescription>Proper contrast in dark mode</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Content with proper text contrast ratios for accessibility</p>
              </CardContent>
            </Card>
          </div>

          {/* Alerts */}
          <div className="space-y-3">
            <h3 className="font-semibold">Alert Examples</h3>
            <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">Success</p>
                <p className="text-sm text-green-700 dark:text-green-300">Operation completed successfully</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="font-medium text-amber-900 dark:text-amber-100">Warning</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">Please review before proceeding</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">Information</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">This is an informational message</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Example */}
      <CodeBlock
        code={`// Using dark mode in components
import { useTheme } from 'next-themes'

export function MyComponent() {
  const { theme, resolvedTheme } = useTheme()
  
  return (
    <div className={
      resolvedTheme === 'dark' 
        ? 'bg-slate-950 text-white' 
        : 'bg-white text-black'
    }>
      {resolvedTheme === 'dark' ? '🌙' : '☀️'} {theme}
    </div>
  )
}`}
        language="typescript"
        title="Dark Mode Example"
      />

      {/* Features List */}
      <Card>
        <CardHeader>
          <CardTitle>Features Implemented</CardTitle>
          <CardDescription>Complete dark mode support</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Full dark mode support throughout the entire application</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>WCAG AA+ contrast ratios for accessibility</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Syntax highlighting for code blocks</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Chart colors optimized for dark mode</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Theme switcher in top navigation</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>System theme detection support</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Smooth animations and transitions</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Consistent styling across all components</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
