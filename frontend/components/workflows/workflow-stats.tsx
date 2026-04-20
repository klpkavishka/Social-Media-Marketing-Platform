import { Card, CardContent } from '@/components/ui/card';
import { Zap, Power, Activity } from 'lucide-react';

interface WorkflowStatsProps {
  total: number;
  active: number;
  inactive: number;
  totalActions?: number;
}

export function WorkflowStats({
  total,
  active,
  inactive,
  totalActions = 0,
}: WorkflowStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Workflows</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
            <Activity className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-600">{active}</p>
            </div>
            <Power className="h-8 w-8 text-green-600 opacity-50" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Inactive</p>
              <p className="text-2xl font-bold text-gray-600">{inactive}</p>
            </div>
            <Power className="h-8 w-8 text-gray-600 opacity-50" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Actions</p>
              <p className="text-2xl font-bold">{totalActions}</p>
            </div>
            <Zap className="h-8 w-8 text-yellow-600 opacity-50" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
