'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useCreateWorkflow } from '@/lib/hooks/use-workflows'
import { WorkflowStatus } from '@/lib/types/workflow'

export default function NewWorkflowPage() {
  const router = useRouter()
  const createWorkflow = useCreateWorkflow()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: WorkflowStatus.INACTIVE,
    trigger: {
      type: '',
      config: {},
    },
    actions: [
      {
        type: '',
        config: {},
      },
    ],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await createWorkflow.mutateAsync({
        name: formData.name,
        description: formData.description,
        status: formData.status,
        triggers: formData.trigger,
        actions: formData.actions,
      })
      router.push('/dashboard/workflows')
    } catch (error) {
      console.error('Error creating workflow:', error)
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/workflows">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Workflow</h1>
          <p className="text-muted-foreground">
            Set up automation for your marketing tasks
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Give your workflow a name and description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workflow Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Auto-post to social media"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this workflow does..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Initial Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as WorkflowStatus })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={WorkflowStatus.INACTIVE}>Inactive</SelectItem>
                  <SelectItem value={WorkflowStatus.ACTIVE}>Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Trigger */}
        <Card>
          <CardHeader>
            <CardTitle>Trigger</CardTitle>
            <CardDescription>
              What event should start this workflow?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Trigger Type</Label>
              <Select
                value={formData.trigger.type}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    trigger: { ...formData.trigger, type: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a trigger..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="schedule">Schedule</SelectItem>
                  <SelectItem value="post_published">Post Published</SelectItem>
                  <SelectItem value="campaign_started">Campaign Started</SelectItem>
                  <SelectItem value="engagement_threshold">
                    Engagement Threshold
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>
              What should happen when this workflow runs?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.actions.map((action, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1 space-y-2">
                  <Label>Action {index + 1}</Label>
                  <Select
                    value={action.type}
                    onValueChange={(value) => {
                      const newActions = [...formData.actions]
                      newActions[index].type = value
                      setFormData({ ...formData, actions: newActions })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an action..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="send_notification">
                        Send Notification
                      </SelectItem>
                      <SelectItem value="create_post">Create Post</SelectItem>
                      <SelectItem value="send_email">Send Email</SelectItem>
                      <SelectItem value="generate_report">
                        Generate Report
                      </SelectItem>
                      <SelectItem value="update_campaign">
                        Update Campaign
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.actions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAction(index)}
                    className="mt-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addAction}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Action
            </Button>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4 justify-end">
          <Link href="/dashboard/workflows">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Workflow'}
          </Button>
        </div>
      </form>
    </div>
  )
}
