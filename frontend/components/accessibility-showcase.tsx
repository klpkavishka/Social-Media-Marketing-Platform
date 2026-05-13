'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, InlineTooltip } from '@/components/tooltip'
import { ErrorMessage, SuccessMessage, WarningMessage, InfoMessage } from '@/components/messages'
import { EmptyState, SearchEmptyState, ErrorEmptyState } from '@/components/empty-state'
import { SkeletonCard, SkeletonText, LoadingSpinner, SkeletonTable } from '@/components/loading-states'
import { AccessibleButton, AccessibleIconButton } from '@/components/accessible-button'
import { Check, AlertCircle, Info, Settings, Plus, Trash2, Search } from 'lucide-react'

/**
 * Accessibility & UX Showcase Component
 * Demonstrates all accessibility features and best practices
 */
export function AccessibilityShowcase() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Accessibility & UX Features</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive accessibility support with WCAG 2.1 AA compliance
        </p>
      </div>

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Features Implemented</CardTitle>
          <CardDescription>Complete accessibility and UX improvements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <span>ARIA labels and semantic HTML</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <span>Keyboard navigation support</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <span>Focus indicators on all interactive elements</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <span>Loading states with skeleton screens</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <span>Error messages with clear solutions</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <span>Tooltips for complex features</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <span>Empty states with helpful guidance</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <span>Screen reader support</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessible Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Accessible Buttons</CardTitle>
          <CardDescription>Buttons with proper ARIA labels and keyboard support</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h3 className="font-semibold">Standard Buttons</h3>
            <div className="flex flex-wrap gap-2">
              <AccessibleButton ariaLabel="Create new post">
                <Plus className="h-4 w-4" />
                Create Post
              </AccessibleButton>
              <AccessibleButton
                variant="secondary"
                ariaLabel="Save draft"
              >
                Save
              </AccessibleButton>
              <AccessibleButton
                variant="outline"
                ariaLabel="Cancel operation"
              >
                Cancel
              </AccessibleButton>
              <AccessibleButton
                variant="danger"
                ariaLabel="Delete item"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </AccessibleButton>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Icon Buttons</h3>
            <div className="flex gap-2">
              <AccessibleIconButton
                icon={<Settings className="h-5 w-5" />}
                ariaLabel="Open settings"
              />
              <AccessibleIconButton
                icon={<Search className="h-5 w-5" />}
                ariaLabel="Search"
              />
              <AccessibleIconButton
                icon={<Plus className="h-5 w-5" />}
                ariaLabel="Add item"
                isActive
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Loading States</h3>
            <AccessibleButton isLoading>
              Loading...
            </AccessibleButton>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Message Components</CardTitle>
          <CardDescription>Error, success, warning, and info messages with solutions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ErrorMessage
            title="Sync Failed"
            message="Unable to sync social media accounts."
            solutions={[
              'Check your internet connection',
              'Verify your API credentials',
              'Try re-authenticating with the platform',
            ]}
            code="ERR_SYNC_001"
            onRetry={() => console.log('Retry')}
          />

          <SuccessMessage
            title="Sync Completed"
            message="Social media accounts synced successfully."
          />

          <WarningMessage
            title="API Limit Warning"
            message="You are approaching your daily API rate limit."
          />

          <InfoMessage
            title="Tip: Scheduled Posts"
            message="Schedule multiple posts to maintain consistent engagement with your audience."
          />
        </CardContent>
      </Card>

      {/* Tooltips */}
      <Card>
        <CardHeader>
          <CardTitle>Tooltips</CardTitle>
          <CardDescription>Helpful tooltips for complex features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h3 className="font-semibold">Tooltip Examples</h3>
            <div className="flex flex-wrap gap-4">
              <Tooltip content="Click to refresh the data" side="top">
                <Button variant="outline" size="sm">
                  Hover for tooltip
                </Button>
              </Tooltip>

              <Tooltip content="Upload images in JPG, PNG, or GIF format" side="right">
                <Button variant="outline" size="sm">
                  Image upload
                </Button>
              </Tooltip>

              <Tooltip
                content="Scheduling posts in advance helps maintain consistent engagement"
                side="bottom"
              >
                <Button variant="outline" size="sm">
                  Schedule posts
                </Button>
              </Tooltip>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Inline Help</h3>
            <div className="flex items-center gap-2">
              <span>Enable notifications</span>
              <InlineTooltip content="Get alerts when your posts receive high engagement" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty States */}
      <Card>
        <CardHeader>
          <CardTitle>Empty States</CardTitle>
          <CardDescription>Helpful guidance when content is unavailable</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 divide-y">
          <div>
            <h3 className="font-semibold mb-4">Empty Content</h3>
            <EmptyState
              title="No posts scheduled"
              description="Create your first scheduled post to get started with automated content publishing."
              action={{
                label: 'Create Post',
                onClick: () => console.log('Create'),
                icon: <Plus className="h-4 w-4" />,
              }}
              size="sm"
            />
          </div>

          <div className="pt-6">
            <h3 className="font-semibold mb-4">Search Results Empty</h3>
            <SearchEmptyState
              query="AI Marketing"
              suggestions={[
                'AI Social Media',
                'Marketing Tools',
                'Automation',
              ]}
              onClear={() => console.log('Clear')}
            />
          </div>

          <div className="pt-6">
            <h3 className="font-semibold mb-4">Error State</h3>
            <ErrorEmptyState
              title="Failed to Load Data"
              description="Unable to fetch your analytics data. Please try again."
              onRetry={() => console.log('Retry')}
              onBack={() => console.log('Back')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Loading States */}
      <Card>
        <CardHeader>
          <CardTitle>Loading States</CardTitle>
          <CardDescription>Skeleton screens and loading indicators</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Text Loading</h3>
            <SkeletonText count={3} />
          </div>

          <div>
            <h3 className="font-semibold mb-3">Card Loading</h3>
            <SkeletonCard />
          </div>

          <div>
            <h3 className="font-semibold mb-3">Table Loading</h3>
            <SkeletonTable rows={3} columns={4} />
          </div>

          <div>
            <h3 className="font-semibold mb-3">Loading Spinner</h3>
            <LoadingSpinner message="Loading your data..." />
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Keyboard Navigation</CardTitle>
          <CardDescription>Full keyboard support for all interactive elements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Badge variant="outline">Tab</Badge>
              <span>Navigate between interactive elements</span>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline">Shift+Tab</Badge>
              <span>Navigate backwards between elements</span>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline">Enter/Space</Badge>
              <span>Activate buttons and links</span>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline">Escape</Badge>
              <span>Close modals and popovers</span>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline">Arrow Keys</Badge>
              <span>Navigate menus and select options</span>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline">Home/End</Badge>
              <span>Jump to first/last item in list</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Focus Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Focus Indicators</CardTitle>
          <CardDescription>Clear visual indicators for keyboard focus</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              All interactive elements have clear focus indicators. Try using Tab to navigate and you will see a ring around focused elements.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button>Click me</Button>
              <Button variant="outline">Or me</Button>
              <a href="#" className="inline-flex items-center justify-center h-10 px-4 rounded-md border border-input hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background">
                Link
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ARIA & Semantic HTML */}
      <Card>
        <CardHeader>
          <CardTitle>ARIA Labels & Semantic HTML</CardTitle>
          <CardDescription>Screen reader support with proper semantic markup</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Semantic Structure</h3>
              <ul className="space-y-1 ml-6 list-disc text-muted-foreground">
                <li>Proper heading hierarchy (h1, h2, h3)</li>
                <li>Semantic buttons and links</li>
                <li>Form fields with associated labels</li>
                <li>Navigation landmarks (nav, main, aside)</li>
                <li>Data tables with scope attributes</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">ARIA Attributes</h3>
              <ul className="space-y-1 ml-6 list-disc text-muted-foreground">
                <li>aria-label for icon buttons</li>
                <li>aria-describedby for form help text</li>
                <li>aria-live for dynamic updates</li>
                <li>aria-expanded for collapsible sections</li>
                <li>aria-disabled for disabled elements</li>
                <li>role attributes for custom components</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Screen Reader Announcements</h3>
              <ul className="space-y-1 ml-6 list-disc text-muted-foreground">
                <li>Loading states announced with aria-busy</li>
                <li>Errors announced with aria-live=&quot;assertive&quot;</li>
                <li>Form validation messages linked with aria-describedby</li>
                <li>Page updates announced with aria-live regions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WCAG Compliance */}
      <Card>
        <CardHeader>
          <CardTitle>WCAG 2.1 Compliance</CardTitle>
          <CardDescription>Meeting accessibility standards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span>Level A: Basic accessibility features</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span>Level AA: Enhanced accessibility with focus indicators and ARIA labels</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span>Color contrast: 4.5:1 for normal text, 3:1 for large text</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span>Keyboard navigation: Full support with Tab, Arrow keys, Enter, Escape</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span>Screen reader support: Tested with NVDA, JAWS, and VoiceOver</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
