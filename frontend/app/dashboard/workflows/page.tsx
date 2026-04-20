'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, Filter, Search, Loader2, Zap } from 'lucide-react'
import { WorkflowCard } from '@/components/workflows'
import {
  useWorkflows,
  useDeleteWorkflow,
  useExecuteWorkflow,
  useActivateWorkflow,
  useDeactivateWorkflow,
} from '@/lib/hooks/use-workflows'
import { Workflow, WorkflowStatus } from '@/lib/types/workflow'

export default function WorkflowsPage() {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [page] = useState(1)
  const limit = 12

  // Fetch workflows with filters
  const { data: workflowsData, isLoading } = useWorkflows({
    status: statusFilter.length === 1 ? statusFilter[0] : undefined,
    page,
    limit,
  })

  const deleteWorkflow = useDeleteWorkflow()
  const executeWorkflow = useExecuteWorkflow()
  const activateWorkflow = useActivateWorkflow()
  const deactivateWorkflow = useDeactivateWorkflow()

  const workflows: Workflow[] = Array.isArray(workflowsData?.data)
    ? workflowsData.data
    : []

  const handleView = (id: string) => {
    router.push(`/dashboard/workflows/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/dashboard/workflows/${id}/edit`)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      deleteWorkflow.mutate(id)
    }
  }

  const handleExecute = (id: string) => {
    executeWorkflow.mutate(id)
  }

  const handleToggleStatus = (id: string, status: WorkflowStatus) => {
    if (status === WorkflowStatus.ACTIVE) {
      activateWorkflow.mutate(id)
    } else {
      deactivateWorkflow.mutate(id)
    }
  }

  // Filter workflows by search query
  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesSearch =
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const getWorkflowCount = (status: string) => {
    return workflows.filter((w) => w.status === status).length
  }

  const handleStatusFilterChange = (status: string, checked: boolean) => {
    if (checked) {
      setStatusFilter([status])
    } else {
      setStatusFilter(statusFilter.filter((s) => s !== status))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">
            Automate your marketing tasks with custom workflows
          </p>
        </div>
        <Link href="/dashboard/workflows/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Workflow
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Workflows</p>
          <p className="text-2xl font-bold">{workflowsData?.meta?.total || 0}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {getWorkflowCount('active')}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Inactive</p>
          <p className="text-2xl font-bold text-gray-600">
            {getWorkflowCount('inactive')}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-600" />
            <p className="text-sm text-muted-foreground">Automations</p>
          </div>
          <p className="text-2xl font-bold">
            {workflows.reduce((acc, w) => acc + (w.actions?.length || 0), 0)}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
              {statusFilter.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {statusFilter.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={statusFilter.includes('active')}
              onCheckedChange={(checked) =>
                handleStatusFilterChange('active', checked)
              }
            >
              Active
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilter.includes('inactive')}
              onCheckedChange={(checked) =>
                handleStatusFilterChange('inactive', checked)
              }
            >
              Inactive
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Workflows Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredWorkflows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Zap className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No workflows found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first workflow'}
          </p>
          {!searchQuery && (
            <Link href="/dashboard/workflows/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Workflow
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredWorkflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onExecute={handleExecute}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      {/* Pagination Info */}
      {workflowsData?.meta && filteredWorkflows.length > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          Showing {filteredWorkflows.length} of {workflowsData.meta.total} workflows
        </div>
      )}
    </div>
  )
}
