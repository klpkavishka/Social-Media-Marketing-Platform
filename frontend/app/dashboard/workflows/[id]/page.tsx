'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Play, Edit, Trash2, Power, PowerOff, Clock, Zap } from 'lucide-react'
import Link from 'next/link'
import {
  useWorkflow,
  useDeleteWorkflow,
  useExecuteWorkflow,
  useActivateWorkflow,
  useDeactivateWorkflow,
} from '@/lib/hooks/use-workflows'
import { WorkflowStatus } from '@/lib/types/workflow'
import { formatDistanceToNow } from 'date-fns'

export default function WorkflowDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: workflow, isLoading } = useWorkflow(params.id)
  const deleteWorkflow = useDeleteWorkflow()
  const executeWorkflow = useExecuteWorkflow()
  const activateWorkflow = useActivateWorkflow()
  const deactivateWorkflow = useDeactivateWorkflow()

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      await deleteWorkflow.mutateAsync(params.id)
      router.push('/dashboard/workflows')
    }
  }

  const handleExecute = () => {
    executeWorkflow.mutate(params.id)
  }

  const handleToggleStatus = () => {
    if (workflow?.status === WorkflowStatus.ACTIVE) {
      deactivateWorkflow.mutate(params.id)
    } else {
      activateWorkflow.mutate(params.id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading workflow...</p>
        </div>
      </div>
    )
  }

  if (!workflow) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Workflow not found</h3>
          <p className="text-muted-foreground mb-4">
            The workflow you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/dashboard/workflows">
            <Button>Back to Workflows</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isActive = workflow.status === WorkflowStatus.ACTIVE

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/workflows">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold">{workflow.name}</h1>
              <Badge variant={isActive ? 'default' : 'secondary'}>
                {isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            {workflow.description && (
              <p className="text-muted-foreground">{workflow.description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleExecute}>
            <Play className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleToggleStatus}>
            {isActive ? (
              <PowerOff className="h-4 w-4" />
            ) : (
              <Power className="h-4 w-4" />
            )}
          </Button>
          <Link href={`/dashboard/workflows/${params.id}/edit`}>
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="outline" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Created
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {formatDistanceToNow(new Date(workflow.createdAt), {
                addSuffix: true,
              })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Last Updated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {formatDistanceToNow(new Date(workflow.updatedAt), {
                addSuffix: true,
              })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Last Executed
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {workflow.lastExecutedAt
                ? formatDistanceToNow(new Date(workflow.lastExecutedAt), {
                    addSuffix: true,
                  })
                : 'Never'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trigger */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Trigger
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted p-4">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(workflow.triggers, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions ({workflow.actions?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {workflow.actions && workflow.actions.length > 0 ? (
            workflow.actions.map((action, index) => (
              <div key={index} className="rounded-lg bg-muted p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">Action {index + 1}</Badge>
                </div>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(action, null, 2)}
                </pre>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No actions configured</p>
          )}
        </CardContent>
      </Card>

      {/* Actions Bar */}
      <div className="flex gap-4 justify-end pb-8">
        <Link href="/dashboard/workflows">
          <Button variant="outline">Back to Workflows</Button>
        </Link>
        <Link href={`/dashboard/workflows/${params.id}/edit`}>
          <Button className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Workflow
          </Button>
        </Link>
      </div>
    </div>
  )
}
