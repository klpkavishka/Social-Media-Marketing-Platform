import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Workflow, WorkflowStatus } from '@/lib/types/workflow';
import { MoreVertical, Play, Power, PowerOff, Edit, Trash2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface WorkflowCardProps {
  workflow: Workflow;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onExecute?: (id: string) => void;
  onToggleStatus?: (id: string, status: WorkflowStatus) => void;
}

export function WorkflowCard({
  workflow,
  onView,
  onEdit,
  onDelete,
  onExecute,
  onToggleStatus,
}: WorkflowCardProps) {
  const isActive = workflow.status === WorkflowStatus.ACTIVE;

  const getTriggerCount = () => {
    if (!workflow.triggers) return 0;
    return Object.keys(workflow.triggers).length;
  };

  const getActionCount = () => {
    return workflow.actions?.length || 0;
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3
              className="font-semibold text-lg cursor-pointer hover:text-primary"
              onClick={() => onView?.(workflow.id)}
            >
              {workflow.name}
            </h3>
            <Badge variant={isActive ? 'default' : 'secondary'}>
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          {workflow.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {workflow.description}
            </p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onExecute?.(workflow.id)}>
              <Play className="mr-2 h-4 w-4" />
              Execute Now
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                onToggleStatus?.(
                  workflow.id,
                  isActive ? WorkflowStatus.INACTIVE : WorkflowStatus.ACTIVE
                )
              }
            >
              {isActive ? (
                <>
                  <PowerOff className="mr-2 h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <Power className="mr-2 h-4 w-4" />
                  Activate
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit?.(workflow.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete?.(workflow.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="font-medium">{getTriggerCount()}</span>
            <span>Trigger{getTriggerCount() !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">{getActionCount()}</span>
            <span>Action{getActionCount() !== 1 ? 's' : ''}</span>
          </div>
        </div>
        {workflow.lastExecutedAt && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              Last executed{' '}
              {formatDistanceToNow(new Date(workflow.lastExecutedAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        )}
        <div className="text-xs text-muted-foreground">
          Created {formatDistanceToNow(new Date(workflow.createdAt), { addSuffix: true })}
        </div>
      </CardContent>
    </Card>
  );
}
