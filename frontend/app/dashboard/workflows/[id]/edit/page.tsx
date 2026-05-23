'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Plus, Trash2, Zap, Settings, Play, Info, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useWorkflow, useUpdateWorkflow } from '@/lib/hooks/use-workflows'
import { WorkflowStatus } from '@/lib/types/workflow'

export default function EditWorkflowPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: workflow, isLoading } = useWorkflow(params.id)
  const updateWorkflow = useUpdateWorkflow()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: WorkflowStatus.INACTIVE,
    trigger: {
      type: '',
      config: {} as Record<string, any>,
    },
    actions: [
      {
        type: '',
        config: {} as Record<string, any>,
      },
    ],
  })

  // Pre-populate data once query is successful
  useEffect(() => {
    if (workflow) {
      setFormData({
        name: workflow.name || '',
        description: workflow.description || '',
        status: workflow.status || WorkflowStatus.INACTIVE,
        trigger: {
          type: workflow.triggers?.type || '',
          config: workflow.triggers?.config || {},
        },
        actions: Array.isArray(workflow.actions) && workflow.actions.length > 0
          ? workflow.actions.map(action => ({
              type: action.type || '',
              config: action.config || {},
            }))
          : [{ type: '', config: {} }],
      })
    }
  }, [workflow])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.trigger.type) {
      alert('Please select a trigger type.')
      return
    }

    if (formData.actions.some(action => !action.type)) {
      alert('Please select a type for all actions.')
      return
    }

    setIsSubmitting(true)

    try {
      await updateWorkflow.mutateAsync({
        id: params.id,
        data: {
          name: formData.name,
          description: formData.description,
          status: formData.status,
          triggers: formData.trigger,
          actions: formData.actions,
        },
      })
      router.push(`/dashboard/workflows/${params.id}`)
    } catch (error) {
      console.error('Error updating workflow:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addAction = () => {
    setFormData({
      ...formData,
      actions: [...formData.actions, { type: '', config: {} }],
    })
  }

  const removeAction = (index: number) => {
    setFormData({
      ...formData,
      actions: formData.actions.filter((_, i) => i !== index),
    })
  }

  const updateTriggerConfig = (key: string, value: any) => {
    setFormData({
      ...formData,
      trigger: {
        ...formData.trigger,
        config: {
          ...formData.trigger.config,
          [key]: value,
        },
      },
    })
  }

  const updateActionConfig = (actionIndex: number, key: string, value: any) => {
    const newActions = [...formData.actions]
    newActions[actionIndex].config = {
      ...newActions[actionIndex].config,
      [key]: value,
    }
    setFormData({
      ...formData,
      actions: newActions,
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm font-medium">Fetching workflow details...</p>
      </div>
    )
  }

  if (!workflow) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <Zap className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Workflow not found</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          The workflow you are trying to edit does not exist or has been deleted.
        </p>
        <Link href="/dashboard/workflows">
          <Button>Back to Workflows</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/workflows/${params.id}`}>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-muted-foreground/20 hover:bg-muted transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">Edit Workflow</h1>
            <Badge className="bg-primary/10 text-primary border-none px-2.5 py-0.5 text-xs font-semibold">Settings</Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-0.5">
            Modify automation events, triggers, and sequences for this workflow
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <Card className="border-muted-foreground/10 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
          <CardHeader className="border-b border-muted-foreground/5 pb-4">
            <CardTitle className="text-xl flex items-center gap-2.5">
              <span className="p-1.5 rounded-md bg-primary/10 text-primary">
                <Info className="h-4 w-4" />
              </span>
              Basic Information
            </CardTitle>
            <CardDescription>
              Update the workflow name and operational description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">Workflow Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Auto-post seasonal campaign details to Twitter"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-11 border-muted-foreground/20 focus-visible:ring-primary/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
              <Textarea
                id="description"
                placeholder="Explain what events this workflow automates and what the expected outcomes are..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="border-muted-foreground/20 focus-visible:ring-primary/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-semibold">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as WorkflowStatus })
                }
              >
                <SelectTrigger id="status" className="h-11 border-muted-foreground/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={WorkflowStatus.INACTIVE}>Inactive (Draft Mode)</SelectItem>
                  <SelectItem value={WorkflowStatus.ACTIVE}>Active (Live immediately)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Trigger */}
        <Card className="border-muted-foreground/10 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
          <CardHeader className="border-b border-muted-foreground/5 pb-4">
            <CardTitle className="text-xl flex items-center gap-2.5">
              <span className="p-1.5 rounded-md bg-yellow-500/10 text-yellow-500">
                <Zap className="h-4 w-4" />
              </span>
              Trigger Configuration
            </CardTitle>
            <CardDescription>
              Specify the exact event or scheduled condition that initiates this workflow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Trigger Type *</Label>
              <Select
                value={formData.trigger.type}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    trigger: { type: value, config: {} },
                  })
                }
              >
                <SelectTrigger className="h-11 border-muted-foreground/20">
                  <SelectValue placeholder="Choose what starts this workflow..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="schedule">Schedule (Time Interval or Cron)</SelectItem>
                  <SelectItem value="post_published">Post Published (On Social Platform)</SelectItem>
                  <SelectItem value="campaign_started">Campaign Started</SelectItem>
                  <SelectItem value="engagement_threshold">Social Engagement Threshold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic Trigger Config Panels */}
            {formData.trigger.type === 'schedule' && (
              <div className="p-4 rounded-lg border border-dashed border-primary/20 bg-primary/5 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Settings className="h-4 w-4" />
                  Schedule Details
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Cron Expression / Interval</Label>
                    <Input
                      placeholder="e.g., */5 * * * * or 0 9 * * *"
                      value={formData.trigger.config.cron || ''}
                      onChange={(e) => updateTriggerConfig('cron', e.target.value)}
                      className="bg-background border-muted-foreground/20 h-9"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      * Use standard 5-field syntax. `*/5 * * * *` is every 5 minutes, `0 9 * * *` is 9:00 AM daily.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Timezone</Label>
                    <Select
                      value={formData.trigger.config.timezone || 'UTC'}
                      onValueChange={(value) => updateTriggerConfig('timezone', value)}
                    >
                      <SelectTrigger className="bg-background border-muted-foreground/20 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="EST">EST (Eastern)</SelectItem>
                        <SelectItem value="PST">PST (Pacific)</SelectItem>
                        <SelectItem value="GMT">GMT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {formData.trigger.type === 'post_published' && (
              <div className="p-4 rounded-lg border border-dashed border-primary/20 bg-primary/5 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Settings className="h-4 w-4" />
                  Publishing Filters
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Filter by Platform</Label>
                  <Select
                    value={formData.trigger.config.platform || 'all'}
                    onValueChange={(value) => updateTriggerConfig('platform', value)}
                  >
                    <SelectTrigger className="bg-background border-muted-foreground/20 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Linked Platforms</SelectItem>
                      <SelectItem value="twitter">Twitter / X</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {formData.trigger.type === 'campaign_started' && (
              <div className="p-4 rounded-lg border border-dashed border-primary/20 bg-primary/5 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Settings className="h-4 w-4" />
                  Campaign Options
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Campaign Category Filter</Label>
                  <Input
                    placeholder="e.g., Seasonal, Launch (leave blank for all)"
                    value={formData.trigger.config.category || ''}
                    onChange={(e) => updateTriggerConfig('category', e.target.value)}
                    className="bg-background border-muted-foreground/20 h-9"
                  />
                </div>
              </div>
            )}

            {formData.trigger.type === 'engagement_threshold' && (
              <div className="p-4 rounded-lg border border-dashed border-primary/20 bg-primary/5 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Settings className="h-4 w-4" />
                  Threshold Settings
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Minimum Likes</Label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={formData.trigger.config.minLikes || ''}
                      onChange={(e) => updateTriggerConfig('minLikes', e.target.value ? parseInt(e.target.value) : '')}
                      className="bg-background border-muted-foreground/20 h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Minimum Shares</Label>
                    <Input
                      type="number"
                      placeholder="10"
                      value={formData.trigger.config.minShares || ''}
                      onChange={(e) => updateTriggerConfig('minShares', e.target.value ? parseInt(e.target.value) : '')}
                      className="bg-background border-muted-foreground/20 h-9"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="border-muted-foreground/10 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/95 backdrop-blur-sm">
          <CardHeader className="border-b border-muted-foreground/5 pb-4">
            <CardTitle className="text-xl flex items-center gap-2.5">
              <span className="p-1.5 rounded-md bg-green-500/10 text-green-500">
                <Play className="h-4 w-4" />
              </span>
              Action Sequence
            </CardTitle>
            <CardDescription>
              Configure one or more sequential actions to execute automatically when the trigger fires
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {formData.actions.map((action, index) => (
              <div key={index} className="p-5 rounded-lg border border-muted-foreground/15 bg-muted/30 relative space-y-4 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center pb-2 border-b border-muted-foreground/5">
                  <div className="text-sm font-semibold flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[11px] text-primary font-bold">
                      {index + 1}
                    </span>
                    Action Step
                  </div>
                  {formData.actions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAction(index)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-xs font-semibold">Action Type *</Label>
                    <Select
                      value={action.type}
                      onValueChange={(value) => {
                        const newActions = [...formData.actions]
                        newActions[index].type = value
                        newActions[index].config = {}
                        setFormData({ ...formData, actions: newActions })
                      }}
                    >
                      <SelectTrigger className="bg-background border-muted-foreground/20 h-10">
                        <SelectValue placeholder="Choose what happens next..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="send_notification">Send Notification (Realtime In-app)</SelectItem>
                        <SelectItem value="create_post">Create Social Media Draft Post</SelectItem>
                        <SelectItem value="send_email">Send Notification Email</SelectItem>
                        <SelectItem value="generate_report">Generate Campaign PDF Report</SelectItem>
                        <SelectItem value="update_campaign">Update Campaign Status</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Dynamic Action Config Panels */}
                {action.type === 'send_notification' && (
                  <div className="p-4 rounded-md border border-muted-foreground/10 bg-background/50 space-y-3">
                    <div className="text-xs font-semibold text-muted-foreground">Notification Settings</div>
                    <div className="space-y-2">
                      <Label className="text-[11px]">Message Template</Label>
                      <Input
                        placeholder="e.g., Campaign {{campaign.name}} has started successfully!"
                        value={action.config.message || ''}
                        onChange={(e) => updateActionConfig(index, 'message', e.target.value)}
                        className="bg-background border-muted-foreground/20 h-9"
                      />
                    </div>
                  </div>
                )}

                {action.type === 'create_post' && (
                  <div className="p-4 rounded-md border border-muted-foreground/10 bg-background/50 space-y-3">
                    <div className="text-xs font-semibold text-muted-foreground">Post Generator Template</div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <Label className="text-[11px]">Caption / Body Template</Label>
                        <Textarea
                          placeholder="Write the initial draft copy here..."
                          value={action.config.caption || ''}
                          onChange={(e) => updateActionConfig(index, 'caption', e.target.value)}
                          rows={2}
                          className="bg-background border-muted-foreground/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px]">Platform Destination</Label>
                        <Select
                          value={action.config.platform || 'all'}
                          onValueChange={(val) => updateActionConfig(index, 'platform', val)}
                        >
                          <SelectTrigger className="bg-background border-muted-foreground/20 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Linked Accounts</SelectItem>
                            <SelectItem value="twitter">Twitter / X</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {action.type === 'send_email' && (
                  <div className="p-4 rounded-md border border-muted-foreground/10 bg-background/50 space-y-3">
                    <div className="text-xs font-semibold text-muted-foreground">Email Parameters</div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-[11px]">Recipient Address</Label>
                        <Input
                          placeholder="e.g., manager@brand.com"
                          value={action.config.recipient || ''}
                          onChange={(e) => updateActionConfig(index, 'recipient', e.target.value)}
                          className="bg-background border-muted-foreground/20 h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px]">Subject</Label>
                        <Input
                          placeholder="e.g., [Alert] Automation Executed"
                          value={action.config.subject || ''}
                          onChange={(e) => updateActionConfig(index, 'subject', e.target.value)}
                          className="bg-background border-muted-foreground/20 h-9"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label className="text-[11px]">Message Body</Label>
                        <Textarea
                          placeholder="Write the full email text body here..."
                          value={action.config.body || ''}
                          onChange={(e) => updateActionConfig(index, 'body', e.target.value)}
                          rows={2}
                          className="bg-background border-muted-foreground/20"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {action.type === 'generate_report' && (
                  <div className="p-4 rounded-md border border-muted-foreground/10 bg-background/50 space-y-3">
                    <div className="text-xs font-semibold text-muted-foreground">Report Details</div>
                    <div className="space-y-2">
                      <Label className="text-[11px]">Report Type</Label>
                      <Select
                        value={action.config.reportType || 'weekly_analytics'}
                        onValueChange={(val) => updateActionConfig(index, 'reportType', val)}
                      >
                        <SelectTrigger className="bg-background border-muted-foreground/20 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly_analytics">Weekly General Analytics</SelectItem>
                          <SelectItem value="campaign_performance">Specific Campaign Performance</SelectItem>
                          <SelectItem value="engagement_summary">Social Engagement Summary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {action.type === 'update_campaign' && (
                  <div className="p-4 rounded-md border border-muted-foreground/10 bg-background/50 space-y-3">
                    <div className="text-xs font-semibold text-muted-foreground">Campaign Target Status</div>
                    <div className="space-y-2">
                      <Label className="text-[11px]">New Status</Label>
                      <Select
                        value={action.config.status || 'active'}
                        onValueChange={(val) => updateActionConfig(index, 'status', val)}
                      >
                        <SelectTrigger className="bg-background border-muted-foreground/20 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addAction}
              className="gap-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 w-full h-11 transition-all duration-300"
            >
              <Plus className="h-4 w-4" />
              Append Action Step
            </Button>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4 justify-end">
          <Link href={`/dashboard/workflows/${params.id}`}>
            <Button type="button" variant="outline" className="h-11 px-6 rounded-md hover:bg-muted">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} className="h-11 px-8 rounded-md bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-white font-medium shadow-md flex items-center gap-2 transition-all duration-300">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
