'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Check,
  X,
  ExternalLink,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'

export default function IntegrationsSettings() {
  const socialAccounts = [
    {
      name: 'Facebook',
      icon: Facebook,
      connected: true,
      username: '@company_social',
      followers: '12.5K',
      status: 'active',
      color: 'text-blue-600',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      connected: true,
      username: '@company_social',
      followers: '25.3K',
      status: 'active',
      color: 'text-pink-600',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      connected: true,
      username: '@company_social',
      followers: '8.2K',
      status: 'warning',
      color: 'text-blue-400',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      connected: false,
      username: null,
      followers: null,
      status: null,
      color: 'text-blue-700',
    },
    {
      name: 'YouTube',
      icon: Youtube,
      connected: false,
      username: null,
      followers: null,
      status: null,
      color: 'text-red-600',
    },
  ]

  const tools = [
    {
      name: 'Google Analytics',
      description: 'Track website and campaign performance',
      connected: true,
      logo: '📊',
    },
    {
      name: 'Canva',
      description: 'Design graphics and visual content',
      connected: true,
      logo: '🎨',
    },
    {
      name: 'Slack',
      description: 'Team communication and notifications',
      connected: false,
      logo: '💬',
    },
    {
      name: 'Zapier',
      description: 'Automate workflows and integrations',
      connected: false,
      logo: '⚡',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Social Media Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Accounts</CardTitle>
          <CardDescription>
            Connect your social media accounts to manage and publish content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {socialAccounts.map((account, index) => (
            <div key={account.name}>
              {index > 0 && <Separator className="my-4" />}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 ${account.connected ? 'border-primary bg-primary/10' : 'border-muted bg-muted'}`}>
                    <account.icon className={`h-6 w-6 ${account.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{account.name}</p>
                      {account.connected && (
                        <Badge
                          variant={account.status === 'active' ? 'default' : 'secondary'}
                          className="gap-1"
                        >
                          {account.status === 'active' ? (
                            <>
                              <Check className="h-3 w-3" />
                              Connected
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-3 w-3" />
                              Needs Attention
                            </>
                          )}
                        </Badge>
                      )}
                    </div>
                    {account.connected ? (
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{account.username}</span>
                        <span>•</span>
                        <span>{account.followers} followers</span>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Not connected</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {account.connected ? (
                    <>
                      {account.status === 'warning' && (
                        <Button size="sm" variant="outline">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Reconnect
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Manage
                      </Button>
                      <Button size="sm" variant="ghost">
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button size="sm">Connect</Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Third-Party Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Third-Party Integrations</CardTitle>
          <CardDescription>
            Connect external tools to enhance your workflow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tools.map((tool, index) => (
            <div key={tool.name}>
              {index > 0 && <Separator className="my-4" />}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-muted bg-muted text-2xl">
                    {tool.logo}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{tool.name}</p>
                      {tool.connected && (
                        <Badge variant="default" className="gap-1">
                          <Check className="h-3 w-3" />
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {tool.connected ? (
                    <>
                      <Button size="sm" variant="outline">
                        Configure
                      </Button>
                      <Button size="sm" variant="ghost">
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button size="sm">Connect</Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* API Access */}
      <Card>
        <CardHeader>
          <CardTitle>API Access</CardTitle>
          <CardDescription>
            Manage API keys and access tokens for custom integrations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="font-mono text-sm font-medium">pk_live_51Hxxx...xxxx</p>
                <p className="text-sm text-muted-foreground">Created on Jan 15, 2024</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Copy
                </Button>
                <Button size="sm" variant="ghost">
                  Revoke
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="font-mono text-sm font-medium">pk_test_51Hyyy...yyyy</p>
                <p className="text-sm text-muted-foreground">Created on Feb 3, 2024</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Copy
                </Button>
                <Button size="sm" variant="ghost">
                  Revoke
                </Button>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            Generate New API Key
          </Button>
        </CardContent>
      </Card>

      {/* Webhooks */}
      <Card>
        <CardHeader>
          <CardTitle>Webhooks</CardTitle>
          <CardDescription>
            Configure webhooks to receive real-time updates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex-1">
                <p className="font-mono text-sm">https://api.example.com/webhook</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="secondary">post.created</Badge>
                  <Badge variant="secondary">post.published</Badge>
                  <Badge variant="secondary">analytics.updated</Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch defaultChecked />
                <Button size="sm" variant="ghost">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            Add Webhook
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
