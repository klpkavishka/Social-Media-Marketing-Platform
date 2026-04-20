'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  Sparkles,
  Zap,
  Brain,
  FileText,
  Image as ImageIcon,
  TrendingUp,
  Clock,
  Target,
  Info,
} from 'lucide-react'

export default function UniversitySettings() {
  const aiFeatures = [
    {
      name: 'Content Generation',
      icon: FileText,
      description: 'AI-powered content creation and suggestions',
      enabled: true,
      usage: 75,
    },
    {
      name: 'Image Generation',
      icon: ImageIcon,
      description: 'Generate images with AI',
      enabled: true,
      usage: 45,
    },
    {
      name: 'Sentiment Analysis',
      icon: TrendingUp,
      description: 'Analyze audience sentiment',
      enabled: true,
      usage: 60,
    },
    {
      name: 'Optimal Timing',
      icon: Clock,
      description: 'AI-suggested posting times',
      enabled: false,
      usage: 0,
    },
    {
      name: 'Hashtag Suggestions',
      icon: Target,
      description: 'Smart hashtag recommendations',
      enabled: true,
      usage: 85,
    },
  ]

  return (
    <div className="space-y-6">
      {/* AI University Overview */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <CardTitle>UniSocial AI Assistant</CardTitle>
          </div>
          <CardDescription>
            Leverage AI to enhance your social media marketing strategy.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                Monthly Quota
              </div>
              <p className="mt-2 text-2xl font-bold">1,250 / 2,000</p>
              <Progress value={62.5} className="mt-2" />
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4" />
                Active Features
              </div>
              <p className="mt-2 text-2xl font-bold">4 / 5</p>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Brain className="h-4 w-4" />
                AI Score
              </div>
              <p className="mt-2 text-2xl font-bold">8.5 / 10</p>
            </div>
          </div>

          <div className="rounded-lg bg-primary/10 p-4">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Upgrade for More AI Power</p>
                <p className="text-sm text-muted-foreground">
                  Unlock unlimited AI features and advanced analytics with our Pro plan.
                </p>
                <Button size="sm" className="mt-2">
                  Upgrade Now
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Features Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>AI Features</CardTitle>
          <CardDescription>
            Enable or disable specific AI capabilities for your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {aiFeatures.map((feature, index) => (
            <div key={feature.name}>
              {index > 0 && <Separator className="my-4" />}
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-muted bg-muted">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{feature.name}</p>
                      {feature.enabled && (
                        <Badge variant="default">Active</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                    {feature.enabled && (
                      <div className="flex items-center gap-2">
                        <Progress value={feature.usage} className="h-2 w-32" />
                        <span className="text-xs text-muted-foreground">
                          {feature.usage}% usage
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <Switch defaultChecked={feature.enabled} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Content Generation Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Content Generation Preferences</CardTitle>
          <CardDescription>
            Customize how AI generates content for your brand.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tone">Brand Voice & Tone</Label>
            <select
              id="tone"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option>Professional</option>
              <option>Casual & Friendly</option>
              <option>Formal</option>
              <option>Playful & Creative</option>
              <option>Educational</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="creativity">Creativity Level</Label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                id="creativity"
                min="0"
                max="100"
                defaultValue="70"
                className="flex-1"
              />
              <span className="text-sm font-medium">70%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Higher values produce more creative and varied content
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Target Keywords</Label>
            <Input
              id="keywords"
              placeholder="e.g., social media, marketing, engagement"
              defaultValue="social media, university, students"
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated keywords to include in generated content
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avoid">Words to Avoid</Label>
            <Input id="avoid" placeholder="Words or phrases to exclude" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand-guidelines">Brand Guidelines</Label>
            <Textarea
              id="brand-guidelines"
              placeholder="Describe your brand's personality, values, and key messaging..."
              className="min-h-[100px]"
              defaultValue="Our brand is focused on empowering university students with the tools they need to succeed in social media marketing."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline">Reset to Default</Button>
            <Button>Save Preferences</Button>
          </div>
        </CardContent>
      </Card>

      {/* Image Generation Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Image Generation Settings</CardTitle>
          <CardDescription>
            Configure AI image generation preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="style">Default Style</Label>
            <select
              id="style"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option>Photorealistic</option>
              <option>Digital Art</option>
              <option>Illustration</option>
              <option>Minimalist</option>
              <option>Abstract</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resolution">Resolution</Label>
            <select
              id="resolution"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option>1024x1024 (Square)</option>
              <option>1024x1792 (Portrait)</option>
              <option>1792x1024 (Landscape)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color-palette">Preferred Color Palette</Label>
            <div className="flex gap-2">
              <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-primary bg-blue-500" />
              <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-muted bg-purple-500" />
              <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-muted bg-pink-500" />
              <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-muted bg-green-500" />
              <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-muted bg-orange-500" />
              <Button size="sm" variant="outline" className="ml-2">
                + Add Color
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline">Reset to Default</Button>
            <Button>Save Settings</Button>
          </div>
        </CardContent>
      </Card>

      {/* Analytics & Insights */}
      <Card>
        <CardHeader>
          <CardTitle>AI Analytics Preferences</CardTitle>
          <CardDescription>
            Customize AI-powered analytics and insights.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sentiment Analysis</Label>
              <p className="text-sm text-muted-foreground">
                Analyze sentiment of comments and engagement
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Competitor Analysis</Label>
              <p className="text-sm text-muted-foreground">
                Track and compare competitor performance
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Trend Detection</Label>
              <p className="text-sm text-muted-foreground">
                Automatically detect trending topics and hashtags
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly AI Reports</Label>
              <p className="text-sm text-muted-foreground">
                Receive AI-generated weekly performance reports
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* AI Training Data */}
      <Card>
        <CardHeader>
          <CardTitle>AI Learning & Training</CardTitle>
          <CardDescription>
            Help AI improve by training it with your content preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Learn from My Feedback</Label>
              <p className="text-sm text-muted-foreground">
                Allow AI to learn from your content edits and preferences
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Share Anonymous Usage Data</Label>
              <p className="text-sm text-muted-foreground">
                Help improve AI for everyone (data is fully anonymized)
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="space-y-2">
              <p className="font-medium">Custom Training</p>
              <p className="text-sm text-muted-foreground">
                Upload your existing content library to train AI specifically for your brand.
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Upload Training Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
