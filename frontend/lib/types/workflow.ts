export enum WorkflowStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: WorkflowStatus;
  triggers: Record<string, any>;
  actions: Record<string, any>[];
  lastExecutedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkflowDto {
  name: string;
  description?: string;
  status?: WorkflowStatus;
  triggers: Record<string, any>;
  actions: Record<string, any>[];
}

export interface UpdateWorkflowDto {
  name?: string;
  description?: string;
  status?: WorkflowStatus;
  triggers?: Record<string, any>;
  actions?: Record<string, any>[];
}

export interface WorkflowsResponse {
  data: Workflow[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
